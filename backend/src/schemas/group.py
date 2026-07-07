from pydantic import BaseModel


class GroupResponse(BaseModel):
    id: int
    name: str
    stage_id: int


class GroupDetailResponse(BaseModel):
    id: int
    name: str
    stage_id: int
    stage_name: str
