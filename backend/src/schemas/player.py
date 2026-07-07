from pydantic import BaseModel


class PlayerCardResponse(BaseModel):
    id: int
    name: str
    picture_url: str | None
    jersey_number: int
    position: str
    age: int


class PlayerStatSummary(BaseModel):
    matches: int = 0
    starts: int = 0
    minutes: float = 0
    goals: float | None = 0
    assists: float | None = 0
    xG: float | None = 0
    xA: float | None = 0
    shots: float | None = 0
    shots_on_target: float | None = 0
    passes: float | None = 0
    touches: float | None = 0
    tackles: float | None = 0
    interceptions: float | None = 0
    duels_won: float | None = 0
    saves: float | None = 0
    clean_sheets: int = 0
    rating: float | None = None


class PlayerDetailResponse(BaseModel):
    id: int
    name: str
    picture_url: str | None
    jersey_number: int
    country: str
    team: str
    position: str
    age: int
    statistics: PlayerStatSummary
