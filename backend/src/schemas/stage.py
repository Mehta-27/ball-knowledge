from pydantic import BaseModel


class StageResponse(BaseModel):
    id: int
    name: str
    type: str
    order: int


class StageDetailResponse(BaseModel):
    id: int
    name: str
    type: str
    order: int
    season_id: int
    start_date: str | None = None
    end_date: str | None = None
