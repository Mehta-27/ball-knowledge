from repositories.match_repository import MatchRepository
from scraper.match_scraper import MatchScrapper
from mappers.match_mapper import match_to_orm
from core.logging import logger


class MatchSyncService:
    def __init__(
        self,
        match_repository: MatchRepository,
        match_scraper: MatchScrapper,
    ):
        self.match_repository = match_repository
        self.match_scraper = match_scraper

    def sync_matches(self):

        matches = self.match_scraper.scrape_matches()
        matches_orm = [match_to_orm(match) for match in matches]

        self.match_repository.upsert_all(matches_orm)

        logger.info("[OK] FIFA matches synced successfully!")
