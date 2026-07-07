from pydantic import BaseModel
from datetime import datetime


class Match(BaseModel):
    id: int
    competition_id: int
    season_id: int
    stage_id: int | None
    stage: str | None
    group_id: int | None
    group: str | None
    attendance: int | None
    date: datetime
    local_date: datetime
    home_team_id: int
    away_team_id: int
    home_score: int | None
    away_score: int | None
    venue_id: int | None = None
    home_tactics: str | None
    away_tactics: str | None
