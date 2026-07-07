"""
Scheduled ETL refresh script.

Run the full ETL pipeline or a subset. Idempotent — safe to run daily on a cron.

Usage:
    python refresh.py                    # Full refresh
    python refresh.py --fifa-only        # Skip FotMob stages (faster)
    python refresh.py --fotmob-only     # Only FotMob mapping + stats
"""

import time
import argparse

from database.connection import SessionLocal

from repositories.team_repository import TeamRepository
from repositories.player_repository import PlayerRepository
from repositories.match_repository import MatchRepository
from repositories.venue_repository import VenueRepository
from repositories.stage_repository import StageRepository
from repositories.group_repository import GroupRepository
from repositories.standing_repository import StandingRepository
from repositories.match_mapping_repository import MatchMappingRepository
from repositories.player_mapping_repository import PlayerMappingRepository
from repositories.team_match_stat_repository import TeamMatchStatRepository
from repositories.player_match_stat_repository import PlayerMatchStatRepository

from scraper.fifa_scraper import FIFAScraper
from scraper.player_scrapper import PlayerScraper
from scraper.match_scraper import MatchScrapper
from scraper.venue_scraper import VenueScraper
from scraper.stage_scraper import StageScraper
from scraper.group_scraper import GroupScraper
from scraper.fotmob_scraper import FotMobScraper
from scraper.fotmob_stats_scraper import FotMobStatsScraper
from scraper.fotmob_player_stats_scraper import FotMobPlayerStatsScraper

from services.fifa_sync_service import FIFASyncService
from services.player_sync_service import PlayerSyncService
from services.match_sync_service import MatchSyncService
from services.venue_sync_service import VenueSyncService
from services.stage_sync_service import StageSyncService
from services.group_sync_service import GroupSyncService
from services.standing_sync_service import StandingSyncService
from services.fotmob_mapping_sync_service import FotMobMappingSyncService
from services.player_mapping_sync_service import PlayerMappingSyncService
from services.fotmob_stats_sync_service import FotMobStatsSyncService
from services.fotmob_player_stats_sync_service import FotMobPlayerStatsSyncService
from ml.features.player_feature_builder import PlayerFeatureBuilder
from ml.preprocessing.player_scaler import PlayerScaler
from ml.training.player_similarity_trainer import PlayerSimilarityTrainer

from core.logging import logger


_STAGES = [
    "fifa_teams",
    "fifa_players",
    "fifa_venues",
    "fifa_stages",
    "fifa_groups",
    "fifa_matches",
    "fifa_standings",
    "fotmob_mappings",
    "fifa_player_mappings",
    "fotmob_team_stats",
    "fotmob_player_stats",
    "player_similarity",
]


