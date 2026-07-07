from repositories.venue_repository import VenueRepository
from scraper.venue_scraper import VenueScraper
from mappers.venue_mapper import venue_to_orm
from core.logging import logger


class VenueSyncService:
    def __init__(
        self,
        venue_repository: VenueRepository,
        venue_scraper: VenueScraper,
    ):
        self.venue_repository = venue_repository
        self.venue_scraper = venue_scraper

    def sync_venues(self):
        venues = self.venue_scraper.scrape_venues()
        venues_orm = [venue_to_orm(venue) for venue in venues]

        self.venue_repository.upsert_all(venues_orm)

        logger.info("[OK] FIFA venues synced successfully!")
