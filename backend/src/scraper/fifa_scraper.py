from core.http_client import HttpClient
from models.team import Team

LOCALE = "en"
LIMIT = 200
class FIFAScraper:
    BASE_URL = "https://cxm-api.fifa.com/fifaplusweb/api"

    PAGE_URL = (
        BASE_URL + "/pages/en/tournaments/mens/worldcup/canadamexicousa2026/teams"
    )

    def __init__(self):
        self.http = HttpClient()

    def scrape_teams(self) -> list[Team]:

        response = self.http.get(self.PAGE_URL)
        data = response.json()

        sections = data["sections"]

        endpoint = None

        for section in sections:
            if section["entryType"] == "teamsModule":
                endpoint = section["entryEndpoint"]
                break
        if endpoint is None:
            raise ValueError("Could not find the teamsModule endpoint in the FIFA page response.")
        url = f"{self.BASE_URL}{endpoint}&limit=200"

        
        response = self.http.get(url)
        data = response.json()

        teams = data["teams"]

        # data checks
        if not teams:
            raise ValueError("FIFA API returned no teams.")

        if len(teams) != 48:
            raise ValueError(f"Expected 48 teams, received {len(teams)}.")
        
        teams_list: list[Team] = []   
            
        for team in teams_list:
            if not team.name:
                raise ValueError("Team name is missing.")

            if not team.flag_url:
                raise ValueError(f"{team.name} has no flag URL.")

        for team_data in teams:
            team = Team(
                id=int(team_data["teamId"]),
                name=team_data["teamName"],
                code=team_data["teamFlag"].split("/")[-1],
                continent=CONFEDERATION_TO_CONTINENT.get(team_data["confederationId"]),
                confederation=team_data["confederationId"],
                current_stage= team_data["stage"],
                coach=None,
                rank=None,
                flag_url=team_data["teamFlag"],
            )

            teams_list.append(team)

        #duplicate check and length check    
        team_ids = {team.id for team in teams_list}

        if len(team_ids) != len(teams_list):
            raise ValueError("Duplicate team IDs detected.")
        return teams_list

CONFEDERATION_TO_CONTINENT = {
    "UEFA": "Europe",
    "CONMEBOL": "South America",
    "CONCACAF": "North America",
    "CAF": "Africa",
    "AFC": "Asia",
    "OFC": "Oceania"
}