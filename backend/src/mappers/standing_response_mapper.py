from orm.standing import StandingORM
from orm.team import TeamORM
from orm.group import GroupORM
from schemas.standing import StandingResponse, StandingGroupResponse


def standing_orm_to_response(
    standing: StandingORM, team: TeamORM, group: GroupORM
) -> StandingResponse:
    return StandingResponse(
        group=group.name,
        position=standing.position,
        team=team.name,
        played=standing.played,
        wins=standing.won,
        draws=standing.drawn,
        losses=standing.lost,
        goals_for=standing.goals_for,
        goals_against=standing.goals_against,
        goal_difference=standing.goal_difference,
        points=standing.points,
    )


def standings_grouped(
    standings: list[StandingORM],
    teams: dict[int, TeamORM],
    groups: dict[int, GroupORM],
) -> list[StandingGroupResponse]:
    grouped: dict[str, list[StandingResponse]] = {}
    for s in standings:
        team = teams.get(s.team_id)
        group = groups.get(s.group_id)
        if not team or not group:
            continue
        resp = standing_orm_to_response(s, team, group)
        grouped.setdefault(group.name, []).append(resp)

    result = []
    for group_name, rows in grouped.items():
        rows.sort(key=lambda r: r.position)
        result.append(StandingGroupResponse(group=group_name, standings=rows))
    result.sort(key=lambda g: g.group)
    return result
