# Frontend vs Backend — Architecture Comparison

## What We Both Did the Same

### 1. Feature-Based Module Structure

Both sides organize code by domain entity, not by technical layer:

```
Backend                          Frontend
──────                           ───────
routes/players.py                pages/Players/Players.tsx
routes/teams.py                  pages/Teams/Teams.tsx
routes/matches.py                pages/Matches/Matches.tsx
routes/standings.py              pages/Standings/Standings.tsx
routes/venues.py                 pages/Venues/Venues.tsx
routes/groups.py                 pages/Groups/Groups.tsx
routes/stages.py                 pages/Stages/Stages.tsx
```

Each feature is a self-contained unit with its own routes/pages, types/schemas, and API logic.

### 2. Consistent Naming Conventions

| Pattern | Backend | Frontend |
|---|---|---|
| List endpoint | `GET /players` | `Players.tsx` page + `api/players.ts` |
| Detail endpoint | `GET /players/{id}` | `PlayerDetail.tsx` page |
| Card schema | `PlayerCardResponse` | `PlayerCard` interface |
| Detail schema | `PlayerDetailResponse` | `PlayerDetail` interface |
| Router prefix | `/players` (lowercase) | `/players` (lowercase) |

### 3. Dependency Injection / Separation of Concerns

- **Backend**: FastAPI `Depends()` injects repositories into route handlers
- **Frontend**: Each API file creates its own axios instance; components receive data via props

Both avoid global state and keep concerns isolated per feature.

### 4. ORM → Schema → Response Pipeline

```
Backend:  ORM → Mapper → Pydantic Schema → JSON
Frontend: JSON → Axios → TypeScript Interface → React Component
```

Both sides have a clean data transformation layer between storage/API and presentation.

### 5. Null Handling

- **Backend**: Pydantic `str | None = None` defaults
- **Frontend**: TypeScript `string | null` with `??` fallback operators

Both consistently handle optional data at the type level.

### 6. Error Handling Pattern

- **Backend**: `if entity is None: raise HTTPException(404, "...")`
- **Frontend**: `if (!id) return;` guard in `useEffect`, then `if (!data) return <h2>Loading...</h2>`

Both use guard-clause patterns to handle missing data early.

---

## Differences

### 1. Pagination

| | Backend | Frontend |
|---|---|---|
| **Players** | `PaginatedResponse[PlayerCardResponse]` with `limit/offset` | No pagination — fetches all, relies on `/search` endpoint |
| **Teams** | `PaginatedResponse[TeamResponse]` with `limit/offset` | Same — no client-side pagination |

**Why**: Backend supports `?limit=25&offset=0` query params, but the frontend never uses them. The frontend uses the dedicated `/search?q=...` endpoint instead of paginated list + search combo.

### 2. Search Implementation

| | Backend | Frontend |
|---|---|---|
| **Approach** | Query params on main list endpoint + separate `/search` endpoint | Dedicated `/search?q=...` endpoint only |
| **Fuzzy matching** | Repository-level `search()` method | N/A — relies on backend |

Backend has two search paths: filter via `?search=` on `GET /players`, and fuzzy via `GET /players/search?q=`. Frontend only uses the latter.

### 3. Sub-Resource Endpoints

Backend exposes rich nested endpoints that the frontend doesn't consume:

| Endpoint | Backend | Frontend |
|---|---|---|
| `GET /players/{id}/similar` | ✅ ML similarity engine | ❌ Not wired |
| `GET /players/{id}/career` | ✅ Career summary | ❌ Not wired |
| `GET /players/{id}/matches` | ✅ Player match history | ❌ Not wired |
| `GET /teams/{id}/players` | ✅ Team roster | ❌ Not wired |
| `GET /teams/{id}/standing` | ✅ Team standing | ❌ Not wired |
| `GET /teams/{id}/stats` | ✅ Aggregated stats | ❌ Not wired |
| `GET /groups/{id}/standings` | ✅ Group standings | ✅ Used in GroupDetail |
| `GET /groups/{id}/matches` | ✅ Group matches | ✅ Used in GroupDetail |
| `GET /stages/{id}/matches` | ✅ Stage matches | ✅ Used in StageDetail |

**Frontend consumes ~50% of available backend endpoints.** The ML similarity, career, team roster, and stats endpoints exist but aren't wired to the UI yet.

### 4. Data Aggregation

- **Backend**: `teams.py` computes aggregated stats (averages, sums) across all matches in `get_team_stats()`
- **Backend**: `players.py` matches player stats via name fuzzy matching in `_match_player_stats()`
- **Frontend**: Pure pass-through — displays what the API returns, no client-side computation

### 5. CORS Configuration

- **Backend**: Explicitly allows `http://localhost:5173` (Vite dev server)
- **Frontend**: Hardcoded `baseURL: "http://127.0.0.1:8000"`

Both are tightly coupled to the local dev environment. Production would need environment variables.

### 6. ML Integration

- **Backend**: `PlayerSimilarityEngine` loaded at module level in `players.py`, called via `GET /players/{id}/similar`
- **Frontend**: No ML integration — similarity feature is backend-only

### 7. State Management

- **Backend**: Stateless per request (FastAPI + SQLAlchemy sessions)
- **Frontend**: Component-level `useState` + `useEffect` — no global state (Redux, Zustand, etc.)

Each frontend feature manages its own state independently. No shared state between pages.

### 8. Detail Page Complexity

| Feature | Backend Response Fields | Frontend Renders |
|---|---|---|
| Player Detail | 15+ fields + stats | All fields |
| Team Detail | 8 fields | All fields |
| Match Detail | 12 fields + team stats + player stats | All fields (table for player stats) |
| Standing Detail | 11 fields per row | Full table |
| Venue Detail | 8 fields | All fields |
| Group Detail | 4 fields + standings + matches | All (table + list) |
| Stage Detail | 7 fields + matches | All (list) |

### 9. Testing

- **Backend**: Repository tests, mapper tests (pytest)
- **Frontend**: No tests yet

---

## Summary

| Aspect | Backend | Frontend |
|---|---|---|
| Language | Python (FastAPI) | TypeScript (React + Vite) |
| Modules | 7 features | 7 features (1:1 match) |
| Total endpoints | ~30 | Consumes ~15 |
| Search | 2 methods (query param + fuzzy) | 1 method (fuzzy endpoint) |
| Pagination | Server-side (limit/offset) | None (full list) |
| ML | Player similarity engine | Not integrated |
| Testing | ✅ | ❌ |
| State | Request-scoped | Component-level useState |
| Styling | N/A | None (raw HTML) |

Both sides follow a clean, consistent, entity-first architecture. The backend is more feature-rich (pagination, ML, stats aggregation), while the frontend is a minimal consumption layer that mirrors the backend's structure 1:1.
