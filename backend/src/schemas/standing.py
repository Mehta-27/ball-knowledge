from pydantic import BaseModel


class StandingResponse(BaseModel):
    group: str
    position: int
    team: str
    played: int
    wins: int
    draws: int
    losses: int
    goals_for: int
    goals_against: int
    goal_difference: int
    points: int


class StandingGroupResponse(BaseModel):
    group: str
    standings: list[StandingResponse]
