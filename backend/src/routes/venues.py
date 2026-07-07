from fastapi import APIRouter, Depends, HTTPException, Query

from repositories.venue_repository import VenueRepository
from repositories.match_repository import MatchRepository
from repositories.team_repository import TeamRepository
from database.dependencies import (
    get_venue_repository,
    get_match_repository,
    get_team_repository,
)
from mappers.venue_response_mapper import venue_orm_to_card, venue_orm_to_detail
from mappers.match_response_mapper import match_orm_to_card
from schemas.pagination import PaginatedResponse
from schemas.venue import VenueCardResponse, VenueDetailResponse

router = APIRouter(
    prefix="/venues",
    tags=["Venues"],
)


@router.get(
    "",
    response_model=PaginatedResponse[VenueCardResponse] | list[VenueCardResponse],
    summary="List all venues",
    description="Returns all venues. Supports pagination and search by stadium name.",
)
async def get_venues(
    repo: VenueRepository = Depends(get_venue_repository),
    limit: int = Query(25, ge=1, le=100, description="Venues per page"),
    offset: int = Query(0, ge=0, description="Number of venues to skip"),
    search: str | None = Query(None, description="Search venues by name"),
):
    if search or limit != 25 or offset != 0:
        items, total = repo.get_paginated(limit=limit, offset=offset, search=search)
        return PaginatedResponse(
            items=[venue_orm_to_card(v) for v in items],
            total=total,
            limit=limit,
            offset=offset,
        )
    venues = repo.get_all()
    return [venue_orm_to_card(v) for v in venues]


@router.get(
    "/search",
    response_model=list[VenueCardResponse],
    summary="Search venues",
    description="Fuzzy search venues by stadium name. Returns up to 10 matches.",
)
async def search_venues(
    q: str = Query(..., min_length=1, description="Search query"),
    repo: VenueRepository = Depends(get_venue_repository),
):
    venues = repo.search(q)
    return [venue_orm_to_card(v) for v in venues]


@router.get(
    "/{venue_id}",
    response_model=VenueDetailResponse,
    summary="Get venue by ID",
    description="Returns detailed venue information including match count.",
)
async def get_venue_detail(
    venue_id: int,
    venue_repo: VenueRepository = Depends(get_venue_repository),
    match_repo: MatchRepository = Depends(get_match_repository),
):
    venue = venue_repo.get_by_id(venue_id)
    if venue is None:
        raise HTTPException(404, "Venue not found")
    matches_played = match_repo.count_by_venue_id(venue_id)
    return venue_orm_to_detail(venue, matches_played)


@router.get(
    "/{venue_id}/matches",
    summary="Get venue matches",
    description="Returns all matches played at the specified venue.",
)
async def get_venue_matches(
    venue_id: int,
    venue_repo: VenueRepository = Depends(get_venue_repository),
    match_repo: MatchRepository = Depends(get_match_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    venue = venue_repo.get_by_id(venue_id)
    if venue is None:
        raise HTTPException(404, "Venue not found")
    results = match_repo.get_by_venue_id_with_teams(venue_id)
    return [match_orm_to_card(m, home, away) for m, home, away in results]
