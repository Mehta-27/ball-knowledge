from pydantic import BaseModel


class Venue(BaseModel):
    id: int
    name: str
    city: str
    country: str
    capacity: int | None = None
    latitude: float | None = None
    longitude: float | None = None
    roof: bool | None = None
    turf: str | None = None
    picture_url: str | None = None
