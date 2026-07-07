from scraper.fifa_scraper import FIFAScraper
from mappers.team_mapper import team_to_orm
from repositories.team_repository import TeamRepository

class FIFASyncService:
    def __init__(
            self,
            repository : TeamRepository,
              ):
        self.repository = repository
        self.scraper = FIFAScraper()

    def sync_fifa_teams(self):
        teams = self.scraper.scrape_teams()
        teams_orm = []

        for team in teams:
            teams_orm.append(team_to_orm(team))

        self.repository.upsert_all(teams_orm)