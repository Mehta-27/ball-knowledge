from pydantic import BaseModel
from datetime import datetime


class FotMobSearchResult(BaseModel):
    fotmob_match_id: int
    home_name: str
    away_name: str
    league_id: int
    league_name: str
    match_date: datetime
    home_score: int | None
    away_score: int | None


class MatchMapping(BaseModel):
    fifa_match_id: int
    fotmob_match_id: int
    fotmob_page_url: str | None
    home_team_name: str
    away_team_name: str
    match_date: datetime
    confidence: str
