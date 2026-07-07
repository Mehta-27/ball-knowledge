from pydantic import BaseModel
from datetime import datetime


class Stage(BaseModel):
    id: int
    season_id: int
    name: str
    type: str
    order: int
    start_date: datetime | None = None
    end_date: datetime | None = None
