from orm.venue import VenueORM
from schemas.venue import VenueCardResponse, VenueDetailResponse


def venue_orm_to_card(venue: VenueORM) -> VenueCardResponse:
    return VenueCardResponse(
        id=venue.id,
        stadium=venue.name,
        city=venue.city,
        capacity=venue.capacity,
    )


def venue_orm_to_detail(venue: VenueORM, matches_played: int) -> VenueDetailResponse:
    return VenueDetailResponse(
        id=venue.id,
        stadium=venue.name,
        city=venue.city,
        country=venue.country,
        capacity=venue.capacity,
        turf=venue.turf,
        roof=venue.roof,
        picture_url=venue.picture_url,
        matches_played=matches_played,
    )
