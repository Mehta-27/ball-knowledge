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


def main():
    session = SessionLocal()

    team_repository = TeamRepository(session)
    player_repository = PlayerRepository(session)
    match_repository = MatchRepository(session)
    venue_repository = VenueRepository(session)
    stage_repository = StageRepository(session)
    group_repository = GroupRepository(session)
    standing_repository = StandingRepository(session)
    match_mapping_repository = MatchMappingRepository(session)
    player_mapping_repository = PlayerMappingRepository(session)
    team_match_stat_repository = TeamMatchStatRepository(session)
    player_match_stat_repository = PlayerMatchStatRepository(session)
    team_scraper = FIFAScraper()
    player_scraper = PlayerScraper()
    match_scraper = MatchScrapper()
    venue_scraper = VenueScraper()
    stage_scraper = StageScraper()
    group_scraper = GroupScraper()
    fotmob_scraper = FotMobScraper()
    fotmob_stats_scraper = FotMobStatsScraper()
    fotmob_player_stats_scraper = FotMobPlayerStatsScraper()

    team_service = FIFASyncService(team_repository)
    player_service = PlayerSyncService(
        team_repository,
        player_repository,
        player_scraper,
    )
    venue_service = VenueSyncService(
        venue_repository,
        venue_scraper,
    )
    stage_service = StageSyncService(
        stage_repository,
        stage_scraper,
    )
    group_service = GroupSyncService(
        group_repository,
        group_scraper,
    )
    standing_service = StandingSyncService(
        match_repository,
        standing_repository,
    )
    match_service = MatchSyncService(
        match_repository,
        match_scraper,
    )
    mapping_service = FotMobMappingSyncService(
        session,
        match_mapping_repository,
        fotmob_scraper,
    )
    player_mapping_service = PlayerMappingSyncService(
        session,
        player_mapping_repository,
    )
    stats_service = FotMobStatsSyncService(
        session,
        team_match_stat_repository,
        fotmob_stats_scraper,
    )
    player_stats_service = FotMobPlayerStatsSyncService(
        session,
        player_match_stat_repository,
        fotmob_player_stats_scraper,
    )

    team_service.sync_fifa_teams()
    player_service.sync_players()
    venue_service.sync_venues()
    stage_service.sync_stages()
    group_service.sync_groups()
    match_service.sync_matches()
    standing_service.sync_standings()
    mapping_service.sync_mappings()
    stats_service.sync_stats()
    player_stats_service.sync_stats()
    player_mapping_service.sync_mappings()


if __name__ == "__main__":
    main()
