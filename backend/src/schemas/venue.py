from pydantic import BaseModel


class VenueCardResponse(BaseModel):
    id: int
    stadium: str
    city: str
    capacity: int | None = None


class VenueDetailResponse(BaseModel):
    id: int
    stadium: str
    city: str
    country: str
    capacity: int | None = None
    turf: str | None = None
    roof: bool | None = None
    picture_url: str | None = None
    matches_played: int = 0
