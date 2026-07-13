"""
Backfill player stats for matches that are missing them.

Finds all matches in match_mappings that have no rows in player_match_stats,
then scrapes their player stats from FotMob with delays and retries.

Usage:
    python backfill_missing_stats.py              # Scrape all missing
    python backfill_missing_stats.py --dry-run    # Just show what's missing
"""

import time
import argparse

from database.connection import SessionLocal
from orm.match_mapping import MatchMappingORM
from orm.player_match_stat import PlayerMatchStatORM
from orm.match import MatchORM
from models.player_match_stat import PlayerMatchStat
from scraper.fotmob_player_stats_scraper import FotMobPlayerStatsScraper
from repositories.player_match_stat_repository import PlayerMatchStatRepository
from mappers.player_match_stat_mapper import player_match_stat_to_orm
from core.logging import logger


DELAY_BETWEEN_REQUESTS = 3  # seconds
MAX_RETRIES = 3


def find_missing_matches(session):
    """Find match_mappings that have no player_match_stats rows."""
    mapped_ids = {m.fifa_match_id for m in session.query(MatchMappingORM).all()}
    stat_ids = {
        r[0] for r in session.query(PlayerMatchStatORM.match_id).distinct().all()
    }
    missing = mapped_ids - stat_ids
    return (
        session.query(MatchMappingORM)
        .filter(MatchMappingORM.fifa_match_id.in_(missing))
        .all()
    )


def backfill(dry_run=False):
    session = SessionLocal()
    repo = PlayerMatchStatRepository(session)
    scraper = FotMobPlayerStatsScraper()

    missing = find_missing_matches(session)
    logger.info(f"Found {len(missing)} matches missing player stats")

    if dry_run:
        for m in missing:
            match = session.query(MatchORM).get(m.fifa_match_id)
            label = f"{match.id} ({match.date})" if match else str(m.fifa_match_id)
            logger.info(f"  Missing: FotMob {m.fotmob_match_id} -> FIFA {label}")
        session.close()
        return

    success = 0
    failed = 0

    for i, mapping in enumerate(missing):
        match = session.query(MatchORM).get(mapping.fifa_match_id)
        match_label = f"{match.id}" if match else str(mapping.fifa_match_id)

        logger.info(
            f"[{i + 1}/{len(missing)}] Scraping FotMob {mapping.fotmob_match_id} (match {match_label})..."
        )

        raw = None
        for attempt in range(1, MAX_RETRIES + 1):
            raw = scraper.fetch_all(mapping.fotmob_match_id)
            if raw is not None:
                break
            logger.warning(
                f"  Attempt {attempt}/{MAX_RETRIES} failed, retrying in {DELAY_BETWEEN_REQUESTS * attempt}s..."
            )
            time.sleep(DELAY_BETWEEN_REQUESTS * attempt)

        if raw is None:
            logger.error(f"  FAILED after {MAX_RETRIES} attempts")
            failed += 1
            continue

        players = raw["players"]
        count = 0
        for p in players:
            stat = PlayerMatchStat(
                match_id=mapping.fifa_match_id,
                fotmob_match_id=mapping.fotmob_match_id,
                team_id=raw["home_team_id"] if p["is_home"] else raw["away_team_id"],
                fotmob_player_id=p["fotmob_player_id"],
                player_name=p["player_name"],
                is_goalkeeper=p["is_goalkeeper"],
                is_home=p["is_home"],
                rating=p["stats"].get("rating"),
                minutes_played=p["stats"].get("minutes_played", 0),
                goals=p["stats"].get("goals"),
                assists=p["stats"].get("assists"),
                xG=p["stats"].get("xG"),
                xA=p["stats"].get("xA"),
                xG_non_penalty=p["stats"].get("xG_non_penalty"),
                xG_on_target_faced=p["stats"].get("xG_on_target_faced"),
                xG_on_target_variant=p["stats"].get("xG_on_target_variant"),
                xG_plus_xA=p["stats"].get("xG_plus_xA"),
                total_shots=p["stats"].get("total_shots"),
                shots_on_target=p["stats"].get("shots_on_target"),
                shots_off_target=p["stats"].get("shots_off_target"),
                shot_accuracy=p["stats"].get("shot_accuracy"),
                blocked_shots=p["stats"].get("blocked_shots"),
                shots_woodwork=p["stats"].get("shots_woodwork"),
                touches=p["stats"].get("touches"),
                touches_opposition_box=p["stats"].get("touches_opposition_box"),
                passes_into_final_third=p["stats"].get("passes_into_final_third"),
                accurate_passes=p["stats"].get("accurate_passes"),
                accurate_crosses=p["stats"].get("accurate_crosses"),
                long_balls_accurate=p["stats"].get("long_balls_accurate"),
                corners=p["stats"].get("corners"),
                dispossessed=p["stats"].get("dispossessed"),
                chances_created=p["stats"].get("chances_created"),
                big_chances_created=p["stats"].get("big_chances_created"),
                defensive_actions=p["stats"].get("defensive_actions"),
                tackles=p["stats"].get("tackles"),
                interceptions=p["stats"].get("interceptions"),
                clearances=p["stats"].get("clearances"),
                headed_clearances=p["stats"].get("headed_clearances"),
                recoveries=p["stats"].get("recoveries"),
                duels_won=p["stats"].get("duels_won"),
                duels_lost=p["stats"].get("duels_lost"),
                ground_duels_won=p["stats"].get("ground_duels_won"),
                aerials_won=p["stats"].get("aerials_won"),
                dribbles_succeeded=p["stats"].get("dribbles_succeeded"),
                fouls=p["stats"].get("fouls"),
                was_fouled=p["stats"].get("was_fouled"),
                offsides=p["stats"].get("offsides"),
                dribbled_past=p["stats"].get("dribbled_past"),
                saves=p["stats"].get("saves"),
                saves_inside_box=p["stats"].get("saves_inside_box"),
                goals_conceded=p["stats"].get("goals_conceded"),
                goals_prevented=p["stats"].get("goals_prevented"),
                keeper_diving_saves=p["stats"].get("keeper_diving_saves"),
                keeper_high_claims=p["stats"].get("keeper_high_claims"),
                keeper_sweeper_actions=p["stats"].get("keeper_sweeper_actions"),
                punches=p["stats"].get("punches"),
                errors_led_to_goal=p["stats"].get("errors_led_to_goal"),
                player_throws=p["stats"].get("player_throws"),
            )
            orm_obj = player_match_stat_to_orm(stat)
            repo.upsert(orm_obj)
            count += 1

        success += 1
        logger.info(f"  OK — {count} players saved")

        if i < len(missing) - 1:
            time.sleep(DELAY_BETWEEN_REQUESTS)

    logger.info(f"\nDone: {success} matches scraped, {failed} failed")
    session.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Backfill missing player stats")
    parser.add_argument(
        "--dry-run", action="store_true", help="Show missing matches without scraping"
    )
    args = parser.parse_args()
    backfill(dry_run=args.dry_run)
