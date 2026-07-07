# FotMob API Reverse Engineering Analysis

**Date**: 2026-07-02  
**Context**: FBref blocked by Cloudflare WAF. Evaluating FotMob as alternative data source for player/team match statistics for the Football Intelligence System (FIFA World Cup data).

---

## 1. All Endpoints & Current Status

### Base Domain: `www.fotmob.com/api/`
All REST (no GraphQL). No API keys required for most endpoints. Some require the `X-Fm-Req` (also `x-mas`) header — an MD5-signed token using Rick Astley "Never Gonna Give You Up" lyrics as the HMAC secret.

| # | Endpoint | Params | Auth | Status | Data |
|---|----------|--------|------|--------|------|
| 1 | `GET /api/matches` | `date=YYYYMMDD` | None | ✅ Verified | Match list grouped by league |
| 2 | `GET /api/leagues` | `id={leagueId}`, `season=` | None | ✅ Verified | Standings, top scorers, fixtures |
| 3 | `GET /api/allLeagues` | none | None | ✅ Verified | League directory |
| 4 | `GET /api/teams` | `id={teamId}` | None | ✅ Verified | Squad, fixtures, form |
| 5 | `GET /api/playerData` | `id={playerId}` | None | ✅ Verified | Bio, recent matches, career |
| 6 | `GET /api/searchData` | `term=` | None | ✅ Verified | Full search (players/teams/leagues) |
| 7 | `GET /api/search/suggest` | `term=` | None | ✅ Verified | Autocomplete |
| 8 | `GET /api/worldnews` | `page=`, `lang=` | None | ✅ Verified | News feed |
| 9 | `GET /api/transfers` | `page=` | None | ✅ Verified | Transfer market |
| 10 | `GET /api/trendingnews` | none | None | ✅ Verified | Trending carousel |
| 11 | `GET /api/data/match-score` | `matchId={id}` | None | ✅ Verified | Lightweight score (polling-friendly) |
| 12 | `GET /api/data/tvlistings` | `countryCode=XX` | None | ✅ Verified | Broadcast listings |
| 13 | `GET /api/data/audio-matches` | `date=YYYYMMDD` | None | ✅ Verified | Audio feed matches |
| 14 | `GET /api/data/dataproviders` | none | None | ✅ Verified | Provider directory |
| 15 | **`GET /api/matchDetails`** | `matchId={id}` | **X-Fm-Req** | ❌ **404 (removed)** | Was full match data |
| 16 | `GET /api/leagueseasondeepstats` | `id=`, `season=`, `type=`, `stat=` | X-Fm-Req | ⚠️ Needs header | Deep league player stats |

### Alternative Gateway: `apigw.fotmob.com`

| # | Endpoint | Auth | Status |
|---|----------|------|--------|
| 17 | `GET /searchapi/suggest?term=&lang=en` | **None (CORS-open)** | ✅ Verified — returns matches, teams, players |
| 18 | `GET /searchapi/search?term=` | None | ✅ Verified |

### Match Pages (the critical path for match details)

| Method | URL Pattern | Auth |
|--------|-------------|------|
| Page fetch | `www.fotmob.com/matches/{teamA}-vs-{teamB}/{hash}` | None (Next.js SSR) |
| Data source | `__NEXT_DATA__` script tag → `props.pageProps.content` | Embedded JSON |

---

## 2. All Available Datasets

### A. From `/api/matches` (per date)

```json
{
  "leagues": [{
    "primaryId": 47,
    "ccode": "ENG",
    "name": "Premier League",
    "matches": [{
      "id": 4310531,
      "leagueId": 47,
      "time": "14:00",
      "home": { "id": 8456, "name": "Man City", "score": 2 },
      "away": { "id": 8634, "name": "Chelsea", "score": 1 },
      "status": {
        "utcTime": "2024-03-26T14:00:00.000Z",
        "started": true,
        "cancelled": false,
        "finished": true,
        "scoreStr": "2 - 1"
      }
    }]
  }],
  "date": "20240326"
}
```

- Match ID, league ID, home/away team IDs + names, scores, status, kickoff time
- **`pageUrl`** (slug for match page, e.g., `/matches/argentina-vs-netherlands/1hklvd`)

### B. From Match Page `__NEXT_DATA__` (the core data source)

Extracted from `props.pageProps`:

