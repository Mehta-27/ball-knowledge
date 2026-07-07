from core.http_client import HttpClient
from models.player import Player


class PlayerScraper:
    
    BASE_URL = "https://cxm-api.fifa.com/fifaplusweb/api"

    SQUAD_URL = (
    "https://api.fifa.com/api/v3/teams/"
    "{team_id}/squad"
    "?idCompetition=17"
    "&idSeason=285023"
    "&language=en"
    )


    def __init__(self):
        self.http = HttpClient()
    
    def scrape_players(self,team_id:int):
        url = self.SQUAD_URL.format(team_id=team_id)

        response = self.http.get(url)
        data = response.json()
        players = data["Players"]
        players_list = []

        if not players:
                raise ValueError("FIFA API returned no players.")

        for player in players:
            

            if int(player["IdTeam"]) != team_id:
                raise ValueError("Wrong team player")

            if not player["PlayerName"]:
                raise ValueError("Missing player name")

            if not player["ShortName"]:
                raise ValueError("Missing short name")

            if player["JerseyNum"] is None:
                raise ValueError("Missing jersey number")

            if player["Position"] is None:
                raise ValueError("Missing position")

            if not player["BirthDate"]:
                raise ValueError("Missing birth date")

            if not player["IdCountry"]:
                raise ValueError("Missing country")
            
            player_model = Player(
                id=int(player["IdPlayer"]),
                team_id=int(player["IdTeam"]),
                name=player["PlayerName"][0]["Description"],
                short_name=player["ShortName"][0]["Description"],
                jersey_number=player["JerseyNum"],
                position_code=player["Position"],
                position=player["PositionLocalized"][0]["Description"],
                birth_date=player["BirthDate"],
                height=player["Height"],
                weight=player["Weight"],
                country=player["IdCountry"],
                picture_url=(
                    player["PlayerPicture"]["PictureUrl"]
                    if player["PlayerPicture"] is not None
                    else None
                ),
            )
            players_list.append(player_model)
        return players_list

