from sqlalchemy.orm import Session

from orm.match_mapping import MatchMappingORM
from orm.match import MatchORM
from orm.team_match_stat import TeamMatchStatORM

from models.team_match_stat import TeamMatchStat

from scraper.fotmob_stats_scraper import FotMobStatsScraper

from repositories.team_match_stat_repository import TeamMatchStatRepository

from mappers.team_match_stat_mapper import team_match_stat_to_orm
from core.logging import logger

FOTMOB_STAT_COLUMNS = [
    "ball_possession",
    "expected_goals",
    "total_shots",
    "shots_on_target",
    "touches_opposition_box",
    "big_chances",
    "big_chances_missed",
    "accurate_passes",
    "yellow_cards",
    "corners",
    "shots_off_target",
    "blocked_shots",
    "shots_woodwork",
    "shots_inside_box",
    "shots_outside_box",
    "expected_goals_open_play",
    "expected_goals_set_play",
    "expected_goals_non_penalty",
    "expected_goals_on_target",
    "passes",
    "own_half_passes",
    "opposition_half_passes",
    "long_balls_accurate",
    "accurate_crosses",
    "player_throws",
    "offsides",
    "tackles",
    "interceptions",
    "shot_blocks",
    "clearances",
    "keeper_saves",
    "duels_won",
    "ground_duels_won",
    "aerials_won",
    "dribbles_succeeded",
    "red_cards",
    "fouls",
]


def _null_count(row: TeamMatchStat) -> int:
    count = 0
    for col in FOTMOB_STAT_COLUMNS:
        if getattr(row, col) is None:
            count += 1
    return count


class FotMobStatsSyncService:
    def __init__(
        self,
        session: Session,
        stats_repository: TeamMatchStatRepository,
        stats_scraper: FotMobStatsScraper,
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

        processed = 0
        skipped = 0
        rows_inserted = 0
        rows_updated = 0
        missing_categories: dict[str, int] = {}

        for mapping in mappings:
            match = match_map.get(mapping.fifa_match_id)
            if match is None:
                skipped += 1
                continue

            raw_stats = self.stats_scraper.fetch_stats(mapping.fotmob_match_id)
            if raw_stats is None:
                skipped += 1
                continue

            processed += 1

            stat_kwargs_home: dict = {
                "match_id": mapping.fifa_match_id,
                "fotmob_match_id": mapping.fotmob_match_id,
                "team_id": match.home_team_id,
                "is_home": True,
            }
            stat_kwargs_away: dict = {
                "match_id": mapping.fifa_match_id,
                "fotmob_match_id": mapping.fotmob_match_id,
                "team_id": match.away_team_id,
                "is_home": False,
            }

            for col in FOTMOB_STAT_COLUMNS:
                vals = raw_stats.get(col, [None, None])
                stat_kwargs_home[col] = vals[0] if vals else None
                stat_kwargs_away[col] = vals[1] if vals else None

                if vals and vals[0] is None and vals[1] is None:
                    missing_categories[col] = missing_categories.get(col, 0) + 1

            home_stat = TeamMatchStat(**stat_kwargs_home)
            away_stat = TeamMatchStat(**stat_kwargs_away)

            home_orm = team_match_stat_to_orm(home_stat)
            away_orm = team_match_stat_to_orm(away_stat)

            home_result = self.stats_repository.upsert(home_orm)
            away_result = self.stats_repository.upsert(away_orm)

            if home_result == "inserted":
                rows_inserted += 1
            else:
                rows_updated += 1
            if away_result == "inserted":
                rows_inserted += 1
            else:
                rows_updated += 1

        self._log_report(
            processed, skipped, rows_inserted, rows_updated, missing_categories
        )

    def _log_report(
        self,
        processed: int,
        skipped: int,
        rows_inserted: int,
        rows_updated: int,
        missing_categories: dict[str, int],
    ):
        sep = "=" * 60
        logger.info(sep)
        logger.info("  FotMob Stats Sync Report")
        logger.info(sep)
        logger.info(f"  Matches processed:  {processed}")
        logger.info(f"  Matches skipped:    {skipped}")
        logger.info(f"  Rows inserted:      {rows_inserted}")
        logger.info(f"  Rows updated:       {rows_updated}")
        total_in_db = self.stats_repository.count()
        logger.info(f"  Total rows in DB:   {total_in_db}")
        logger.info(sep)
        logger.info("")

        if missing_categories:
            logger.info("  [Missing Stat Categories (both teams null)]")
            sorted_missing = sorted(missing_categories.items(), key=lambda x: -x[1])
            for col, count in sorted_missing:
                logger.info(f"    {col}: {count} matches")
            logger.info("")
        logger.info(sep)
