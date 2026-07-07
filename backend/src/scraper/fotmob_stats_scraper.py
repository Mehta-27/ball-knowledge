import re
import httpx
import json
from models.team_match_stat import STAT_KEY_MAP, STRING_COLUMNS


class FotMobStatsScraper:
    def __init__(self):
        self.client = httpx.Client(
            timeout=15,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "text/html, */*",
                "Accept-Language": "en-US,en;q=0.9",
            },
        )

    def fetch_stats(
        self, fotmob_match_id: int
    ) -> dict[str, list[float | str | None]] | None:
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
            content = data["props"]["pageProps"]["content"]
            stats = content["stats"]["Periods"]["All"]["stats"]
        except (KeyError, TypeError):
            return None

        result: dict[str, list[float | str | None]] = {}
        for section in stats:
            for item in section.get("stats", []):
                ik = item.get("key", "")
                stype = item.get("type", "")
                if not ik or stype == "title":
                    continue
                col = STAT_KEY_MAP.get(ik)
                if col is None:
                    continue
                vals = item.get("stats", [None, None])
                result[col] = [
                    self._to_native(vals[0], col),
                    self._to_native(vals[1], col),
                ]

        if not result:
            return None
        return result

    @staticmethod
    def _to_native(v, col: str) -> float | str | None:
        if v is None:
            return None
        if col in STRING_COLUMNS:
            return str(v)
        if isinstance(v, (int, float)):
            return float(v)
        if isinstance(v, str):
            try:
                return float(v)
            except ValueError:
                return None
        return None
