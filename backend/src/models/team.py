from typing import Optional
from pydantic import BaseModel
class Team(BaseModel):
    id:int
    name:str
    code:str
    continent:str
    coach: str | None = None
    rank: int | None = None
    current_stage:str
    confederation:str
    flag_url:str

