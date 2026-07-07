from fastapi import APIRouter, Depends, HTTPException

from repositories.stage_repository import StageRepository
from repositories.match_repository import MatchRepository
from repositories.team_repository import TeamRepository
from database.dependencies import (
    get_stage_repository,
    get_match_repository,
    get_team_repository,
)
from mappers.stage_response_mapper import stage_orm_to_response, stage_orm_to_detail
from mappers.match_response_mapper import match_orm_to_card
from schemas.stage import StageResponse, StageDetailResponse

router = APIRouter(
    prefix="/stages",
    tags=["Stages"],
)


@router.get(
    "",
    response_model=list[StageResponse],
    summary="List all stages",
    description="Returns all competition stages sorted by their order.",
)
async def get_stages(
    repo: StageRepository = Depends(get_stage_repository),
):
    stages = repo.get_all()
    return [stage_orm_to_response(s) for s in stages]


@router.get(
    "/{stage_id}",
    response_model=StageDetailResponse,
    summary="Get stage detail",
    description="Returns full stage details including dates and season ID.",
)
async def get_stage_detail(
    stage_id: int,
    repo: StageRepository = Depends(get_stage_repository),
):
    stage = repo.get_by_id(stage_id)
    if stage is None:
        raise HTTPException(404, "Stage not found")
    return stage_orm_to_detail(stage)


@router.get(
    "/{stage_id}/matches",
    summary="Get matches for a stage",
    description="Returns all matches belonging to a specific tournament stage (e.g. Group Stage, Round of 16).",
)
async def get_stage_matches(
    stage_id: int,
    stage_repo: StageRepository = Depends(get_stage_repository),
    match_repo: MatchRepository = Depends(get_match_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    stage = stage_repo.get_by_id(stage_id)
    if stage is None:
        raise HTTPException(404, "Stage not found")
    results = match_repo.get_by_stage_id_with_teams(stage_id)
    return [match_orm_to_card(m, home, away) for m, home, away in results]
