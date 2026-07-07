from datetime import date
from schemas.team import TeamResponse, TeamDetailResponse, PlayerResponse
from orm.team import TeamORM
from orm.player import PlayerORM


def _compute_age(birth_date) -> int:
    today = date.today()
    return (
        today.year
        - birth_date.year
        - ((today.month, today.day) < (birth_date.month, birth_date.day))
    )


def team_orm_to_response(team: TeamORM) -> TeamResponse:
    return TeamResponse(id=team.id, name=team.name, code=team.code)


def team_orm_to_detail_response(team: TeamORM) -> TeamDetailResponse:
    return TeamDetailResponse(
        id=team.id,
        name=team.name,
        code=team.code,
        continent=team.continent,
        confederation=team.confederation,
        flag_url=team.flag_url,
        current_stage=team.current_stage,
    )


def player_orm_to_response(player: PlayerORM) -> PlayerResponse:
    return PlayerResponse(
        id=player.id,
        name=player.name,
        picture_url=player.picture_url,
        jersey_number=player.jersey_number,
        position=player.position,
        age=_compute_age(player.birth_date),
    )