def refresh_all(
    *,
    fifa_only: bool = False,
    fotmob_only: bool = False,
    ml_only: bool = False,
) -> dict[str, float]:
    session = SessionLocal()

    team_repo = TeamRepository(session)
    player_repo = PlayerRepository(session)
    match_repo = MatchRepository(session)
    venue_repo = VenueRepository(session)
    stage_repo = StageRepository(session)
    group_repo = GroupRepository(session)
    standing_repo = StandingRepository(session)
    mapping_repo = MatchMappingRepository(session)
    player_mapping_repo = PlayerMappingRepository(session)
    team_stat_repo = TeamMatchStatRepository(session)
    player_stat_repo = PlayerMatchStatRepository(session)

    fifa_scraper = FIFAScraper()
    player_scraper = PlayerScraper()
    match_scraper = MatchScrapper()
    venue_scraper = VenueScraper()
    stage_scraper = StageScraper()
    group_scraper = GroupScraper()
    fotmob_scraper = FotMobScraper()
    fotmob_stat_scraper = FotMobStatsScraper()
    fotmob_player_stat_scraper = FotMobPlayerStatsScraper()

    team_svc = FIFASyncService(team_repo)
    player_svc = PlayerSyncService(team_repo, player_repo, player_scraper)
    venue_svc = VenueSyncService(venue_repo, venue_scraper)
    stage_svc = StageSyncService(stage_repo, stage_scraper)
    group_svc = GroupSyncService(group_repo, group_scraper)
    standing_svc = StandingSyncService(match_repo, standing_repo)
    match_svc = MatchSyncService(match_repo, match_scraper)
    mapping_svc = FotMobMappingSyncService(session, mapping_repo, fotmob_scraper)
    player_mapping_svc = PlayerMappingSyncService(session, player_mapping_repo)
    team_stat_svc = FotMobStatsSyncService(session, team_stat_repo, fotmob_stat_scraper)
    player_stat_svc = FotMobPlayerStatsSyncService(
        session, player_stat_repo, fotmob_player_stat_scraper
    )
    feature_builder = PlayerFeatureBuilder(
        player_repository=player_repo,
        player_mapping_repository=player_mapping_repo,
        player_match_stat_repository=player_stat_repo,
    )

    player_scaler = PlayerScaler()

    player_similarity_trainer = PlayerSimilarityTrainer(
        feature_builder=feature_builder,
        player_scaler=player_scaler,
    )
    if ml_only:
        logger.info("Running ML pipeline only...")
        player_similarity_trainer.train()
        session.close()
        return {}

    timing: dict[str, float] = {}
    enabled = _resolve_stages(fifa_only, fotmob_only)

    if "fifa_teams" in enabled:
        t0 = time.time()
        team_svc.sync_fifa_teams()
        timing["fifa_teams"] = time.time() - t0

    if "fifa_players" in enabled:
        t0 = time.time()
        player_svc.sync_players()
        timing["fifa_players"] = time.time() - t0

    if "fifa_venues" in enabled:
        t0 = time.time()
        venue_svc.sync_venues()
        timing["fifa_venues"] = time.time() - t0

    if "fifa_stages" in enabled:
        t0 = time.time()
        stage_svc.sync_stages()
        timing["fifa_stages"] = time.time() - t0

    if "fifa_groups" in enabled:
        t0 = time.time()
        group_svc.sync_groups()
        timing["fifa_groups"] = time.time() - t0

    if "fifa_matches" in enabled:
        t0 = time.time()
        match_svc.sync_matches()
        timing["fifa_matches"] = time.time() - t0

    if "fifa_standings" in enabled:
        t0 = time.time()
        standing_svc.sync_standings()
        timing["fifa_standings"] = time.time() - t0

    if "fotmob_mappings" in enabled:
        t0 = time.time()
        mapping_svc.sync_mappings()
        timing["fotmob_mappings"] = time.time() - t0

    if "fifa_player_mappings" in enabled:
        t0 = time.time()
        player_mapping_svc.sync_mappings()
        timing["fifa_player_mappings"] = time.time() - t0

    if "fotmob_team_stats" in enabled:
        t0 = time.time()
        team_stat_svc.sync_stats()
        timing["fotmob_team_stats"] = time.time() - t0

    if "fotmob_player_stats" in enabled:
        t0 = time.time()
        player_stat_svc.sync_stats()
        timing["fotmob_player_stats"] = time.time() - t0

    if "player_similarity" in enabled:
        t0 = time.time()
        player_similarity_trainer.train()
        timing["player_similarity"] = time.time() - t0

    total = sum(timing.values())
    logger.info("=" * 60)
    logger.info("  Refresh Complete — Timing")
    logger.info("=" * 60)
    for stage, elapsed in timing.items():
        logger.info(f"  {stage:25s}  {elapsed:.1f}s")
    logger.info("=" * 60)
    logger.info(f"  {'Total':25s}  {total:.1f}s")
    logger.info("=" * 60)

    session.close()
    return timing


def _resolve_stages(fifa_only: bool, fotmob_only: bool) -> list[str]:
    if fifa_only:
        return [s for s in _STAGES if s.startswith("fifa_")]
    if fotmob_only:
        return [s for s in _STAGES if s.startswith("fotmob_")]
    return list(_STAGES)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ball Knowledge ETL Refresh")
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--fifa-only", action="store_true", help="Only refresh FIFA data"
    )
    group.add_argument(
        "--fotmob-only", action="store_true", help="Only refresh FotMob data"
    )

    group.add_argument(
        "--ml-only",
        action="store_true",
        help="Only run the ML training pipeline",
    )
    
    args = parser.parse_args()
    refresh_all(
        fifa_only=args.fifa_only,
        fotmob_only=args.fotmob_only,
        ml_only=args.ml_only,
    )
