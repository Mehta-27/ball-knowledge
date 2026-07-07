from core.http_client import HttpClient
from models.venue import Venue


class VenueScraper:
    MATCHES_URL = "https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023"

    def __init__(self):
        self.http = HttpClient()

    def scrape_venues(self) -> list[Venue]:
        response = self.http.get(self.MATCHES_URL)
        data = response.json()
        matches = data.get("Results")

        if not matches:
            raise ValueError("FIFA API returned no matches.")

        seen: set[int] = set()
        venues: list[Venue] = []

        for match in matches:
            stadium = match.get("Stadium")
            if stadium is None:
                continue

            stadium_id = stadium.get("IdStadium")
            if stadium_id is None:
                continue

            sid = int(stadium_id)
            if sid in seen:
                continue
            seen.add(sid)

            name_list = stadium.get("Name") or []
            city_list = stadium.get("CityName") or []

            venue = Venue(
                id=sid,
                name=name_list[0]["Description"] if name_list else "",
                city=city_list[0]["Description"] if city_list else "",
                country=stadium.get("IdCountry") or "",
                capacity=stadium.get("Capacity"),
                latitude=stadium.get("Latitude"),
                longitude=stadium.get("Longitude"),
                roof=stadium.get("Roof"),
                turf=stadium.get("Turf"),
                picture_url=None,
            )

            if not venue.name:
                raise ValueError(f"Venue {sid} has no name.")

            venues.append(venue)

        if not venues:
            raise ValueError("FIFA API returned no venues.")

        return venues
