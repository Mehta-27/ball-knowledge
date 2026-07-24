from models import stage
from pydantic import BaseModel


class TeamResponse(BaseModel):
    id: int
    name: str
    code: str


class TeamDetailResponse(BaseModel):
    id: int
    name: str
    code: str
    continent: str
    confederation: str
    flag_url: str
    current_stage: str | None = None


class PlayerResponse(BaseModel):
    id: int
    name: str
    picture_url: str
    jersey_number: int
    position: str
    age: int
