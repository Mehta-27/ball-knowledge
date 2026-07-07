from repositories.team_repository import TeamRepository
from repositories.player_repository import PlayerRepository
from scraper.player_scrapper import PlayerScraper
from mappers.player_mapper import player_to_orm
from core.logging import logger


class PlayerSyncService:
    def __init__(
        self,
        team_repository: TeamRepository,
        player_repository: PlayerRepository,
        scraper: PlayerScraper,
    ):
        self.team_repository = team_repository
        self.player_repository = player_repository
        self.scraper = scraper

    def sync_players(self):
        teams = self.team_repository.get_all()

        for team in teams:
            players = self.scraper.scrape_players(team.id)

            players_orm = [player_to_orm(player) for player in players]

            self.player_repository.upsert_all(players_orm)

        logger.info("[OK] FIFA players synced successfully!")
