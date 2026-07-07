from core.http_client import HttpClient
from models.group import Group

FIRST_STAGE_ID = 289273


class GroupScraper:
    MATCHES_URL = "https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023"

    def __init__(self):
        self.http = HttpClient()

    def scrape_groups(self) -> list[Group]:
        response = self.http.get(self.MATCHES_URL)
        data = response.json()
        matches = data.get("Results")

        if not matches:
            raise ValueError("FIFA API returned no matches.")

        seen: set[int] = set()
        groups: list[Group] = []

        for match in matches:
            stage_id = match.get("IdStage")
            if stage_id is None or int(stage_id) != FIRST_STAGE_ID:
                continue

            group_id = match.get("IdGroup")
            group_name_list = match.get("GroupName")

            if group_id is None or group_name_list is None:
                continue

            gid = int(group_id)
            if gid in seen:
                continue
            seen.add(gid)

            name = group_name_list[0]["Description"]

            group = Group(
                id=gid,
                stage_id=FIRST_STAGE_ID,
                name=name,
            )
            groups.append(group)

        if not groups:
            raise ValueError("FIFA API returned no groups.")

        groups.sort(key=lambda g: g.name)
        return groups
