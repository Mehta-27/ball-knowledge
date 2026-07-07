import unicodedata
import re
from difflib import SequenceMatcher
from sqlalchemy.orm import Session

from orm.player import PlayerORM
from orm.player_match_stat import PlayerMatchStatORM
from models.player_mapping import PlayerMapping
from repositories.player_mapping_repository import PlayerMappingRepository
from mappers.player_mapping_mapper import player_mapping_to_orm
from core.logging import logger

FUZZY_THRESHOLD = 0.85

PLAYER_NAME_ALIASES: dict[str, list[str]] = {
    "Neymar": ["Neymar Jr", "Neymar da Silva Santos Junior"],
    "Cristiano Ronaldo": ["C. Ronaldo", "Cristiano Ronaldo dos Santos Aveiro"],
    "Lionel Messi": ["L. Messi", "Lionel Andres Messi"],
    "Kylian Mbappe": ["K. Mbappe", "Kylian Mbappe Lottin"],
    "Ronaldinho": ["Ronaldo de Assis Moreira"],
    "Kaka": ["Ricardo Izecson dos Santos Leite"],
    "Fred": ["Frederico Rodrigues de Paula Santos"],
    "Danilo": ["Danilo Luiz da Silva"],
    "Thiago Silva": ["Thiago Emiliano Silva"],
}


def _strip_diacritics(s: str) -> str:
    nfkd = unicodedata.normalize("NFKD", s)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def _normalize(s: str) -> str:
    s = _strip_diacritics(s)
    s = s.lower()
    s = s.replace("�", "")
    s = re.sub(r"[^a-z0-9\s]", "", s)
    return " ".join(s.split())


def _get_variants(name: str) -> set[str]:
    variants = {_normalize(name)}
    n = _normalize(name)
    for key, aliases in PLAYER_NAME_ALIASES.items():
        if _normalize(key) == n:
            for alias in aliases:
                variants.add(_normalize(alias))
    for key, aliases in PLAYER_NAME_ALIASES.items():
        for alias in aliases:
            if _normalize(alias) == n:
                variants.add(_normalize(key))
                break
    return variants


