from fastapi import APIRouter, Depends, HTTPException, Query

from repositories.team_repository import TeamRepository
from repositories.player_repository import PlayerRepository
from repositories.match_repository import MatchRepository
from repositories.standing_repository import StandingRepository
from repositories.team_match_stat_repository import TeamMatchStatRepository
from repositories.group_repository import GroupRepository
from database.dependencies import (
    get_team_repository,
    get_player_repository,
    get_match_repository,
    get_standing_repository,
    get_team_match_stat_repository,
    get_group_repository,
)
from mappers.team_response_mapper import (
    team_orm_to_response,
    team_orm_to_detail_response,
    player_orm_to_response,
)
from mappers.match_response_mapper import match_orm_to_card
from mappers.standing_response_mapper import standing_orm_to_response
from schemas.pagination import PaginatedResponse
from schemas.team import TeamResponse, TeamDetailResponse, PlayerResponse

router = APIRouter(
    prefix="/teams",
    tags=["Teams"],
)


@router.get(
    "",
    response_model=PaginatedResponse[TeamResponse] | list[TeamResponse],
    summary="List all teams",
    description="Returns all teams. Supports pagination via limit/offset and search by team name.",
)
async def get_teams(
    repo: TeamRepository = Depends(get_team_repository),
    limit: int = Query(25, ge=1, le=100, description="Number of teams per page"),
    offset: int = Query(0, ge=0, description="Number of teams to skip"),
    search: str | None = Query(None, description="Search teams by name"),
):
    if search or limit != 25 or offset != 0:
        items, total = repo.get_paginated(limit=limit, offset=offset, search=search)
        return PaginatedResponse(
            items=[team_orm_to_response(t) for t in items],
            total=total,
            limit=limit,
            offset=offset,
        )
    teams = repo.get_all()
    return [team_orm_to_response(team) for team in teams]


@router.get(
    "/search",
    response_model=list[TeamResponse],
    summary="Search teams",
    description="Fuzzy search teams by name. Returns up to 10 matches.",
)
async def search_teams(
    q: str = Query(..., min_length=1, description="Search query"),
    repo: TeamRepository = Depends(get_team_repository),
):
    teams = repo.search(q)
    return [team_orm_to_response(t) for t in teams]


@router.get(
    "/{team_id}",
    response_model=TeamDetailResponse,
    summary="Get team by ID",
    description="Returns detailed information about a specific team.",
)
async def get_by_id(
    team_id: int,
    repo: TeamRepository = Depends(get_team_repository),
):
    team = repo.get_by_id(team_id)
    if team is None:
        raise HTTPException(404, "Team not found")
    return team_orm_to_detail_response(team)


@router.get(
    "/{team_id}/players",
    response_model=list[PlayerResponse],
    summary="Get team players",
    description="Returns all players belonging to the specified team.",
)
async def get_players(
    team_id: int,
    repo: PlayerRepository = Depends(get_player_repository),
):
    players = repo.get_by_team_id(team_id)
    if not players:
        raise HTTPException(status_code=404, detail="No players found for this team.")
    return [player_orm_to_response(player) for player in players]


@router.get(
    "/{team_id}/matches",
    summary="Get team matches",
    description="Returns all matches played by the specified team, including home and away fixtures.",
)
async def get_team_matches(
    team_id: int,
    match_repo: MatchRepository = Depends(get_match_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
):
    team = team_repo.get_by_id(team_id)
    if team is None:
        raise HTTPException(404, "Team not found")
    results = match_repo.get_by_team_id_with_teams(team_id)
    return [match_orm_to_card(m, home, away) for m, home, away in results]


@router.get(
    "/{team_id}/standing",
    summary="Get team standing",
    description="Returns the current standing/table position for the specified team.",
)
async def get_team_standing(
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


@router.get(
    "/{team_id}/standings",
    summary="Get team standings (alias)",
    description="Alias for /teams/{team_id}/standing. Returns the current standing for the specified team.",
)
async def get_team_standings_alias(
    team_id: int,
    standing_repo: StandingRepository = Depends(get_standing_repository),
    team_repo: TeamRepository = Depends(get_team_repository),
    group_repo: GroupRepository = Depends(get_group_repository),
):
    return await get_team_standing(team_id, standing_repo, team_repo, group_repo)


@router.get(
    "/{team_id}/stats",
    summary="Get team statistics",
    description="Returns aggregated match statistics for the specified team across all matches.",
)
async def get_team_stats(
    team_id: int,
    team_repo: TeamRepository = Depends(get_team_repository),
    stat_repo: TeamMatchStatRepository = Depends(get_team_match_stat_repository),
):
    team = team_repo.get_by_id(team_id)
    if team is None:
        raise HTTPException(404, "Team not found")
    stats = stat_repo.get_by_team_id(team_id)
    if not stats:
        raise HTTPException(404, "No stats found for this team.")

    n = len(stats)
    result = {
        "team": team.name,
        "matches": n,
        "ball_possession": round(sum(s.ball_possession or 0 for s in stats) / n, 1)
        if n
        else None,
        "expected_goals": round(sum(s.expected_goals or 0 for s in stats), 2),
        "total_shots": round(sum(s.total_shots or 0 for s in stats), 1),
        "shots_on_target": round(sum(s.shots_on_target or 0 for s in stats), 1),
        "passes": round(sum(s.passes or 0 for s in stats), 1),
        "corners": round(sum(s.corners or 0 for s in stats), 1),
        "fouls": round(sum(s.fouls or 0 for s in stats), 1),
        "tackles": round(sum(s.tackles or 0 for s in stats), 1),
        "interceptions": round(sum(s.interceptions or 0 for s in stats), 1),
        "saves": round(sum(s.keeper_saves or 0 for s in stats), 1),
        "yellow_cards": round(sum(s.yellow_cards or 0 for s in stats), 1),
        "red_cards": round(sum(s.red_cards or 0 for s in stats), 1),
    }
    return result
