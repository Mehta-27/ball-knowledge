from fastapi import APIRouter, Depends, HTTPException, Query

from repositories.player_repository import PlayerRepository
from repositories.team_repository import TeamRepository
from repositories.player_match_stat_repository import PlayerMatchStatRepository
from repositories.match_repository import MatchRepository
from database.dependencies import (
    get_player_repository,
    get_team_repository,
    get_player_match_stat_repository,
    get_match_repository,
)
from mappers.player_response_mapper import player_orm_to_card, player_orm_to_detail
from mappers.match_response_mapper import match_orm_to_card
from schemas.pagination import PaginatedResponse
from schemas.player import PlayerCardResponse, PlayerDetailResponse
from functools import lru_cache
from ml.inference.player_similarity_engine import PlayerSimilarityEngine

router = APIRouter(
    prefix="/players",
    tags=["Players"],
)


@lru_cache
def get_similarity_engine() -> PlayerSimilarityEngine:
    return PlayerSimilarityEngine()


def _match_player_stats(
    player_name: str,
    short_name: str,
    team_stats: list,
) -> list:
    name_parts = set(player_name.lower().split())
    short_parts = set(short_name.lower().split())
    matched = []
    for s in team_stats:
        stat_name_parts = set(s.player_name.lower().split())
        if name_parts & stat_name_parts or short_parts & stat_name_parts:
            matched.append(s)
    return matched


@router.get(
    "",
    response_model=PaginatedResponse[PlayerCardResponse] | list[PlayerCardResponse],
    summary="List all players",
    description="Returns all players. Supports pagination via limit/offset, search by name, filter by team_id and position.",
)
async def get_players(
    repo: PlayerRepository = Depends(get_player_repository),
    limit: int = Query(25, ge=1, le=100, description="Number of players per page"),
    offset: int = Query(0, ge=0, description="Number of players to skip"),
    search: str | None = Query(None, description="Search players by name"),
    team_id: int | None = Query(None, description="Filter by team ID"),
    position: str | None = Query(None, description="Filter by position"),
):
    if search or limit != 25 or offset != 0 or team_id or position:
        items, total = repo.get_paginated(
            limit=limit,
            offset=offset,
            search=search,
            team_id=team_id,
            position=position,
        )
        return PaginatedResponse(
            items=[player_orm_to_card(p) for p in items],
            total=total,
            limit=limit,
            offset=offset,
        )
    players = repo.get_all()
    return [player_orm_to_card(p) for p in players]


@router.get(
    "/search",
    response_model=list[PlayerCardResponse],
    summary="Search players",
    description="Fuzzy search players by name. Returns up to 10 matches.",
)
async def search_players(
    q: str = Query(..., min_length=1, description="Search query"),
    repo: PlayerRepository = Depends(get_player_repository),
):
    players = repo.search(q)
    return [player_orm_to_card(p) for p in players]


@router.get(
    "/{player_id}",
    response_model=PlayerDetailResponse,
    summary="Get player by ID",
    description="Returns detailed player information including aggregated match statistics.",
)
async def get_player_detail(
    player_id: int,
    player_repo: PlayerRepository = Depends(get_player_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
    stat_repo: PlayerMatchStatRepository = Depends(get_player_match_stat_repository),
):
    player = player_repo.get_by_id(player_id)
    if player is None:
        raise HTTPException(404, "Player not found")

    team = team_repo.get_by_id(player.team_id)
    if team is None:
        raise HTTPException(404, "Player has no team")

    team_stats = stat_repo.get_by_team_id(player.team_id)
    player_stats = _match_player_stats(player.name, player.short_name, team_stats)

    return player_orm_to_detail(player, team, player_stats)


@router.get(
    "/{player_id}/similar",
    summary="Get similar players",
    description="Returns top 10 similar players",
)
async def get_similar_player(player_id: int):
    try:
        engine = get_similarity_engine()
        return engine.get_similar_player(player_id)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception:
        raise HTTPException(503, "Similarity model unavailable. Please retrain.")


@router.get(
    "/{player_id}/stats",
    response_model=PlayerDetailResponse,
    summary="Get player statistics",
    description="Returns aggregated match statistics for a specific player.",
)
async def get_player_stats(
    player_id: int,
    player_repo: PlayerRepository = Depends(get_player_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
    stat_repo: PlayerMatchStatRepository = Depends(get_player_match_stat_repository),
):
    return await get_player_detail(player_id, player_repo, team_repo, stat_repo)


@router.get(
    "/{player_id}/matches",
    summary="Get player matches",
    description="Returns match history for a specific player, including per-match statistics.",
)
async def get_player_matches(
    player_id: int,
    player_repo: PlayerRepository = Depends(get_player_repository),
    player_mapping_repo=None,
    match_repo: MatchRepository = Depends(get_match_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    player = player_repo.get_by_id(player_id)
    if player is None:
        raise HTTPException(404, "Player not found")

    results = match_repo.get_by_team_id_with_teams(player.team_id)
    cards = [match_orm_to_card(m, home, away) for m, home, away in results]

    return {
        "player_id": player.id,
        "player_name": player.name,
        "matches": cards,
    }


@router.get(
    "/{player_id}/career",
    summary="Get player career",
    description="Returns a career summary for the player including basic info and team.",
)
async def get_player_career(
    player_id: int,
    player_repo: PlayerRepository = Depends(get_player_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    player = player_repo.get_by_id(player_id)
    if player is None:
        raise HTTPException(404, "Player not found")

    team = team_repo.get_by_id(player.team_id)

    return {
        "player_id": player.id,
        "name": player.name,
        "country": player.country,
        "position": player.position,
        "jersey_number": player.jersey_number,
        "team": team.name if team else None,
        "height": player.height,
        "weight": player.weight,
    }