| Dataset | JSON Path | Coverage |
|---------|-----------|----------|
| **Match metadata** | `.general` (matchId, matchName, homeTeam, awayTeam) | Pre-rendered matches |
| **Scores + events** | `.header` (teams, scores, events[] with type/time/player) | All pre-rendered |
| **Team match stats** | `.content.stats.Periods.All.stats[]` | Most matches |
| **Period splits** | `.content.stats.Periods.FirstHalf/SecondHalf/FirstExtraHalf/SecondExtraHalf` | Most |
| **Per-player match stats** | `.content.playerStats` (keyed by playerId) | Most |
| **Shot maps** | `.content.playerStats[].shotmap[]` | Most |
| **Lineups** | `.content.lineup` (formations, starters, subs, coach) | All |
| **Player ratings** | `.content.playerRatings[]` | Most |
| **Momentum graph** | `.content.matchFacts.momentum.main.data[]` | Many matches |
| **Officials, attendance, venue** | `.content.matchFacts.infoBox` | All |
| **Head-to-head** | `.content.h2h` | Most |

#### Team Match Stats Structure

```json
{
  "content": {
    "stats": {
      "Periods": {
        "All": {
          "stats": [
            { "title": "Expected goals (xG)", "stats": [1.84, 0.72] },
            { "title": "Ball possession", "stats": [65, 35] },
            { "title": "Total shots", "stats": [14, 8] },
            { "title": "Shots on target", "stats": [6, 3] },
            { "title": "Corner kicks", "stats": [7, 4] }
          ]
        }
      }
    }
  }
}
```

Available stat groups: `Top stats`, `Expected goals (xG)`, `Shots`, `Physical performance`, `Passes`, `Defence`, `Duels`, `Discipline`.

#### Per-Player Match Stats Structure

```json
{
  "content": {
    "playerStats": {
      "174543": {
        "name": "Kevin De Bruyne",
        "id": 174543,
        "optaId": 53846,
        "teamId": 8456,
        "teamName": "Man City",
        "isGoalkeeper": false,
        "shirtNumber": 17,
        "usualPosition": "Midfielder",
        "stats": [
          {
            "title": "Top stats",
            "stats": {
              "FotMob rating": { "key": "rating", "stat": { "value": 8.7 } },
              "Goals": { "key": "goals", "stat": { "value": 1 } },
              "Assists": { "key": "assists", "stat": { "value": 0 } },
              "Expected goals (xG)": { "key": "expected_goals", "stat": { "value": 0.54 } },
              "Expected assists (xA)": { "key": "expected_assists", "stat": { "value": 0.21 } }
            }
          }
        ],
        "shotmap": [
          { "x": 87, "y": 42, "expectedGoals": 0.32, "situation": "Open play", "shotType": "Right foot", "result": "Goal" }
        ]
      }
    }
  }
}
```

Players who did not play have `stats: []` — skip them.

### C. From `/api/leagues?id=77` (World Cup)

```json
{
  "details": { "id": 77, "type": "league", "name": "FIFA World Cup" },
  "seasons": [{ "id": "2022/2023", "name": "22/23" }],
  "table": [{
    "data": {
      "table": {
        "all": [
          { "idx": 1, "name": "Netherlands", "id": 8482, "played": 3, "wins": 2, "draws": 1, "losses": 0, "scoresStr": "5-1", "goalConDiff": 4, "pts": 7 }
        ]
      }
    }
  }]
}
```

### D. From `/api/teams?id={teamId}`

```json
{
  "details": { "id": 8456, "type": "team", "name": "Man City", "country": "ENG" },
  "squad": [
    { "title": "Goalkeepers", "members": [
      { "id": 137326, "name": "Ederson", "role": "Keeper" }
    ]}
  ],
  "fixtures": { "allFixtures": { "fixtures": [] } }
}
```

### E. From `/api/playerData?id={playerId}`

```json
{
  "id": 174543,
  "name": "Kevin De Bruyne",
  "primaryTeam": { "teamId": 8456, "teamName": "Man City", "role": "Midfielder" },
  "playerInformation": [
    { "value": { "fallback": "BEL" }, "title": "Country" },
    { "value": { "fallback": "32" }, "title": "Age" },
    { "value": { "fallback": "181 cm" }, "title": "Height" }
  ],
  "recentMatches": [
    {
      "teamId": 8456, "teamName": "Man City",
      "opponentTeamId": 8634, "opponentTeamName": "Chelsea",
      "matchDate": "2024-03-26T14:00:00.000Z",
      "rating": { "num": "7.8" },
      "minutesPlayed": 90, "goals": 0, "assists": 1
    }
  ]
}
```

### F. From `apigw.fotmob.com/searchapi/suggest`

