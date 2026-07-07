from fastapi import APIRouter, Depends, HTTPException

from repositories.standing_repository import StandingRepository
from repositories.team_repository import TeamRepository
from repositories.group_repository import GroupRepository
from database.dependencies import (
    get_standing_repository,
    get_team_repository,
    get_group_repository,
)
from mappers.standing_response_mapper import (
    standing_orm_to_response,
    standings_grouped,
)
from schemas.standing import StandingResponse, StandingGroupResponse

router = APIRouter(
    prefix="/standings",
    tags=["Standings"],
)


@router.get(
    "",
    response_model=list[StandingGroupResponse],
    summary="List all standings",
    description="Returns all standings grouped by competition group, sorted by position within each group.",
)
async def get_standings(
    standing_repo: StandingRepository = Depends(get_standing_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
    group_repo: GroupRepository = Depends(get_group_repository),
):
    standings = standing_repo.get_all()
    teams = {t.id: t for t in team_repo.get_all()}
    groups = {g.id: g for g in group_repo.get_all()}
    return standings_grouped(standings, teams, groups)


@router.get(
    "/{group_name}",
    response_model=list[StandingResponse],
    summary="Get standings by group name",
    description="Returns the standings for a specific group identified by its name (e.g. 'Group A').",
)
async def get_standing_by_group(
    group_name: str,
    standing_repo: StandingRepository = Depends(get_standing_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
    group_repo: GroupRepository = Depends(get_group_repository),
):
    group = group_repo.get_by_name(group_name)
    if group is None:
        raise HTTPException(404, "Group not found")

    standings = standing_repo.get_by_group_id(group.id)
    if not standings:
        raise HTTPException(404, "No standings found for this group.")

    teams = {t.id: t for t in team_repo.get_all()}
    return [standing_orm_to_response(s, teams[s.team_id], group) for s in standings]


@router.get(
    "/team/{team_id}",
    response_model=StandingResponse,
    summary="Get standing by team ID",
    description="Returns the current standing for a specific team identified by its ID.",
)
async def get_standing_by_team(
    team_id: int,
    standing_repo: StandingRepository = Depends(get_standing_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
    group_repo: GroupRepository = Depends(get_group_repository),
):
    team = team_repo.get_by_id(team_id)
    if team is None:
        raise HTTPException(404, "Team not found")

    standing = standing_repo.get_by_team_id(team_id)
    if standing is None:
        raise HTTPException(404, "Standing not found for this team.")

    group = group_repo.get_by_id(standing.group_id)
    if group is None:
        raise HTTPException(404, "Group not found for this standing.")

    return standing_orm_to_response(standing, team, group)
