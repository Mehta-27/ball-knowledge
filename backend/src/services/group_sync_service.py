from repositories.group_repository import GroupRepository
from scraper.group_scraper import GroupScraper
from mappers.group_mapper import group_to_orm
from core.logging import logger


class GroupSyncService:
    def __init__(
        self,
        group_repository: GroupRepository,
        group_scraper: GroupScraper,
    ):
        self.group_repository = group_repository
        self.group_scraper = group_scraper

    def sync_groups(self):
        groups = self.group_scraper.scrape_groups()
        groups_orm = [group_to_orm(group) for group in groups]
        self.group_repository.upsert_all(groups_orm)
        logger.info("[OK] FIFA groups synced successfully!")
