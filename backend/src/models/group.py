from pydantic import BaseModel


class Group(BaseModel):
    id: int
    stage_id: int
    name: str
