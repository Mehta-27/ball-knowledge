import unicodedata
import re
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from orm.match import MatchORM
from orm.team import TeamORM
from orm.match_mapping import MatchMappingORM

from models.match_mapping import FotMobSearchResult, MatchMapping

from scraper.fotmob_scraper import FotMobScraper, TEAM_NAME_ALIASES

from repositories.match_mapping_repository import MatchMappingRepository

from mappers.match_mapping_mapper import match_mapping_to_orm
from core.logging import logger

FIFA_WORLD_CUP_COMPETITION_ID = 17
DATE_TOLERANCE_DAYS = 2


def _strip_diacritics(s: str) -> str:
    nfkd = unicodedata.normalize("NFKD", s)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def _normalize(s: str) -> str:
    s = _strip_diacritics(s)
    s = s.lower()
    s = s.replace("�", "")
    s = re.sub(r"[^a-z0-9\s]", "", s)
    return " ".join(s.split())


def _get_variants(fifa_name: str) -> set[str]:
    variants = {_normalize(fifa_name)}
    for fifa_key, aliases in TEAM_NAME_ALIASES.items():
        if _normalize(fifa_key) == _normalize(fifa_name):
            for alias in aliases:
                variants.add(_normalize(alias))
    for fifa_key, aliases in TEAM_NAME_ALIASES.items():
        for alias in aliases:
            if _normalize(alias) == _normalize(fifa_name):
                variants.add(_normalize(fifa_key))
                break
    return variants


def _names_match(
    fifa_home: str, fifa_away: str, fotmob_home: str, fotmob_away: str
) -> bool:
    home_variants = _get_variants(fifa_home)
    away_variants = _get_variants(fifa_away)
    fm_home = _normalize(fotmob_home)
    fm_away = _normalize(fotmob_away)
    return (fm_home in home_variants and fm_away in away_variants) or (
        fm_home in away_variants and fm_away in home_variants
    )


def _dates_close(fifa_date: datetime, fotmob_date: datetime) -> bool:
    f = fifa_date.replace(tzinfo=None)
    fm = fotmob_date.replace(tzinfo=None)
    diff = abs(f - fm)
    return diff <= timedelta(days=DATE_TOLERANCE_DAYS)


def _fotmob_date_str(match: MatchORM) -> str:
    return match.date.strftime("%Y%m%d")


class FotMobMappingSyncService:
    def __init__(
        self,
        session: Session,
        mapping_repository: MatchMappingRepository,
        fotmob_scraper: FotMobScraper,
    ):
        self.session = session
        self.mapping_repository = mapping_repository
        self.fotmob_scraper = fotmob_scraper

    def sync_mappings(self):
        matches = (
            self.session.query(MatchORM)
            .filter(MatchORM.competition_id == FIFA_WORLD_CUP_COMPETITION_ID)
            .all()
        )

        team_cache: dict[int, TeamORM] = {}
        for m in matches:
            if m.home_team_id not in team_cache:
                t = self.session.get(TeamORM, m.home_team_id)
                if t:
                    team_cache[m.home_team_id] = t
            if m.away_team_id not in team_cache:
                t = self.session.get(TeamORM, m.away_team_id)
                if t:
                    team_cache[m.away_team_id] = t

        matched: list[MatchMapping] = []
        unmatched: list[tuple[int, str, str, str]] = []
        ambiguous: list[tuple[int, str, str, str, list[FotMobSearchResult]]] = []

        for match in matches:
            home_team = team_cache.get(match.home_team_id)
            away_team = team_cache.get(match.away_team_id)
            if home_team is None or away_team is None:
                unmatched.append((match.id, "?", "?", str(match.date)))
                continue

            home_name = home_team.name
            away_name = away_team.name
            date_str = str(match.date)

            candidates = self.fotmob_scraper.search_by_teams(home_name, away_name)

            world_cup_candidates = [c for c in candidates if c.league_id == 77]

            if not world_cup_candidates:
                date_based = self.fotmob_scraper.search_by_date(_fotmob_date_str(match))
                world_cup_candidates = [c for c in date_based if c.league_id == 77]

            valid = []
            for c in world_cup_candidates:
                if not _dates_close(match.date, c.match_date):
                    continue
                if _names_match(home_name, away_name, c.home_name, c.away_name):
                    valid.append(c)

            if len(valid) == 1:
                c = valid[0]
                confidence = (
                    "exact"
                    if (
                        _normalize(home_name) == _normalize(c.home_name)
                        and _normalize(away_name) == _normalize(c.away_name)
                        and _dates_close(match.date, c.match_date)
                    )
                    else "fuzzy"
                )
                mapping = MatchMapping(
                    fifa_match_id=match.id,
                    fotmob_match_id=c.fotmob_match_id,
                    fotmob_page_url=None,
                    home_team_name=c.home_name,
                    away_team_name=c.away_name,
                    match_date=c.match_date,
                    confidence=confidence,
                )
                matched.append(mapping)
            elif len(valid) == 0:
                unmatched.append((match.id, home_name, away_name, date_str))
            else:
                ambiguous.append((match.id, home_name, away_name, date_str, valid))

        for mapping in matched:
            orm_obj = match_mapping_to_orm(mapping)
            self.mapping_repository.upsert(orm_obj)

        self._log_report(matches, matched, unmatched, ambiguous)

    def _log_report(
        self,
        all_matches: list[MatchORM],
        matched: list[MatchMapping],
        unmatched: list[tuple[int, str, str, str]],
        ambiguous: list[tuple[int, str, str, str, list[FotMobSearchResult]]],
    ):
        sep = "=" * 60
        logger.info(sep)
        logger.info("  FotMob Mapping Report")
        logger.info(sep)
        total = len(all_matches)
        logger.info(f"  Total FIFA matches: {total}")
        logger.info(f"  Matched:           {len(matched)}")
        logger.info(f"  Unmatched:         {len(unmatched)}")
        logger.info(f"  Ambiguous:         {len(ambiguous)}")
        logger.info(sep)
        logger.info("")

        if matched:
            logger.info("  [Matched]")
            for m in matched:
                icon = "[OK]" if m.confidence == "exact" else "[~]"
                logger.info(
                    f"    {icon} FIFA {m.fifa_match_id} -> FotMob {m.fotmob_match_id} ({m.home_team_name} vs {m.away_team_name}) [{m.confidence}]"
                )
            logger.info("")

        if unmatched:
            logger.info("  [Unmatched]")
            for fid, home, away, d in unmatched:
                logger.info(
                    f"    [!!] FIFA {fid} ({home} vs {away}) on {d} - No FotMob result found"
                )
            logger.info("")

        if ambiguous:
            logger.info("  [Ambiguous - skipped]")
            for fid, home, away, d, candidates in ambiguous:
                logger.info(f"    [?] FIFA {fid} ({home} vs {away}) on {d}")
                for c in candidates:
                    logger.info(
                        f"        - FotMob {c.fotmob_match_id} ({c.home_name} vs {c.away_name}) on {c.match_date.date()}"
                    )
            logger.info("")

        logger.info(sep)
