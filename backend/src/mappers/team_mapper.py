from models.team import Team
from orm.team import TeamORM

def team_to_orm(team: Team) -> TeamORM:
    return TeamORM(
        id=team.id,
        name=team.name,
        code=team.code,
        continent=team.continent,
        confederation=team.confederation,
        current_stage=team.current_stage,
        coach=team.coach,
        rank=team.rank,
        flag_url=team.flag_url
    )