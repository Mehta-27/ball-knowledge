from models.standing import Standing
from orm.standing import StandingORM


def standing_to_orm(standing: Standing) -> StandingORM:
    return StandingORM(
        id=standing.id,
        team_id=standing.team_id,
        group_id=standing.group_id,
        played=standing.played,
        won=standing.won,
        drawn=standing.drawn,
        lost=standing.lost,
        goals_for=standing.goals_for,
        goals_against=standing.goals_against,
        goal_difference=standing.goal_difference,
        points=standing.points,
        position=standing.position,
    )
