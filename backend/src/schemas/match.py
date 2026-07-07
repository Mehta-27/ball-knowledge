from pydantic import BaseModel
from datetime import datetime


class MatchCardResponse(BaseModel):
    id: int
    home: str
    away: str
    score: str | None
    date: datetime
    stage: str | None


class TeamStatResponse(BaseModel):
    team_id: int
    team_name: str
    ball_possession: float | None = None
    expected_goals: float | None = None
    total_shots: float | None = None
    shots_on_target: float | None = None
    passes: float | None = None
    corners: float | None = None
    fouls: float | None = None
    tackles: float | None = None
    interceptions: float | None = None
    saves: float | None = None
    yellow_cards: float | None = None
    red_cards: float | None = None


class PlayerStatInMatch(BaseModel):
    player_name: str
    is_goalkeeper: bool
    rating: float | None = None
    minutes_played: float | None = None
    goals: float | None = None
    assists: float | None = None
    xG: float | None = None
    xA: float | None = None
    total_shots: float | None = None
    shots_on_target: float | None = None
    touches: float | None = None
    passes: float | None = None
    tackles: float | None = None
    interceptions: float | None = None
    duels_won: float | None = None
    saves: float | None = None


class MatchDetailResponse(BaseModel):
    id: int
    home_team: str
    away_team: str
    home_score: int | None
    away_score: int | None
    venue: str | None
    stage: str | None
    attendance: int | None
    date: datetime
    home_team_stats: TeamStatResponse | None = None
    away_team_stats: TeamStatResponse | None = None
    player_stats: list[PlayerStatInMatch] = []
