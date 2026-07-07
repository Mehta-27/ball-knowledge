from repositories.match_repository import MatchRepository
from repositories.standing_repository import StandingRepository
from mappers.standing_mapper import standing_to_orm
from core.logging import logger
from models.standing import Standing
from orm.standing import compute_standing_id


class StandingSyncService:
    def __init__(
        self,
        match_repository: MatchRepository,
        standing_repository: StandingRepository,
    ):
        self.match_repository = match_repository
        self.standing_repository = standing_repository

    def sync_standings(self):
        matches = self.match_repository.get_all()

        stats: dict[tuple[int, int], dict] = {}

        for match in matches:
            if match.group_id is None:
                continue
            if match.home_score is None or match.away_score is None:
                continue

            home_key = (match.home_team_id, match.group_id)
            away_key = (match.away_team_id, match.group_id)

            if home_key not in stats:
                stats[home_key] = {
                    "team_id": match.home_team_id,
                    "group_id": match.group_id,
                    "played": 0,
                    "won": 0,
                    "drawn": 0,
                    "lost": 0,
                    "goals_for": 0,
                    "goals_against": 0,
                }
            if away_key not in stats:
                stats[away_key] = {
                    "team_id": match.away_team_id,
                    "group_id": match.group_id,
                    "played": 0,
                    "won": 0,
                    "drawn": 0,
                    "lost": 0,
                    "goals_for": 0,
                    "goals_against": 0,
                }

            home = stats[home_key]
            away = stats[away_key]

            home["played"] += 1
            away["played"] += 1
            home["goals_for"] += match.home_score
            home["goals_against"] += match.away_score
            away["goals_for"] += match.away_score
            away["goals_against"] += match.home_score

            if match.home_score > match.away_score:
                home["won"] += 1
                away["lost"] += 1
            elif match.home_score < match.away_score:
                home["lost"] += 1
                away["won"] += 1
            else:
                home["drawn"] += 1
                away["drawn"] += 1

        group_teams: dict[int, list[dict]] = {}
        for key, row in stats.items():
            group_id = key[1]
            if group_id not in group_teams:
                group_teams[group_id] = []
            row["goal_difference"] = row["goals_for"] - row["goals_against"]
            row["points"] = row["won"] * 3 + row["drawn"]
            group_teams[group_id].append(row)

        standings: list[Standing] = []
        for group_id, teams in group_teams.items():
            teams.sort(
                key=lambda t: (t["points"], t["goal_difference"], t["goals_for"]),
                reverse=True,
            )
            for position, team in enumerate(teams, start=1):
                standing = Standing(
                    id=compute_standing_id(team["team_id"], group_id),
                    team_id=team["team_id"],
                    group_id=group_id,
                    played=team["played"],
                    won=team["won"],
                    drawn=team["drawn"],
                    lost=team["lost"],
                    goals_for=team["goals_for"],
                    goals_against=team["goals_against"],
                    goal_difference=team["goal_difference"],
                    points=team["points"],
                    position=position,
                )
                standings.append(standing)

        standings_orm = [standing_to_orm(s) for s in standings]
        self.standing_repository.upsert_all(standings_orm)
        logger.info("[OK] FIFA standings synced successfully!")
