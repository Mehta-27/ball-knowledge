import re
import httpx
import json
from models.player_match_stat import PLAYER_STAT_KEY_MAP


class FotMobPlayerStatsScraper:
    def __init__(self):
        self.client = httpx.Client(
            timeout=15,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "text/html, */*",
                "Accept-Language": "en-US,en;q=0.9",
            },
        )

    def fetch_all(self, fotmob_match_id: int) -> dict | None:
        try:
            url = f"https://www.fotmob.com/match/{fotmob_match_id}"
            resp = self.client.get(url)
            if resp.status_code != 200:
                return None

            match = re.search(
                r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
                resp.text,
                re.DOTALL,
            )
            if not match:
                return None

            data = json.loads(match.group(1))
        except Exception:
            return None

        try:
            page_props = data["props"]["pageProps"]
            general = page_props["general"]
            player_stats = page_props["content"].get("playerStats")
            if not player_stats:
                return None
        except (KeyError, TypeError):
            return None

        home_team_id = general["homeTeam"]["id"]
        away_team_id = general["awayTeam"]["id"]

        rows = []
        for pid_str, ps in player_stats.items():
            fotmob_player_id = int(pid_str)
            fotmob_team_id = ps["teamId"]
            is_home = fotmob_team_id == home_team_id

            stats = {}
            for section in ps.get("stats", []):
                for section_title, stat_entry in section.get("stats", {}).items():
                    if not isinstance(stat_entry, dict):
                        continue
                    raw_key = stat_entry.get("key")
                    if not raw_key:
                        continue
                    col = PLAYER_STAT_KEY_MAP.get(raw_key)
                    if col is None:
                        continue
                    stats[col] = self._extract_value(stat_entry)

            rows.append(
                {
                    "fotmob_player_id": fotmob_player_id,
                    "player_name": ps["name"],
                    "is_goalkeeper": ps.get("isGoalkeeper", False),
                    "fotmob_team_id": fotmob_team_id,
                    "is_home": is_home,
                    "stats": stats,
                }
            )

        return {
            "home_team_id": home_team_id,
            "away_team_id": away_team_id,
            "players": rows,
        }

    @staticmethod
    def _extract_value(stat_entry: dict) -> float | None:
        stat_data = stat_entry.get("stat")
        if not isinstance(stat_data, dict):
            return None
        value = stat_data.get("value")
        if value is None:
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None
