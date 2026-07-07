from pydantic import BaseModel


class Standing(BaseModel):
    id: int
    team_id: int
    group_id: int
    played: int
    won: int
    drawn: int
    lost: int
    goals_for: int
    goals_against: int
    goal_difference: int
    points: int
    position: int
