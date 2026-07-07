from fastapi import APIRouter, Depends, HTTPException

from repositories.group_repository import GroupRepository
from repositories.stage_repository import StageRepository
from repositories.match_repository import MatchRepository
from repositories.standing_repository import StandingRepository
from repositories.team_repository import TeamRepository
from database.dependencies import (
    get_group_repository,
    get_stage_repository,
    get_match_repository,
    get_standing_repository,
    get_team_repository,
)
from mappers.group_response_mapper import group_orm_to_response, group_orm_to_detail
from mappers.match_response_mapper import match_orm_to_card
from mappers.standing_response_mapper import standing_orm_to_response
from schemas.group import GroupResponse, GroupDetailResponse

router = APIRouter(
    prefix="/groups",
    tags=["Groups"],
)


@router.get(
    "",
    response_model=list[GroupResponse],
    summary="List all groups",
    description="Returns all competition groups sorted by name.",
)
async def get_groups(
    repo: GroupRepository = Depends(get_group_repository),
):
    groups = repo.get_all()
    return [group_orm_to_response(g) for g in groups]


@router.get(
    "/{group_id}",
    response_model=GroupDetailResponse,
    summary="Get group detail",
    description="Returns group details including the associated stage name.",
)
async def get_group_detail(
    group_id: int,
    group_repo: GroupRepository = Depends(get_group_repository),
    stage_repo: StageRepository = Depends(get_stage_repository),
):
    group = group_repo.get_by_id(group_id)
    if group is None:
        raise HTTPException(404, "Group not found")
    stage = stage_repo.get_by_id(group.stage_id)
    return group_orm_to_detail(group, stage)


@router.get(
    "/{group_id}/standings",
    summary="Get standings for a group",
    description="Returns the standings table for a specific group, ordered by position.",
)
async def get_group_standings(
    group_id: int,
    group_repo: GroupRepository = Depends(get_group_repository),
    standing_repo: StandingRepository = Depends(get_standing_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    group = group_repo.get_by_id(group_id)
    if group is None:
        raise HTTPException(404, "Group not found")
    standings = standing_repo.get_by_group_id(group_id)
    if not standings:
        raise HTTPException(404, "No standings found for this group.")
    teams = {t.id: t for t in team_repo.get_all()}
    return [standing_orm_to_response(s, teams[s.team_id], group) for s in standings]


@router.get(
    "/{group_id}/matches",
    summary="Get matches for a group",
    description="Returns all matches belonging to a specific group.",
)
async def get_group_matches(
    group_id: int,
    group_repo: GroupRepository = Depends(get_group_repository),
    match_repo: MatchRepository = Depends(get_match_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    group = group_repo.get_by_id(group_id)
    if group is None:
        raise HTTPException(404, "Group not found")
    results = match_repo.get_by_group_id_with_teams(group_id)
    return [match_orm_to_card(m, home, away) for m, home, away in results]
