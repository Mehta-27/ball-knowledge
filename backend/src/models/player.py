from pydantic import BaseModel,HttpUrl
from datetime import datetime

class Player(BaseModel):
    id: int
    team_id: int
    name: str
    short_name:str
    jersey_number: int
    position_code: int
    position: str
    birth_date: datetime
    height: float | None
    weight: float | None
    country: str
    picture_url: HttpUrl | None