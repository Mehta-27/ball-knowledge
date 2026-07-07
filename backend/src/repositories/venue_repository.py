from sqlalchemy.orm import Session

from orm.venue import VenueORM


class VenueRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert_all(self, venues: list[VenueORM]):
        try:
            for venue in venues:
                existing_venue = self.session.get(VenueORM, venue.id)

                if existing_venue is None:
                    self.session.add(venue)
                else:
                    existing_venue.name = venue.name
                    existing_venue.city = venue.city
                    existing_venue.country = venue.country
                    existing_venue.capacity = venue.capacity
                    existing_venue.latitude = venue.latitude
                    existing_venue.longitude = venue.longitude
                    existing_venue.roof = venue.roof
                    existing_venue.turf = venue.turf
                    existing_venue.picture_url = venue.picture_url
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def get_all(self) -> list[VenueORM]:
        return self.session.query(VenueORM).all()

    def get_by_id(self, venue_id: int) -> VenueORM | None:
        return self.session.get(VenueORM, venue_id)

    def get_paginated(
        self, limit: int = 25, offset: int = 0, search: str | None = None
    ) -> tuple[list[VenueORM], int]:
        query = self.session.query(VenueORM)
        if search:
            query = query.filter(VenueORM.name.ilike(f"%{search}%"))
        total = query.count()
        items = query.order_by(VenueORM.name).offset(offset).limit(limit).all()
        return items, total

    def search(self, query: str, limit: int = 10) -> list[VenueORM]:
        return (
            self.session.query(VenueORM)
            .filter(VenueORM.name.ilike(f"%{query}%"))
            .limit(limit)
            .all()
        )
