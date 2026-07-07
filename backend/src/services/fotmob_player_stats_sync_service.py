from sqlalchemy.orm import Session

from orm.match_mapping import MatchMappingORM
from orm.match import MatchORM
from models.player_match_stat import PlayerMatchStat
from scraper.fotmob_player_stats_scraper import FotMobPlayerStatsScraper
from repositories.player_match_stat_repository import PlayerMatchStatRepository
from mappers.player_match_stat_mapper import player_match_stat_to_orm
from core.logging import logger

PLAYER_STAT_COLUMNS = [
    "rating",
    "minutes_played",
    "goals",
    "assists",
    "xG",
    "xA",
    "xG_non_penalty",
    "xG_on_target_faced",
    "xG_on_target_variant",
    "xG_plus_xA",
    "total_shots",
    "shots_on_target",
    "shots_off_target",
    "shot_accuracy",
    "blocked_shots",
    "shots_woodwork",
    "touches",
    "touches_opposition_box",
    "passes_into_final_third",
    "accurate_passes",
    "accurate_crosses",
    "long_balls_accurate",
    "corners",
    "dispossessed",
    "chances_created",
    "big_chances_created",
    "defensive_actions",
    "tackles",
    "interceptions",
    "clearances",
    "headed_clearances",
    "recoveries",
    "duels_won",
    "duels_lost",
    "ground_duels_won",
    "aerials_won",
    "dribbles_succeeded",
    "fouls",
    "was_fouled",
    "offsides",
    "dribbled_past",
    "saves",
    "saves_inside_box",
    "goals_conceded",
    "goals_prevented",
    "keeper_diving_saves",
    "keeper_high_claims",
    "keeper_sweeper_actions",
    "punches",
    "errors_led_to_goal",
    "player_throws",
]


class FotMobPlayerStatsSyncService:
    def __init__(
        self,
        session: Session,
        stats_repository: PlayerMatchStatRepository,
        stats_scraper: FotMobPlayerStatsScraper,
    ):
        self.session = session
        self.stats_repository = stats_repository
        self.stats_scraper = stats_scraper

    def sync_stats(self):
        mappings = self.session.query(MatchMappingORM).all()
        mapping_fifa_ids = [m.fifa_match_id for m in mappings]

        matches = (
            self.session.query(MatchORM).filter(MatchORM.id.in_(mapping_fifa_ids)).all()
        )
        match_map: dict[int, MatchORM] = {m.id: m for m in matches}

        total_players = 0
        rows_inserted = 0
        rows_updated = 0
        missing_stats: dict[str, int] = {}

        for mapping in mappings:
            match = match_map.get(mapping.fifa_match_id)
            if match is None:
                continue

            raw = self.stats_scraper.fetch_all(mapping.fotmob_match_id)
            if raw is None:
                continue

            for player in raw["players"]:
                is_home = player["is_home"]
                team_id = match.home_team_id if is_home else match.away_team_id

                kwargs: dict = {
                    "match_id": mapping.fifa_match_id,
                    "fotmob_match_id": mapping.fotmob_match_id,
                    "team_id": team_id,
                    "fotmob_player_id": player["fotmob_player_id"],
                    "player_name": player["player_name"],
                    "is_goalkeeper": player["is_goalkeeper"],
                    "is_home": is_home,
                }

                player_stats = player["stats"]
                for col in PLAYER_STAT_COLUMNS:
                    val = player_stats.get(col)
                    kwargs[col] = val
                    if val is None:
                        missing_stats[col] = missing_stats.get(col, 0) + 1

                stat_model = PlayerMatchStat(**kwargs)
                stat_orm = player_match_stat_to_orm(stat_model)

                result = self.stats_repository.upsert(stat_orm)
                if result == "inserted":
                    rows_inserted += 1
                else:
                    rows_updated += 1
                total_players += 1

        self._log_report(
            len(mappings),
            total_players,
            rows_inserted,
            rows_updated,
            missing_stats,
        )

    def _log_report(
        self,
        match_count: int,
        total_players: int,
        rows_inserted: int,
        rows_updated: int,
        missing_stats: dict[str, int],
    ):
        sep = "=" * 60
        logger.info(sep)
        logger.info("  FotMob Player Stats Sync Report")
        logger.info(sep)
        avg = total_players / match_count if match_count else 0
        logger.info(f"  Matches:              {match_count}")
        logger.info(f"  Total player-rows:    {total_players}")
        logger.info(f"  Avg players/match:    {avg:.1f}")
        logger.info(f"  Rows inserted:        {rows_inserted}")
        logger.info(f"  Rows updated:         {rows_updated}")
        total_in_db = self.stats_repository.count()
        logger.info(f"  Total rows in DB:     {total_in_db}")
        logger.info(sep)
        logger.info("")

        if missing_stats:
            total_nulls = sum(missing_stats.values())
            logger.info(f"  [Missing Stats — {total_nulls} nulls across all rows]")
            sorted_missing = sorted(missing_stats.items(), key=lambda x: -x[1])
            for col, count in sorted_missing[:20]:
                logger.info(f"    {col:30s} null in {count} positions")
            if len(sorted_missing) > 20:
                logger.info(f"    ... (+{len(sorted_missing) - 20} more categories)")
            logger.info("")
        logger.info(sep)