```json
{
  "matchSuggest": [{
    "label": "Argentina 1-2 Saudi Arabia",
    "options": [{
      "payload": {
        "id": 3370566,
        "homeName": "Argentina",
        "awayName": "Saudi Arabia",
        "leagueName": "World Cup",
        "leagueId": 77,
        "matchDate": "2022-11-22T10:00:00.000Z",
        "homeScore": 1,
        "awayScore": 2,
        "statusId": 7
      }
    }]
  }]
}
```

---

## 3. Data Retrieval Methods

| Data | Method | Auth | Notes |
|------|--------|------|-------|
| Match list (by date) | REST `GET /api/matches?date=` | None | Single date only |
| League/standings | REST `GET /api/leagues?id=` | None | Also returns fixtures, top scorers |
| Team profile | REST `GET /api/teams?id=` | None | Squad, fixtures, form |
| Player profile | REST `GET /api/playerData?id=` | None | Bio, recent matches, career |
| Search | REST `GET /api/searchData?term=` | None | Returns player/team/league IDs |
| **Match details (FULL)** | **Next.js SSR page → `__NEXT_DATA__` parse** | **None** | **Core data source** |
| Match score (lite) | REST `GET /api/data/match-score?matchId=` | None | Polling-friendly |
| Match ID lookup | REST `apigw/searchapi/suggest?term=` | None (CORS-open) | Best for ID mapping |

**Critical caveat for historical matches**: The `__NEXT_DATA__` on match pages is only pre-rendered for **popular/recent** fixtures. For older/less popular matches, the page loads data client-side (requiring `x-mas` header generation via browser JS). We may need a Playwright fallback.

---

## 4. Authentication & Rate Limiting

| Aspect | Detail |
|--------|--------|
| **Auth mechanism** | `X-Fm-Req` header: Base64(`{url, timestamp, MD5(jsonStringify(url+timestamp) + Rick Astley lyrics)}`) |
| **Endpoints requiring auth** | `/api/matchDetails` (now 404 anyway), `/api/leagueseasondeepstats` |
| **Endpoints NOT requiring auth** | All 14+ verified endpoints listed in Section 1 |
| **Rate limiting** | No documented limits observed; use 1 req/s courtesy delay |
| **CORS** | Partially open; `apigw.fotmob.com` is CORS-open |
| **Secret lyrics** | Rick Astley — "Never Gonna Give You Up" (verified by multiple independent researchers) |

---

## 5. FIFA ↔ FotMob Match ID Mapping Strategy

### Current State
- Our DB: `matches` table with FIFA match IDs (integers, e.g., `504320001`)
- FotMob: Own integer IDs (e.g., `3370566`) + slug hashes (e.g., `1hklvd`)

### Primary Strategy: Search-Based Resolution

```
For each FIFA match in database:
  1. Get home_team_name and away_team_name from our teams table
  2. CALL apigw.fotmob.com/searchapi/suggest?term={home}%20{away}
     (CORS-open, no auth required)
  3. Parse matchSuggest[].options[].payload
  4. DISAMBIGUATE by:
     - leagueId == 77 (World Cup)
     - matchDate matches our match kickoff date
     - homeName/awayName match (fuzzy if needed)
  5. STORE: match_id_mappings (fifa_match_id, fotmob_match_id, fotmob_page_url)
```

### Alternative: Date-Based Cross-Reference

```
For each match day in our schedule:
  1. CALL www.fotmob.com/api/matches?date={YYYYMMDD}
  2. Filter matches[] where leagueId == 77
  3. Cross-reference team names to find right match
  4. Extract match.id and match.pageUrl
```

### Fallback: Static Manual Mapping
- For edge cases where search fails
- Pre-seed from our existing match schedule + known FotMob IDs

### Player ID Mapping
- Not required for core ETL — FotMob player IDs are returned per-match in `__NEXT_DATA__`
- Can cross-reference by name against our `players` table post-ETL if needed

---

## 6. Recommended ETL Implementation Order

### Phase 1: Discovery & Mapping (Foundation)

| Step | Entity | Source | Target Table |
|------|--------|--------|-------------|
| 1a | FotMob match ID mapping | `apigw/searchapi/suggest` | `match_id_mappings` |
| 1b | FotMob team ID mapping | `apigw/searchapi/suggest` | `team_id_mappings` (optional) |

### Phase 2: Team Match Stats

| Step | Entity | Source | Target Table |
|------|--------|--------|-------------|
| 2 | Team match statistics | `__NEXT_DATA__` → `content.stats.Periods.All` | `team_match_stats` |