def _fuzzy_ratio(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()


class PlayerMappingSyncService:
    def __init__(
        self,
        session: Session,
        mapping_repository: PlayerMappingRepository,
    ):
        self.session = session
        self.mapping_repository = mapping_repository

    def sync_mappings(self):
        fifa_players = self.session.query(PlayerORM).all()

        fotmob_rows = (
            self.session.query(
                PlayerMatchStatORM.fotmob_player_id,
                PlayerMatchStatORM.player_name,
            )
            .distinct()
            .all()
        )

        fotmob_players: dict[int, str] = {}
        for row in fotmob_rows:
            pid = row.fotmob_player_id
            if pid not in fotmob_players:
                fotmob_players[pid] = row.player_name

        norm_fotmob: list[tuple[int, str, str]] = [
            (pid, name, _normalize(name)) for pid, name in fotmob_players.items()
        ]

        matched: list[PlayerMapping] = []
        unmatched: list[tuple[int, str]] = []
        ambiguous: list[tuple[int, str, list[tuple[int, str, float]]]] = []

        for player in fifa_players:
            norm_fifa = _normalize(player.name)
            norm_fifa_short = _normalize(player.short_name) if player.short_name else ""
            fifa_variants = _get_variants(player.name)
            if player.short_name:
                fifa_variants.update(_get_variants(player.short_name))

            candidates: list[tuple[int, str, float, str]] = []

            for pid, raw_name, norm_name in norm_fotmob:
                if norm_name == norm_fifa or (
                    norm_fifa_short and norm_name == norm_fifa_short
                ):
                    candidates.append((pid, raw_name, 1.0, "exact"))
                    continue

                if norm_name in fifa_variants:
                    candidates.append((pid, raw_name, 0.95, "alias"))
                    continue

                ratio_f = _fuzzy_ratio(norm_name, norm_fifa)
                ratio_s = (
                    _fuzzy_ratio(norm_name, norm_fifa_short) if norm_fifa_short else 0
                )
                best_ratio = max(ratio_f, ratio_s)
                if best_ratio >= FUZZY_THRESHOLD:
                    candidates.append((pid, raw_name, best_ratio, "fuzzy"))

            exacts = [c for c in candidates if c[3] == "exact"]
            aliases = [c for c in candidates if c[3] == "alias"]
            fuzzies = [c for c in candidates if c[3] == "fuzzy"]

            if len(exacts) == 1:
                pid, raw_name, ratio, mtype = exacts[0]
                matched.append(
                    PlayerMapping(
                        fifa_player_id=player.id,
                        fotmob_player_id=pid,
                        match_type=mtype,
                        confidence=ratio,
                    )
                )
            elif len(exacts) > 1:
                ambiguous.append(
                    (
                        player.id,
                        player.name,
                        [(p, n, r) for p, n, r, _ in exacts],
                    )
                )
            elif len(aliases) == 1:
                pid, raw_name, ratio, mtype = aliases[0]
                matched.append(
                    PlayerMapping(
                        fifa_player_id=player.id,
                        fotmob_player_id=pid,
                        match_type=mtype,
                        confidence=ratio,
                    )
                )
            elif len(aliases) > 1:
                ambiguous.append(
                    (
                        player.id,
                        player.name,
                        [(p, n, r) for p, n, r, _ in aliases],
                    )
                )
            elif len(fuzzies) == 1:
                pid, raw_name, ratio, mtype = fuzzies[0]
                matched.append(
                    PlayerMapping(
                        fifa_player_id=player.id,
                        fotmob_player_id=pid,
                        match_type=mtype,
                        confidence=ratio,
                    )
                )
            elif len(fuzzies) > 1:
                ambiguous.append(
                    (
                        player.id,
                        player.name,
                        [(p, n, r) for p, n, r, _ in fuzzies],
                    )
                )
            else:
                unmatched.append((player.id, player.name))

        resolved, new_ambiguous = self._resolve_collisions(matched)
        ambiguous.extend(new_ambiguous)

        rows_inserted = 0
        rows_updated = 0
        for mapping in resolved:
            orm_obj = player_mapping_to_orm(mapping)
            result = self.mapping_repository.upsert(orm_obj)
            if result == "inserted":
                rows_inserted += 1
            else:
                rows_updated += 1

        self._log_report(
            fifa_players,
            resolved,
            unmatched,
            ambiguous,
            rows_inserted,
            rows_updated,
        )

    @staticmethod
    def _resolve_collisions(
        matched: list[PlayerMapping],
    ) -> tuple[
        list[PlayerMapping], list[tuple[int, str, list[tuple[int, str, float]]]]
    ]:
        by_fotmob: dict[int, list[PlayerMapping]] = {}
        for m in matched:
            by_fotmob.setdefault(m.fotmob_player_id, []).append(m)

        resolved: list[PlayerMapping] = []
        ambiguous: list[tuple[int, str, list[tuple[int, str, float]]]] = []

        for fotmob_id, mappings in by_fotmob.items():
            if len(mappings) == 1:
                resolved.append(mappings[0])
            else:
                best = max(
                    mappings,
                    key=lambda m: (
                        {"exact": 3, "alias": 2, "fuzzy": 1}[m.match_type],
                        m.confidence,
                    ),
                )
                resolved.append(best)
                for m in mappings:
                    if m.fifa_player_id != best.fifa_player_id:
                        ambiguous.append(
                            (
                                m.fifa_player_id,
                                f"FIFA player {m.fifa_player_id}",
                                [(fotmob_id, f"FotMob {fotmob_id}", m.confidence)],
                            )
                        )

        return resolved, ambiguous

    def _log_report(
        self,
        all_players: list[PlayerORM],
        matched: list[PlayerMapping],
        unmatched: list[tuple[int, str]],
        ambiguous: list[tuple[int, str, list[tuple[int, str, float]]]],
        rows_inserted: int,
        rows_updated: int,
    ):
        sep = "=" * 60
        logger.info(sep)
        logger.info("  Player Mapping Report")
        logger.info(sep)
        total = len(all_players)
        exacts = sum(1 for m in matched if m.match_type == "exact")
        aliases = sum(1 for m in matched if m.match_type == "alias")
        fuzzies = sum(1 for m in matched if m.match_type == "fuzzy")
        logger.info(f"  Players processed:  {total}")
        logger.info(f"  Exact matches:      {exacts}")
        logger.info(f"  Alias matches:      {aliases}")
        logger.info(f"  Fuzzy matches:      {fuzzies}")
        logger.info(f"  Ambiguous:          {len(ambiguous)}")
        logger.info(f"  Unmatched:          {len(unmatched)}")
        logger.info(f"  Rows inserted:      {rows_inserted}")
        logger.info(f"  Rows updated:       {rows_updated}")
        logger.info(sep)
        logger.info("")

        if matched:
            logger.info("  [Matched]")
            for m in matched:
                icon = {"exact": "[OK]", "alias": "[A]", "fuzzy": "[~]"}.get(
                    m.match_type, "[?]"
                )
                logger.info(
                    f"    {icon} FIFA {m.fifa_player_id} -> FotMob {m.fotmob_player_id} ({m.match_type}, conf={m.confidence:.2f})"
                )
            logger.info("")

        if unmatched:
            logger.info("  [Unmatched]")
            for fid, name in unmatched:
                logger.info(f"    [!!] FIFA {fid} ({name}) — no FotMob match")
            logger.info("")

        if ambiguous:
            logger.info("  [Ambiguous — skipped]")
            for fid, name, candidates in ambiguous:
                logger.info(f"    [?] FIFA {fid} ({name})")
                for pid, pname, ratio in candidates:
                    logger.info(f"        - FotMob {pid} ({pname}) conf={ratio:.2f}")
            logger.info("")

        logger.info(sep)
