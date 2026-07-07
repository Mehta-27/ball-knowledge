import httpx
import urllib.parse
from datetime import datetime
from models.match_mapping import FotMobSearchResult

FOTMOB_LEAGUE_ID_WORLD_CUP = 77

# Used to map FIFA team names to FotMob-friendly search terms
# FIFA uses formal names; FotMob may use common names
TEAM_NAME_ALIASES: dict[str, list[str]] = {
    "IR Iran": ["Iran"],
    "Korea Republic": ["South Korea", "Korea"],
    "Côte d'Ivoire": ["Cote d'Ivoire", "Ivory Coast"],
    "Türkiye": ["Turkey"],
    "Curaçao": ["Curacao"],
    "Congo DR": ["DR Congo", "Congo"],
    "Cabo Verde": ["Cape Verde"],
}


def normalize_fifa_name(name: str) -> str:
    return name.replace("�", "").replace("'", "").strip()


def build_search_terms(home: str, away: str) -> list[str]:
    home_aliases = TEAM_NAME_ALIASES.get(home, [home])
    away_aliases = TEAM_NAME_ALIASES.get(away, [away])

    terms: list[str] = []
    for ha in home_aliases:
        for aa in away_aliases:
            terms.append(f"{ha} {aa}")
    return terms


class FotMobScraper:
    def __init__(self):
        self.client = httpx.Client(
            timeout=15,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
                "Accept": "application/json, */*",
                "Accept-Language": "en-US,en;q=0.9",
            },
        )

    def search_by_teams(self, home: str, away: str) -> list[FotMobSearchResult]:
        terms = build_search_terms(home, away)
        seen: set[int] = set()
        results: list[FotMobSearchResult] = []

        for term in terms:
            try:
                url = f"https://apigw.fotmob.com/searchapi/suggest?term={urllib.parse.quote(term)}&lang=en"
                resp = self.client.get(url)
                if resp.status_code != 200:
                    continue
                data = resp.json()
            except Exception:
                continue

            match_list = data.get("matchSuggest") or []
            for entry in match_list:
                for option in entry.get("options") or []:
                    p = option.get("payload") or {}
                    mid = p.get("id")
                    if mid is None or mid in seen:
                        continue
                    seen.add(mid)
                    lid = p.get("leagueId")
                    if lid != FOTMOB_LEAGUE_ID_WORLD_CUP:
                        continue
                    date_str = p.get("matchDate", "")
                    try:
                        match_date = datetime.fromisoformat(
                            date_str.replace("Z", "+00:00")
                        )
                    except (ValueError, TypeError):
                        match_date = datetime.min

                    results.append(
                        FotMobSearchResult(
                            fotmob_match_id=int(mid),
                            home_name=str(p.get("homeName", "")),
                            away_name=str(p.get("awayName", "")),
                            league_id=int(lid) if lid else 0,
                            league_name=str(p.get("leagueName", "")),
                            match_date=match_date,
                            home_score=p.get("homeScore"),
                            away_score=p.get("awayScore"),
                        )
                    )

        return results

    def search_by_date(self, date: str) -> list[FotMobSearchResult]:
        try:
            url = f"https://www.fotmob.com/api/matches?date={date}"
            resp = self.client.get(url)
            if resp.status_code != 200:
                return []
            data = resp.json()
        except Exception:
            return []

        results: list[FotMobSearchResult] = []
        seen: set[int] = set()

        for league in data.get("leagues") or []:
            lid = league.get("primaryId")
            if lid != FOTMOB_LEAGUE_ID_WORLD_CUP:
                continue
            for match in league.get("matches") or []:
                mid = match.get("id")
                if mid is None or mid in seen:
                    continue
                seen.add(mid)
                h = match.get("home") or {}
                a = match.get("away") or {}
                status = match.get("status") or {}
                utc = status.get("utcTime", "")

                try:
                    match_date = datetime.fromisoformat(utc.replace("Z", "+00:00"))
                except (ValueError, TypeError):
                    match_date = datetime.min

                results.append(
                    FotMobSearchResult(
                        fotmob_match_id=int(mid),
                        home_name=str(h.get("name", "")),
                        away_name=str(a.get("name", "")),
                        league_id=lid,
                        league_name=str(league.get("name", "")),
                        match_date=match_date,
                        home_score=h.get("score"),
                        away_score=a.get("score"),
                    )
                )

        return results