Stat keys to extract: `expected_goals`, `ball_possession`, `total_shots`, `shots_on_target`, `shots_off_target`, `blocked_shots`, `corner_kicks`, `fouls`, `yellow_cards`, `red_cards`, `offsides`, `total_passes`, `accurate_passes`, `pass_accuracy`, `clearances`, `tackles`, `duels_won`, `aerials_won`, `saves`, `throw_ins`, `free_kicks`, `goal_kicks`, `crosses`, `interceptions`.

### Phase 3: Player Match Stats

| Step | Entity | Source | Target Table |
|------|--------|--------|-------------|
| 3 | Player match statistics | `__NEXT_DATA__` → `content.playerStats` | `player_match_stats` |

Per-player stat keys: `rating`, `minutes_played`, `goals`, `assists`, `expected_goals`, `expected_assists`, `total_shots`, `shots_on_target`, `accurate_passes`, `total_passes`, `chances_created`, `touches`, `tackles`, `clearances`, `duels_won`, `aerials_won`, `interceptions`, `fouls`, `yellow_cards`, `red_cards`, `penalties_won`, `penalties_conceded`, `saves` (GK), `goals_conceded` (GK), `punches` (GK).

### Phase 4: Events & Lineups

| Step | Entity | Source | Target Table |
|------|--------|--------|-------------|
| 4 | Match events | `__NEXT_DATA__` → `header.events` | `match_events` |
| 5 | Match lineups | `__NEXT_DATA__` → `content.lineup` | `match_lineups`, `match_lineup_players` |

### Phase 5: Advanced Analytics

| Step | Entity | Source | Target Table |
|------|--------|--------|-------------|
| 6 | Shot maps | `__NEXT_DATA__` → `playerStats[].shotmap` | `shot_maps` |
| 7 | Momentum | `__NEXT_DATA__` → `matchFacts.momentum` | `match_momentum` |

---

## 7. Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Match page not pre-rendered** (returns `{fetchingLeagueData: true}`) | No `content` in `__NEXT_DATA__` | Detect missing `.content`, fall back to Playwright browser rendering |
| **FotMob blocks our IP** | ETL fails mid-pipeline | Rate limit (1 req/s), rotate User-Agent, proxy rotation for bulk phases |
| **Search doesn't find match** (team name mismatch) | Mapping gap | Date-based `/api/matches` filtering fallback; manual mapping table |
| **Pre-2022 World Cup missing** | No data available | FotMob only covers 2022+ World Cups; skip older tournaments |
| **FotMob API changes (authentication/deprecation)** | Endpoints break | Pin to page-embedded `__NEXT_DATA__` approach (SSR, not API-dependent) |

---

## 8. World Cup League Reference

| Property | Value |
|----------|-------|
| **League ID** | `77` |
| **2022 season ID** | `2022/2023` (or `2022` in some contexts) |
| **Page URL** | `https://www.fotmob.com/leagues/77/overview/world-cup` |
| **Example match URL** | `https://www.fotmob.com/matches/argentina-vs-netherlands/1hklvd` |
| **Example match ID** | `3370566` (Netherlands vs Argentina QF 2022) |
| **Team IDs** | Brazil=`10155`, Argentina=`10156`, France=`10160`, England=`10159`, etc. |

### Known 2022 World Cup Match Page Slugs

| Match | Slug |
|-------|------|
| Argentina vs Saudi Arabia | `/matches/argentina-vs-saudi-arabia/1qltrm` |
| Cameroon vs Brazil | `/matches/cameroon-vs-brazil/1tyrr3` |
| Brazil vs Serbia | `/matches/serbia-vs-brazil/28o7i3` |
| England vs USA | `/matches/usa-vs-england/1wtn51` |
| Costa Rica vs Germany | `/matches/costa-rica-vs-germany/1xgu3w` |
| Netherlands vs Argentina | `/matches/argentina-vs-netherlands/1hklvd` |

---

## 9. Source Code References

- **Public-FotMob-API**: https://github.com/pseudo-r/Public-FotMob-API — Most comprehensive docs
- **golazo (Go)**: https://github.com/0xjuanma/golazo/blob/main/internal/fotmob/client.go — Page-based `__NEXT_DATA__` fetcher
- **sportly (Python)**: https://github.com/pseudo-r/sportly/blob/master/docs/fotmob/README.md — Python wrapper docs
- **browse.sh guide**: https://browse.sh/skills/fotmob.com/find-stats-y2yyf7 — Match/player stats extraction guide
- **Auth reverse engineering**: https://viktornilsson.github.io/security/2024/11/01/fotmob-auth.html
- **TypeScript auth gist**: https://gist.github.com/AlexGodard/0514a35b769e942acec796efa0a8c7a4
