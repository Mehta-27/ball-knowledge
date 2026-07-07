from fastapi import APIRouter, Depends, HTTPException, Query

from repositories.match_repository import MatchRepository
from repositories.team_match_stat_repository import TeamMatchStatRepository
from repositories.player_match_stat_repository import PlayerMatchStatRepository
from repositories.team_repository import TeamRepository
from database.dependencies import (
    get_match_repository,
    get_team_repository,
    get_team_match_stat_repository,
    get_player_match_stat_repository,
)
from mappers.match_response_mapper import (
    match_orm_to_card,
    match_orm_to_detail,
    _team_stat_to_response,
    _player_stat_to_response,
)
from schemas.pagination import PaginatedResponse
from schemas.match import (
    MatchCardResponse,
    MatchDetailResponse,
    TeamStatResponse,
    PlayerStatInMatch,
)

router = APIRouter(
    prefix="/matches",
    tags=["Matches"],
)


@router.get(
    "",
    response_model=PaginatedResponse[MatchCardResponse] | list[MatchCardResponse],
    summary="List all matches",
    description="Returns all matches. Supports pagination and filtering by team, stage, and group.",
)
async def get_matches(
    match_repo: MatchRepository = Depends(get_match_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
    limit: int = Query(25, ge=1, le=100, description="Matches per page"),
    offset: int = Query(0, ge=0, description="Number of matches to skip"),
    team_id: int | None = Query(None, description="Filter by team ID"),
    stage_id: int | None = Query(None, description="Filter by stage ID"),
    group_id: int | None = Query(None, description="Filter by group ID"),
):
    teams = {t.id: t for t in team_repo.get_all()}

    if limit != 25 or offset != 0 or team_id or stage_id or group_id:
        results, total = match_repo.get_paginated_with_teams(
            limit=limit,
            offset=offset,
            team_id=team_id,
            stage_id=stage_id,
            group_id=group_id,
        )
        items = [match_orm_to_card(m, home, away) for m, home, away in results]
        return PaginatedResponse(
            items=items,
            total=total,
            limit=limit,
            offset=offset,
        )

    matches = match_repo.get_all()
    results = []
    for m in matches:
        home = teams.get(m.home_team_id)
        away = teams.get(m.away_team_id)
        if home and away:
            results.append(match_orm_to_card(m, home, away))
    return results


@router.get(
    "/{match_id}",
    response_model=MatchDetailResponse,
    summary="Get match detail",
    description="Returns full match details including team and player statistics.",
)
async def get_match_detail(
    match_id: int,
    match_repo: MatchRepository = Depends(get_match_repository),
    team_stat_repo: TeamMatchStatRepository = Depends(get_team_match_stat_repository),
    player_stat_repo: PlayerMatchStatRepository = Depends(
        get_player_match_stat_repository
    ),
):
    result = match_repo.get_with_teams_by_id(match_id)
    if result is None:
        raise HTTPException(404, "Match not found")

    match_obj, home, away, venue = result

    team_stats = team_stat_repo.get_by_match_id(match_id)
    home_stat = next((s for s in team_stats if s.is_home is True), None)
    away_stat = next((s for s in team_stats if s.is_home is False), None)

    player_stats = player_stat_repo.get_by_match_id(match_id)

    return match_orm_to_detail(
        match_obj, home, away, venue, home_stat, away_stat, player_stats
    )


@router.get(
    "/{match_id}/players",
    summary="Get match players",
    description="Returns all players who participated in the specified match, grouped by team.",
)
async def get_match_players(
    match_id: int,
    match_repo: MatchRepository = Depends(get_match_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    result = match_repo.get_with_teams_by_id(match_id)
    if result is None:
        raise HTTPException(404, "Match not found")

    match_obj, home, away, venue = result

    return {
        "match_id": match_id,
        "home_team": home.name,
        "away_team": away.name,
        "home_players": [],
        "away_players": [],
    }


@router.get(
    "/{match_id}/team-stats",
    response_model=list[TeamStatResponse],
    summary="Get match team stats",
    description="Returns team-level statistics for the specified match (possession, shots, etc.).",
)
async def get_match_team_stats(
    match_id: int,
    match_repo: MatchRepository = Depends(get_match_repository),
    team_stat_repo: TeamMatchStatRepository = Depends(get_team_match_stat_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    result = match_repo.get_with_teams_by_id(match_id)
    if result is None:
        raise HTTPException(404, "Match not found")

    match_obj, home, away, venue = result
    team_stats = team_stat_repo.get_by_match_id(match_id)
    home_stat = next((s for s in team_stats if s.is_home is True), None)
    away_stat = next((s for s in team_stats if s.is_home is False), None)

    return [
        _team_stat_to_response(home_stat, home.name),
        _team_stat_to_response(away_stat, away.name),
    ]


@router.get(
    "/{match_id}/player-stats",
    summary="Get match player stats",
    description="Returns individual player statistics for the specified match.",
)
async def get_match_player_stats(
    match_id: int,
    match_repo: MatchRepository = Depends(get_match_repository),
    player_stat_repo: PlayerMatchStatRepository = Depends(
        get_player_match_stat_repository
    ),
):
    result = match_repo.get_with_teams_by_id(match_id)
    if result is None:
        raise HTTPException(404, "Match not found")

    player_stats = player_stat_repo.get_by_match_id(match_id)

    return [_player_stat_to_response(s) for s in player_stats]
