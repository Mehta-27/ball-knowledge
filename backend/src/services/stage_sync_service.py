from repositories.stage_repository import StageRepository
from scraper.stage_scraper import StageScraper
from mappers.stage_mapper import stage_to_orm
from core.logging import logger


class StageSyncService:
    def __init__(
        self,
        stage_repository: StageRepository,
        stage_scraper: StageScraper,
    ):
        self.stage_repository = stage_repository
        self.stage_scraper = stage_scraper

    def sync_stages(self):
        stages = self.stage_scraper.scrape_stages()
        stages_orm = [stage_to_orm(stage) for stage in stages]
        self.stage_repository.upsert_all(stages_orm)
        logger.info("[OK] FIFA stages synced successfully!")
