from pydantic import BaseModel


class PlayerMapping(BaseModel):
    fifa_player_id: int
    fotmob_player_id: int
    match_type: str
    confidence: float
