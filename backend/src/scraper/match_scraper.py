from core.http_client import HttpClient
from models.match import Match


class MatchScrapper:
    def __init__(self):
        self.http = HttpClient()

    MATCHES_URL = "https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023"

    def scrape_matches(self) -> list[Match]:

        response = self.http.get(self.MATCHES_URL)
        data = response.json()
        matches = data.get("Results")
        matches_list: list[Match] = []
        if not matches:
            raise ValueError("FIFA API returned no matches.")

        for match in matches:
            home = match.get("Home")
            away = match.get("Away")

            if home is None or away is None:
                continue

            if not match["IdMatch"]:
                raise ValueError("Missing match ID")
            if not match["Date"]:
                raise ValueError("Missing match date")
            if not match["IdSeason"]:
                raise ValueError("Missing season ID")
            if not match["IdStage"]:
                raise ValueError("Missing stage ID")
            if not match["StageName"]:
                raise ValueError("Missing stage name")
            if not match["IdCompetition"]:
                raise ValueError("Missing competition ID")

            stadium = match.get("Stadium") or {}

            match_model = Match(
                id=int(match["IdMatch"]),
                home_team_id=int(home["IdTeam"]),
                away_team_id=int(away["IdTeam"]),
                date=match["Date"],
                season_id=int(match["IdSeason"]),
                stage_id=int(match["IdStage"])
                if match["IdStage"] is not None
                else None,
                stage=match["StageName"][0]["Description"],
                group_id=int(match["IdGroup"])
                if match["IdGroup"] is not None
                else None,
                group=match["GroupName"][0]["Description"]
                if match["GroupName"]
                else None,
                attendance=int(match["Attendance"])
                if match["Attendance"] is not None
                else None,
                home_score=home.get("Score"),
                away_score=away.get("Score"),
                local_date=match["LocalDate"],
                venue_id=int(stadium["IdStadium"])
                if stadium.get("IdStadium")
                else None,
                home_tactics=home["Tactics"]
                if home.get("Tactics") is not None
                else None,
                away_tactics=away["Tactics"]
                if away.get("Tactics") is not None
                else None,
                competition_id=int(match["IdCompetition"]),
            )
            matches_list.append(match_model)
        return matches_list
