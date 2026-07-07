from models.venue import Venue
from orm.venue import VenueORM


def venue_to_orm(venue: Venue) -> VenueORM:
    return VenueORM(
        id=venue.id,
        name=venue.name,
        city=venue.city,
        country=venue.country,
        capacity=venue.capacity,
        latitude=venue.latitude,
        longitude=venue.longitude,
        roof=venue.roof,
        turf=venue.turf,
        picture_url=venue.picture_url,
    )
