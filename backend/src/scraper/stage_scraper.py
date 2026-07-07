from core.http_client import HttpClient
from models.stage import Stage

STAGE_ORDER: dict[int, int] = {
    289273: 1,
    289287: 2,
    289288: 3,
    289289: 4,
    289290: 5,
    289291: 6,
    289292: 7,
}


class StageScraper:
    MATCHES_URL = "https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023"

    def __init__(self):
        self.http = HttpClient()

    def scrape_stages(self) -> list[Stage]:
        response = self.http.get(self.MATCHES_URL)
        data = response.json()
        matches = data.get("Results")

        if not matches:
            raise ValueError("FIFA API returned no matches.")

        stage_map: dict[int, list[str]] = {}

        for match in matches:
            stage_id = match.get("IdStage")
            stage_name_list = match.get("StageName")

            if stage_id is None or stage_name_list is None:
                continue

            sid = int(stage_id)
            name = stage_name_list[0]["Description"]

            if sid not in stage_map:
                stage_map[sid] = [name, match.get("Date") or ""]
            else:
                existing = stage_map[sid][1]
                date = match.get("Date") or ""
                if date and (not existing or date < existing):
                    stage_map[sid][1] = date

        if not stage_map:
            raise ValueError("No stages found in match data.")

        stages: list[Stage] = []
        for sid, (name, _) in stage_map.items():
            order = STAGE_ORDER.get(sid, 0)
            stage_type = "group" if name == "First Stage" else "knockout"

            stage = Stage(
                id=sid,
                season_id=285023,
                name=name,
                type=stage_type,
                order=order,
                start_date=None,
                end_date=None,
            )
            stages.append(stage)

        stages.sort(key=lambda s: s.order)
        return stages
