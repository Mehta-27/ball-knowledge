# Ball Knowledge — The Complete Handbook

> *data doesn't have a favourite team.*

---

## Table of Contents

1. [What is Ball Knowledge?](#1-what-is-ball-knowledge)
2. [Why This Stack?](#2-why-this-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Data Pipeline (ETL)](#4-data-pipeline-etl)
5. [Machine Learning Pipeline](#5-machine-learning-pipeline)
6. [Backend Deep Dive](#6-backend-deep-dive)
7. [Frontend Deep Dive](#7-frontend-deep-dive)
8. [Deployment & Infrastructure](#8-deployment--infrastructure)
9. [API Reference](#9-api-reference)
10. [Directory Structure](#10-directory-structure)
11. [Jargon Glossary](#11-jargon-glossary)
12. [Design Philosophy](#12-design-philosophy)
13. [Known Issues & Tradeoffs](#13-known-issues--tradeoffs)
14. [How to Run Locally](#14-how-to-run-locally)
15. [How to Retrain the ML Model](#15-how-to-retrain-the-ml-model)

---

## 1. What is Ball Knowledge?

**Ball Knowledge** is a football intelligence platform built around a **player similarity engine**. The core problem it solves: given any player, find the most statistically similar players across the entire tournament — not by name or reputation, but by actual performance data.

### The Flow

```
FIFA API ──┐
           ├──▶ Scrapers ──▶ PostgreSQL ──▶ Feature Engineering ──▶ Cosine Similarity
FotMob ────┘                                                    │
                                                                ▼
                                              FastAPI (35 endpoints)
                                                                │
                                                                ▼
                                            React + TypeScript + Framer Motion
                                                                │
                                                                ▼
                                         "Messi is most similar to Mbappé, Haaland, Kane"
```

### What Makes It Different

- **Data-driven, not opinion-driven.** Similarity is computed from 48 statistical features, not editorial bias.
- **Per-90 normalization.** Stats are normalized per 90 minutes played, so a player who plays 20 minutes isn't compared unfairly against one who plays 90.
- **Full-stack.** From raw data scraping to a polished web UI, everything is custom-built.
- **Real match data.** Not synthetic — 1,248 players, 102 matches, 1,536 player-match stat rows from the FIFA Club World Cup.

---

## 2. Why This Stack?

### Backend: Python + FastAPI + PostgreSQL

| Choice | Why |
|--------|-----|
| **Python** | scikit-learn, pandas, numpy are Python-native. The ML pipeline lives here. No reason to split into a second language. |
| **FastAPI** | Async, auto-generates OpenAPI docs, Pydantic validation, trivial to set up. Express equivalent in Python but faster to develop. |
| **PostgreSQL** | Relational data (players → teams → matches → stats) is naturally tabular. Neon Postgres for serverless scaling. |
| **SQLAlchemy ORM** | Type-safe database access, avoids raw SQL injection, maps cleanly to Python classes. |
| **Alembic** | Schema migrations. Track DB changes in git. |
| **scikit-learn** | `StandardScaler` + `cosine_similarity` — battle-tested, no need for PyTorch/TensorFlow for this task. |
| **joblib** | Serializes Python objects (DataFrames, numpy arrays, sklearn models) to `.pkl` files. Fast, standard for ML artifact storage. |

### Frontend: React + TypeScript + Vite + Framer Motion

| Choice | Why |
|--------|-----|
| **React 19** | Component model, ecosystem, team familiarity. Not Vue/Svelte/Angular — React is the default unless there's a reason not to use it. |
| **TypeScript 6** | Catches bugs at compile time. Critical for API response shapes (e.g., `player.xG?.toFixed(2) ?? "—"`) |
| **Vite 8** | Sub-second HMR, native ESM, zero-config for React. Webpack is dead for new projects. |
| **Framer Motion 12** | `staggerChildren`, `whileInView`, spring physics. CSS transitions can't do staggered entrance animations cleanly. |
| **Axios** | Interceptors, request/response transformation, better error handling than `fetch`. |

### Data Sources: FIFA API + FotMob

| Source | What We Get | Why |
|--------|------------|-----|
| **FIFA API** | Teams, players, matches, venues, stages, groups, standings | Official tournament data — clean, structured, reliable. Free, no auth. |
| **FotMob** | Per-match team stats, per-match player stats, player ratings, xG, xA | FIFA API has no per-player match stats. FotMob has the richest public football data. Parsed from Next.js `__NEXT_DATA__` SSR payload. |

**Why not FBref?** Cloudflare WAF blocks automated requests. FotMob's data is equally comprehensive and scrapable.

### Deployment: Neon + Render + Vercel

| Service | Why |
|---------|-----|
| **Neon PostgreSQL** | Serverless Postgres — auto-scales, free tier, connection pooling built-in. No Docker. |
| **Render** | Free tier for Python/FastAPI. Auto-deploys from GitHub. Cold starts (~30s) acceptable for a portfolio project. |
| **Vercel** | Best-in-class React/Vite hosting. Auto-deploys from GitHub, edge network, free tier. |
| **UptimeRobot** | Pings Render every 5 min to prevent cold start spin-down (free). |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vercel)                           │
│                                                                     │
│  React 19 + TypeScript 6 + Vite 8 + Framer Motion 12               │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Home     │ │ Players  │ │  Teams   │ │ Matches  │ │ Standings│  │
│  │  (hero +  │ │ (list +  │ │ (list +  │ │ (list +  │ │ (list +  │  │
│  │  6 sections│ │ detail)  │ │ detail)  │ │ detail)  │ │ detail)  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                             │
│  │  Venues  │ │  Groups  │ │  Stages  │                             │
│  │ (list +  │ │ (list +  │ │ (list +  │                             │
│  │ detail)  │ │ detail)  │ │ detail)  │                             │
│  └──────────┘ └──────────┘ └──────────┘                             │
│                                                                     │
│  Axios HTTP client → import.meta.env.VITE_API_URL                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKEND (Render)                               │
│                                                                     │
│  FastAPI + SQLAlchemy + scikit-learn                                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     35 GET ENDPOINTS                          │   │
│  │  /players    /teams    /matches    /standings    /venues     │   │
│  │  /groups     /stages   + sub-resources                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌───────────────────────┐  ┌──────────────────────────────────┐   │
│  │   ML Similarity Engine │  │         ETL Pipelines            │   │
│  │   (48 per-90 features) │  │   (11 sync services)             │   │
│  │   cosine similarity    │  │   FIFA API + FotMob scrapers     │   │
│  │   precomputed matrix   │  │   → PostgreSQL                   │   │
│  └───────────────────────┘  └──────────────────────────────────┘   │
│                                                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ SSL
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE (Neon PostgreSQL)                        │
│                                                                     │
│  12 tables: teams, players, matches, venues, stages, groups,        │
│  standings, match_mappings, player_mappings,                        │
│  team_match_stats, player_match_stats                               │
│                                                                     │
│  1,248 players │ 1,155 mapped │ 1,536 stat rows │ 102 matches      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Pipeline (ETL)

### Overview

The ETL (Extract, Transform, Load) pipeline pulls data from two external sources, transforms it, and loads it into PostgreSQL. It runs as a single Python script (`python -m src.main`) that executes 11 sync services sequentially.

### Pipeline Order

```
 Step  Service                     Source          Target Table
 ──── ─────────────────────────── ─────────────── ─────────────────────
  1    FIFASyncService             FIFA API        teams
  2    PlayerSyncService           FIFA API        players
  3    VenueSyncService            FIFA API        venues
  4    StageSyncService            FIFA API        stages
  5    GroupSyncService            FIFA API        groups
  6    MatchSyncService            FIFA API        matches
  7    StandingSyncService         computed        standings
  8    FotMobMappingSyncService    FotMob search   match_mappings
  9    FotMobStatsSyncService      FotMob pages    team_match_stats
 10    FotMobPlayerStatsSyncService FotMob pages   player_match_stats
 11    PlayerMappingSyncService    internal fuzzy  player_mappings
```

**Critical ordering**: Steps 9-10 (stats) MUST run before step 11 (player mappings), because player mapping queries `player_match_stats` to find FotMob player IDs. This was a major bug early on — the original order had step 11 before step 10, producing 0 player mappings.

### Data Sources in Detail

#### FIFA API (Steps 1-6)

- **URL pattern**: `https://digitalhub.fifa.com/api/v3/{resource}`
- **Auth**: None required
- **Returns**: Structured JSON with teams, players (with FIFA IDs), matches, venues, stages, groups
- **Player IDs**: FIFA assigns unique integer IDs to each player (e.g., `229397` = Lionel Messi)

#### FotMob (Steps 8-10)

FotMob data is extracted by scraping the **Next.js SSR payload** (`__NEXT_DATA__` script tag) from match pages, NOT from their REST API.

- **Why `__NEXT_DATA__`?** FotMob's REST API endpoints require an `X-Fm-Req` header (MD5-signed token using Rick Astley lyrics as HMAC secret — seriously). The SSR page embeds all data in a `<script>` tag that's publicly accessible.
- **Match ID resolution**: FIFA match IDs → FotMob match IDs via `apigw.fotmob.com/searchapi/suggest` (CORS-open, no auth).
- **Per-match data**: Each FotMob match page contains team stats (possession, xG, shots) AND per-player stats (rating, goals, assists, xG, xA, touches, tackles, etc.)

#### Player Mapping (Step 11)

Links FIFA player IDs to FotMob player IDs using **fuzzy string matching**:

```python
# Algorithm: SequenceMatcher with diacritics normalization
# Threshold: 0.85 similarity score
# Example: "Lionel Andrés Messi Cuccittini" ≈ "Lionel Messi" → match
```

**Result**: 1,155 out of 1,248 players mapped (92.6% coverage). Unmapped players are typically reserves with no match stats.

### Database Schema (Key Tables)

```
teams ──────────┐
                 ├──▶ players ──────────┐
                 │                       │
matches ─────────┤                       ├──▶ player_mappings (FIFA ↔ FotMob)
                 │                       │
                 ├──▶ match_mappings ────┤
                 │   (FIFA ↔ FotMob)    │
                 │                       │
                 ├──▶ team_match_stats ◄─┘
                 │
                 └──▶ player_match_stats
                     (1,536 rows, 59 columns per row)
```

---

## 5. Machine Learning Pipeline

### The Problem

"Given Player X, who are the 10 most statistically similar players in the tournament?"

### The Solution: Cosine Similarity on Per-90 Feature Vectors

#### Step 1: Feature Engineering (`PlayerFeatureBuilder`)

For each mapped player, aggregate all per-match stats into tournament-level totals, then normalize to **per-90-minute rates**.

```python
# Per-90 normalization
per90 = total_minutes / 90.0
goals_per90 = total_goals / per90
```

**Why per-90?** A player who plays 20 minutes and scores 1 goal has 4.5 goals/90 — elite-level. But a player who plays 90 minutes and scores 1 goal has 1.0 goals/90 — average. Raw totals bias toward players with more minutes, not better performance.

**Minimum threshold**: Players with < 45 total minutes are excluded (less than one half of football — not enough data for meaningful comparison).

#### Step 2: Feature Vector (48 dimensions)

| Category | Features (per-90) | Count |
|----------|-------------------|-------|
| **Volume** | minutes_played (total, not per-90) | 1 |
| **Attacking** | goals, assists, xG, xA, xG_non_penalty, xG_plus_xA, total_shots, shots_on_target, shots_off_target, shot_accuracy, blocked_shots, shots_woodwork | 12 |
| **Possession/Passing** | touches, touches_opposition_box, accurate_passes, accurate_crosses, long_balls_accurate, passes_into_final_third, corners | 7 |
| **Chance Creation** | chances_created, big_chances_created | 2 |
| **Defensive** | tackles, interceptions, defensive_actions, clearances, headed_clearances, recoveries, duels_won, duels_lost, ground_duels_won, aerials_won | 10 |
| **Ball Carrying** | dribbles_succeeded, dribbled_past, dispossessed, was_fouled | 4 |
| **Discipline** | fouls, offsides, errors_led_to_goal, player_throws | 4 |
| **Goalkeeper** | saves, saves_inside_box, goals_conceded, goals_prevented, keeper_diving_saves, keeper_high_claims, keeper_sweeper_actions, punches, xG_on_target_faced, xG_on_target_variant | 10 |
| **Rating** | rating (average, not per-90) | 1 |
| **Total** | | **48 + 1** |

**Why include all 48?** Each feature captures a different dimension of playing style. A defensive midfielder and a center-back might have similar tackle/interception/duel profiles but different passing profiles. More features = more nuanced similarity.

**Why include goalkeeper stats?** When a goalkeeper is queried, their saves/cleansheet stats are compared against other keepers. When an outfield player is queried, their goalkeeper stats are all zero — the cosine similarity naturally ignores zero-dimensions.

#### Step 3: StandardScaler (`PlayerScaler`)

```python
# For each feature column:
scaled_value = (value - mean) / standard_deviation
```

**Why?** Goals range 0-3 per 90. Passes range 0-80 per 90. Without scaling, passing stats would dominate the similarity calculation purely because of larger numbers. StandardScaler puts everything on the same scale (z-scores).

#### Step 4: Cosine Similarity Matrix

```python
cosine_similarity(V_i, V_j) = (V_i · V_j) / (‖V_i‖ × ‖V_j‖)
```

- **Precomputed**: Full N×N matrix computed once during training (~2.3MB for 541 players)
- **Symmetric**: sim(A,B) = sim(B,A)
- **Range**: [-1, 1], higher = more similar
- **Stored as**: `player_similarity.pkl` (serialized numpy array)

#### Step 5: Inference (`PlayerSimilarityEngine`)

```python
def get_similar_player(player_id):
    1. Find player row in player_index DataFrame
    2. Get similarity scores from matrix row
    3. Sort descending, skip self-match (score = 1.0)
    4. Return top 10 with player names and scores
```

**Latency**: < 5ms (precomputed matrix, in-memory lookup via `@lru_cache`).

#### Training Artifacts

| File | Size | Contents |
|------|------|----------|
| `player_index.pkl` | ~25KB | DataFrame: player_id, player_name, team_id, position |
| `player_scaler.pkl` | ~3KB | Fitted sklearn StandardScaler |
| `player_similarity.pkl` | ~2.3MB | 541×541 cosine similarity matrix |

#### Example Results

**Lionel Messi (Argentina)**:
1. Kylian MBAPPÉ (France) — 0.865
2. Erling HAALAND (Norway) — 0.863
3. Harry KANE (England) — 0.857
4. Jonathan DAVID (Canada) — 0.846
5. Jude BELLINGHAM (England) — 0.845

**Virgil van Dijk (Netherlands)**:
1. Jan Paul VAN HECKE (Netherlands) — 0.801
2. Aymeric LAPORTE (Spain) — 0.708
3. Tim REAM (USA) — 0.703
4. David ALABA (Austria) — 0.694

---

## 6. Backend Deep Dive

### Project Structure

```
backend/
├── .env                    # DATABASE_URL (Neon Postgres connection string)
├── Dockerfile              # Render deployment config
├── requirements.txt        # Python dependencies
├── alembic/                # Database migrations
│   └── versions/           # Migration files
└── src/
    ├── app.py              # FastAPI application entry point + CORS config
    ├── main.py             # ETL pipeline orchestrator (11 sync services)
    │
    ├── database/
    │   ├── connection.py   # SQLAlchemy engine + session factory
    │   └── dependencies.py # FastAPI dependency injection (repo instances)
    │
    ├── orm/                # SQLAlchemy ORM models (12 models)
    │   ├── player.py       # 14 fields (id, team_id, name, position, height, etc.)
    │   ├── player_match_stat.py  # 59 fields (the richest table)
    │   ├── team_match_stat.py    # 42 fields
    │   └── ...             # team, match, venue, stage, group, standing, mappings
    │
    ├── repositories/       # Database access layer (Repository pattern)
    │   ├── player_repository.py
    │   └── ...             # One per entity, handles queries + pagination
    │
    ├── routes/             # FastAPI routers (7 files, 35 GET endpoints)
    │   ├── players.py      # /players, /players/{id}, /players/{id}/similar
    │   ├── matches.py      # /matches, /matches/{id}, /matches/{id}/player-stats
    │   └── ...             # teams, standings, venues, groups, stages
    │
    ├── schemas/            # Pydantic response models
    │   ├── player.py       # PlayerCardResponse, PlayerDetailResponse
    │   ├── match.py        # MatchCardResponse, MatchDetailResponse, PlayerStatInMatch
    │   └── pagination.py   # PaginatedResponse[T] (generic)
    │
    ├── mappers/            # ORM → Pydantic conversion
    │   ├── player_response_mapper.py
    │   └── match_response_mapper.py
    │
    ├── scraper/            # Data collection (9 files)
    │   ├── fifa_scraper.py              # FIFA API for teams
    │   ├── player_scrapper.py           # FIFA API for players
    │   ├── match_scraper.py             # FIFA API for matches
    │   ├── fotmob_scraper.py            # FotMob match ID resolution
    │   ├── fotmob_stats_scraper.py      # FotMob team match stats
    │   ├── fotmob_player_stats_scraper.py # FotMob per-player stats
    │   └── ...                          # venue, stage, group scrapers
    │
    ├── services/           # ETL sync logic (11 files)
    │   ├── fifa_sync_service.py         # Teams sync
    │   ├── fotmob_mapping_sync_service.py # FIFA↔FotMob match mapping
    │   ├── player_mapping_sync_service.py # FIFA↔FotMob player mapping (fuzzy)
    │   ├── fotmob_stats_sync_service.py   # Team stats sync
    │   ├── fotmob_player_stats_sync_service.py # Player stats sync
    │   └── ...                          # player, match, venue, stage, group, standing
    │
    ├── ml/                 # Machine Learning module
    │   ├── features/
    │   │   ├── player_feature.py          # 48-feature dataclass
    │   │   └── player_feature_builder.py  # Aggregation + per-90 normalization
    │   ├── preprocessing/
    │   │   └── player_scaler.py           # StandardScaler wrapper
    │   ├── training/
    │   │   └── player_similarity_trainer.py # Train pipeline
    │   ├── inference/
    │   │   └── player_similarity_engine.py  # Serve similarity queries
    │   └── artifacts/                     # Serialized .pkl files
    │
    └── alembic/            # DB migrations
```

### Key Patterns

**Repository Pattern**: Every entity has a `*Repository` class that encapsulates all database queries. Routes never touch SQLAlchemy directly — they call repo methods.

```python
# routes/players.py
repo: PlayerRepository = Depends(get_player_repository)
players = repo.get_paginated(limit=25, offset=0, search="messi")
```

**Dependency Injection**: FastAPI's `Depends()` system creates fresh repository instances per request. Defined in `database/dependencies.py`.

**Lazy Loading**: The ML similarity engine is loaded on first request via `@lru_cache`, not at import time. This prevents the backend from crashing if `.pkl` files are missing/corrupt.

```python
@lru_cache
def get_similarity_engine():
    return PlayerSimilarityEngine()  # loads .pkl files into memory
```

**Paginated Response**: The API uses a generic `PaginatedResponse[T]` schema:

```json
{
  "items": [...],
  "total": 1248,
  "limit": 25,
  "offset": 0
}
```

All list endpoints (players, teams, matches, venues) support `?limit=&offset=&search=` pagination.

---

## 7. Frontend Deep Dive

### Project Structure

```
frontend/
├── index.html             # Inter + Basement Grotesque font imports
├── .env                   # VITE_API_URL=http://127.0.0.1:8000
├── public/
│   └── fonts/             # Basement Grotesque WOFF2 + WOFF (self-hosted)
└── src/
    ├── main.tsx           # React entry point
    ├── App.tsx            # Router (15 routes, nested under MainLayout)
    ├── index.css          # Full design system (~3300 lines)
    │
    ├── api/               # HTTP client layer (7 files)
    │   ├── players.ts     # getPaginatedPlayers(), getPlayer(), getSimilarPlayers()
    │   ├── teams.ts       # getPaginatedTeams(), getTeam()
    │   ├── matches.ts     # getPaginatedMatches(), getMatch()
    │   └── ...            # venues, standings, stages, groups
    │
    ├── types/             # TypeScript interfaces (7 files)
    │   ├── players.ts     # PlayerCard, PlayerDetail, PlayerStatInMatch
    │   ├── matches.ts     # MatchCard, MatchDetail, TeamStatResponse
    │   └── ...
    │
    ├── layouts/
    │   └── MainLayout.tsx # Navbar + Outlet + Footer
    │
    ├── components/
    │   ├── home/          # Homepage sections (6 sections)
    │   │   ├── HeroSection.tsx
    │   │   ├── IntelligenceSection.tsx
    │   │   ├── FeaturedSection.tsx
    │   │   ├── EngineSection.tsx
    │   │   ├── ExploreSection.tsx
    │   │   └── CtaSection.tsx
    │   ├── layout/
    │   │   └── Navbar.tsx # Scroll-aware glass navbar with emerald glow
    │   └── ...            # Shared card components
    │
    └── pages/             # 15 pages (7 list + 7 detail + home)
        ├── Home/          # 6-section landing page with framer-motion
        ├── Players/       # Paginated grid + skeleton loading + search
        ├── PlayerDetail/  # Stats, similar players, match history
        ├── Teams/         # Paginated grid + search
        ├── TeamDetail/    # Squad, stats, recent matches
        ├── Matches/       # Paginated list + search
        ├── MatchDetail/   # Scoreboard, team comparison, 15-column player stats
        ├── Standings/     # Group standings tables
        ├── StandingDetail/
        ├── Venues/        # Venue cards with capacity
        ├── VenueDetail/
        ├── Groups/        # Group cards
        ├── GroupDetail/
        ├── Stages/        # Stage cards
        └── StageDetail/
```

### Design System

The frontend uses a **custom CSS design system** (no Tailwind, no Bootstrap):

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#050505` | Nearly-pure black backgrounds |
| `--primary` | `#00D68F` | Emerald green accent |
| `--text-primary` | `#FFFFFF` | Primary text |
| `--text-secondary` | `#A0A0A0` | Muted text |
| `--surface` | `rgba(255,255,255,0.03)` | Card backgrounds |
| `--border` | `rgba(255,255,255,0.06)` | Ultra-thin borders |

**Fonts**:
- **Basement Grotesque** — Hero titles, section headers (self-hosted, 24KB WOFF2)
- **Inter** — Body text, UI elements (Google Fonts)

### Key Patterns

**Paginated API Client**: All list pages use the same pattern:

```typescript
// 24 items per page, debounced search, Load More button
const [data, setData] = useState([]);
const [offset, setOffset] = useState(0);
const LIMIT = 24;

useEffect(() => {
    const results = await getPaginatedPlayers(LIMIT, offset);
    setData(prev => [...prev, ...results.items]);
}, [offset]);
```

**Skeleton Loading**: While API calls are in-flight, shimmer placeholder cards are shown:

```tsx
<div className="skeleton" style={{ width: "40%", height: "1.5rem" }} />
```

**Scroll-Aware Navbar**: The navbar changes appearance on scroll (glass blur, emerald glow pill) using `IntersectionObserver`.

**Framer Motion Stagger**: Page elements animate in with staggered delays:

```tsx
<motion.div variants={container} initial="hidden" whileInView="visible">
    {items.map((item, i) => (
        <motion.div key={item.id} variants={item} custom={i} />
    ))}
</motion.div>
```

### API Communication

All frontend API files use:

```typescript
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,  // Set in .env or Vercel env vars
});
```

**Critical**: `VITE_API_URL` must be set to `https://ball-knowledge-api.onrender.com` in Vercel environment variables. Without it, all API calls fail silently (empty responses, not errors).

---

## 8. Deployment & Infrastructure

### Live URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `https://ball-knowledge-nine.vercel.app` | React SPA |
| Backend | `https://ball-knowledge-api.onrender.com` | FastAPI |
| Database | Neon Postgres (connection string in `.env`) | PostgreSQL |

### Render Configuration

```
Runtime: Python 3
Build: pip install -r requirements.txt
Start: PYTHONPATH=src uv run uvicorn src.app:app --host 0.0.0.0 --port $PORT
Env vars:
  - DATABASE_URL = neon_connection_string
  - WEB_CONCURRENCY = 1 (default)
```

**Why `PYTHONPATH=src`?** All imports are relative to `src/` (e.g., `from ml.inference...`). Without setting PYTHONPATH, Python can't find the modules.

**Why `uv run`?** Render uses `uv` (fast Python package manager) instead of `pip` for faster builds.

### Vercel Configuration

```
Framework: Vite
Build: npm run build
Output: dist/
Env vars:
  - VITE_API_URL = https://ball-knowledge-api.onrender.com
```

### CORS

FastAPI backend allows:

```python
allow_origins=[
    "http://localhost:5173",           # Local dev
    "https://ball-knowledge-nine.vercel.app",  # Production
    "https://ball-knowledge-mehtarishit108-9506s-projects.vercel.app",  # Preview
]
```

### Cold Start Mitigation

- **UptimeRobot** pings `https://ball-knowledge-api.onrender.com/` every 5 minutes
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds; subsequent requests are fast

---

## 9. API Reference

### Players

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /players?limit=25&offset=0&search=` | List | Paginated player list with search |
| `GET /players/{id}` | Detail | Player bio, team, aggregated stats |
| `GET /players/{id}/similar` | ML | Top 10 similar players (cosine similarity) |
| `GET /players/{id}/stats` | Stats | Aggregated match statistics |
| `GET /players/{id}/matches` | History | Match history for player |
| `GET /players/{id}/career` | Career | Career summary |
| `GET /players/search?q=` | Search | Fuzzy search (up to 10 results) |

### Teams

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /teams?limit=25&offset=0&search=` | List | Paginated team list |
| `GET /teams/{id}` | Detail | Team info, squad, recent matches |

### Matches

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /matches?limit=25&offset=0&team_id=&stage_id=&group_id=` | List | Paginated, filterable |
| `GET /matches/{id}` | Detail | Full match: scoreboard, team stats, 15-column player stats |
| `GET /matches/{id}/players` | Players | Players grouped by team |
| `GET /matches/{id}/team-stats` | Team Stats | Team-level statistics |
| `GET /matches/{id}/player-stats` | Player Stats | Individual player statistics |

### Standings / Groups / Stages / Venues

| Endpoint | Description |
|----------|-------------|
| `GET /standings` | Full standings |
| `GET /groups` | Group list |
| `GET /groups/{id}` | Group detail with standings + matches |
| `GET /stages` | Competition stages |
| `GET /stages/{id}` | Stage detail with matches |
| `GET /venues?limit=25&offset=0&search=` | Paginated venue list |
| `GET /venues/{id}` | Venue detail |

---

## 10. Directory Structure

### Backend (D:\ball-knowledge\backend\)

```
backend/
├── .env                          # DATABASE_URL
├── Dockerfile                    # Render deployment
├── requirements.txt              # Dependencies
├── alembic.ini                   # Alembic config
└── src/
    ├── app.py                    # FastAPI app + CORS
    ├── main.py                   # ETL orchestrator
    ├── database/
    │   ├── connection.py         # SQLAlchemy engine
    │   └── dependencies.py       # FastAPI DI
    ├── orm/                      # 12 SQLAlchemy models
    ├── repositories/             # DB access layer
    ├── routes/                   # 7 FastAPI routers (35 endpoints)
    ├── schemas/                  # Pydantic response models
    ├── mappers/                  # ORM → Pydantic
    ├── scraper/                  # 9 data collection scripts
    ├── services/                 # 11 ETL sync services
    └── ml/                       # Machine Learning module
        ├── features/             # Feature engineering
        ├── preprocessing/        # StandardScaler
        ├── training/             # Model training
        ├── inference/            # Query serving
        └── artifacts/            # Serialized .pkl files
```

### Frontend (D:\ball-knowledge\frontend\)

```
frontend/
├── index.html                    # Font imports
├── .env                          # VITE_API_URL
├── public/fonts/                 # Basement Grotesque (WOFF2 + WOFF)
└── src/
    ├── main.tsx                  # Entry point
    ├── App.tsx                   # Router (15 routes)
    ├── index.css                 # Design system (~3300 lines)
    ├── api/                      # HTTP client (7 files)
    ├── types/                    # TypeScript interfaces (7 files)
    ├── layouts/                  # MainLayout (navbar + outlet)
    ├── components/               # Shared components
    │   ├── home/                 # 6 homepage sections
    │   ├── layout/               # Navbar
    │   └── ...                   # Card components
    └── pages/                    # 15 pages
        ├── Home/
        ├── Players/ + PlayerDetail/
        ├── Teams/ + TeamDetail/
        ├── Matches/ + MatchDetail/
        ├── Standings/ + StandingDetail/
        ├── Venues/ + VenueDetail/
        ├── Groups/ + GroupDetail/
        └── Stages/ + StageDetail/
```

---

## 11. Jargon Glossary

| Term | Definition |
|------|-----------|
| **ETL** | Extract, Transform, Load — the process of pulling data from external sources, cleaning it, and storing it in a database |
| **Per-90** | Stats normalized to a 90-minute basis. E.g., 2 goals in 45 minutes = 4.0 goals/90. Allows fair comparison across players with different playing times |
| **Cosine Similarity** | Measures the angle between two vectors. Range [-1, 1]. 1.0 = identical direction (most similar), 0.0 = orthogonal, -1.0 = opposite |
| **StandardScaler** | Z-score normalization: (value - mean) / std_dev. Puts all features on the same scale so no single feature dominates |
| **Feature Vector** | A list of numerical values that describe a player's characteristics. Our vectors have 48 dimensions |
| **xG (Expected Goals)** | Probability that a shot becomes a goal based on shot location, angle, body part, etc. xG = 0.5 means a 50% chance of scoring |
| **xA (Expected Assists)** | Probability that a pass becomes an assist based on pass type, location, etc. |
| **FIFA ID** | Unique integer assigned by FIFA to each player (e.g., 229397 = Messi) |
| **FotMob ID** | Unique integer assigned by FotMob to each player (e.g., 30981 = Messi) |
| **Player Mapping** | The link between a FIFA ID and a FotMob ID, enabling cross-reference of data from both sources |
| **Fuzzy Matching** | String comparison that tolerates minor differences (e.g., "Lionel Messi" ≈ "Lionel Andrés Messi") |
| **SequenceMatcher** | Python's difflib algorithm for fuzzy string matching, used in player mapping with 0.85 threshold |
| **Diacritics** | Accent marks on letters (é, ñ, ü). Normalized during fuzzy matching to avoid false negatives |
| **Cosine Similarity Matrix** | N×N precomputed matrix where entry (i,j) = similarity between player i and player j |
| **StandardScaler** | sklearn transformer that standardizes features by removing mean and scaling to unit variance |
| **lru_cache** | Python decorator that caches function results. Used to lazy-load the ML engine on first request |
| **__NEXT_DATA__** | JSON payload embedded in Next.js SSR pages. FotMob uses Next.js — we scrape this tag for match data |
| **X-Fm-Req** | FotMob's authentication header for some API endpoints. We avoid these endpoints entirely |
| **Cold Start** | When a free-tier service (Render) hasn't received traffic in 15+ minutes, it shuts down. First request triggers a ~30s restart |
| **CORS** | Cross-Origin Resource Sharing. Backend must explicitly allow frontend domain to make API requests |
| **PaginatedResponse** | API response format: `{ items: [...], total: N, limit: N, offset: N }` for paginated list endpoints |
| **Skeleton Loading** | Showing placeholder shapes (shimmer rectangles) while data loads, instead of spinners |
| **Framer Motion** | React animation library. Provides `motion.div`, `AnimatePresence`, `whileInView`, `staggerChildren` |
| **Basement Grotesque** | Display font used for hero titles. Self-hosted WOFF2 (24KB). SIL Open Font License |

---

## 12. Design Philosophy

### "Data as Drama"

The design philosophy treats data as something dramatic — every element communicates data becoming insight.

### Color System

- **Pitch black backgrounds** (#050505–#0A0A0A) — not blue-gray, not dark gray. The darkest possible black.
- **Emerald green** (#00D68F) as primary accent — used sparingly for emphasis, ratings, highlights
- **White** as secondary — text, borders, subtle elements
- **Light as a design element** — shadows, rim lighting, glow, transparency, layering

### Typography Hierarchy

1. **Basement Grotesque** — Hero titles, section headers (bold, oversized, editorial)
2. **Inter 700** — Card titles, navigation
3. **Inter 500** — Body text, descriptions
4. **Inter 300** — Captions, metadata

### Card Design

Cards should feel like **precision-engineered hardware**:
- Ultra-thin borders (`rgba(255,255,255,0.06)`)
- Soft inner glow
- Top edge highlights
- Layered shadows
- Hover: smooth elevation + glow + refined transitions

### Motion

- **Scroll-triggered** — Elements animate in as they enter viewport (`whileInView`)
- **Staggered** — Children animate in sequence, not simultaneously
- **Spring physics** — Natural, not linear
- **No more than 8 concurrent slow animations** — SVG animate elements cause jank

---

## 13. Known Issues & Tradeoffs

### ML Model

| Issue | Status | Notes |
|-------|--------|-------|
| **Player coverage** | Resolved | 541 players with >= 45 min (from 1,155 mapped) |
| **Per-90 normalization** | Implemented | v2 uses per-90 rates, not raw totals |
| **Feature count** | Expanded | 48 features (up from 14) |
| **Goalkeeper comparison** | Acceptable | GK stats are zero for outfield players, cosine similarity handles this |

### Backend

| Issue | Status | Notes |
|-------|--------|-------|
| **Render cold starts** | Mitigated | UptimeRobot pings every 5 min |
| **API response time** | Acceptable | ~2s for paginated queries (Neon connection overhead) |
| **ETL ordering bug** | Fixed | Player stats sync now runs before player mapping |
| **Alembic migrations** | Workaround | Initial migration is empty; used `Base.metadata.create_all()` + `alembic stamp head` |

### Frontend

| Issue | Status | Notes |
|-------|--------|-------|
| **ESLint strictness** | Workaround | Used `classList.add/remove` instead of `useState`+`useEffect` for navbar |
| **SVG performance** | Kept | Limited to ~8 concurrent slow animations |
| **Font loading** | Self-hosted | Basement Grotesque WOFF2 in `public/fonts/` |
| **Null safety** | Handled | `player.xG?.toFixed(2) ?? "—"`, `venue.capacity` nullable |

### Data

| Issue | Status | Notes |
|-------|--------|-------|
| **FotMob API auth** | Avoided | Used `__NEXT_DATA__` SSR scraping instead |
| **FBref blocked** | Resolved | Switched to FotMob (equally comprehensive) |
| **Player mapping coverage** | 92.6% | 1,155/1,248 players mapped (unmapped = reserves with no stats) |
| **Match coverage** | 100% | All 102 matches have mapped FotMob IDs |

---

## 14. How to Run Locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (or Neon connection string)

### Backend

```bash
cd backend

# Create .env with DATABASE_URL
echo "DATABASE_URL=postgresql://user:pass@host/dbname" > .env

# Install dependencies
pip install -r requirements.txt

# Create tables (first time only)
python -c "from database.connection import engine; from orm import *; from sqlalchemy.orm import DeclarativeBase; DeclarativeBase.metadata.create_all(engine)"

# Run ETL (first time or to refresh data)
python -m src.main

# Train ML model (first time or after data changes)
python -c "
from database.connection import SessionLocal
from repositories.player_repository import PlayerRepository
from repositories.player_mapping_repository import PlayerMappingRepository
from repositories.player_match_stat_repository import PlayerMatchStatRepository
from ml.features.player_feature_builder import PlayerFeatureBuilder
from ml.preprocessing.player_scaler import PlayerScaler
from ml.training.player_similarity_trainer import PlayerSimilarityTrainer
session = SessionLocal()
fb = PlayerFeatureBuilder(PlayerRepository(session), PlayerMappingRepository(session), PlayerMatchStatRepository(session))
ps = PlayerScaler()
PlayerSimilarityTrainer(fb, ps).train()
session.close()
"

# Start API server
python -m uvicorn src.app:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Create .env
echo "VITE_API_URL=http://127.0.0.1:8000" > .env

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173`

---

## 15. How to Retrain the ML Model

### When to Retrain

- After adding new match data (new matches scraped)
- After new player mappings (more players linked)
- After changing features (adding/removing stat columns)
- After upgrading pandas/numpy/sklearn (version mismatch breaks `.pkl` files)

### Commands

```bash
cd backend

# Retrain
python -c "
from database.connection import SessionLocal
from repositories.player_repository import PlayerRepository
from repositories.player_mapping_repository import PlayerMappingRepository
from repositories.player_match_stat_repository import PlayerMatchStatRepository
from ml.features.player_feature_builder import PlayerFeatureBuilder
from ml.preprocessing.player_scaler import PlayerScaler
from ml.training.player_similarity_trainer import PlayerSimilarityTrainer
session = SessionLocal()
fb = PlayerFeatureBuilder(PlayerRepository(session), PlayerMappingRepository(session), PlayerMatchStatRepository(session))
ps = PlayerScaler()
PlayerSimilarityTrainer(fb, ps).train()
session.close()
"

# Verify
python -c "
import joblib
idx = joblib.load('src/ml/artifacts/player_index.pkl')
print(f'Players: {idx.shape[0]}')
from ml.inference.player_similarity_engine import PlayerSimilarityEngine
engine = PlayerSimilarityEngine()
for r in engine.get_similar_player(229397)[:5]:
    print(f'  {r[\"player_name\"]} — {r[\"similarity\"]:.4f}')
"

# Commit artifacts
git add src/ml/artifacts/
git commit -m "fix: retrain ML model with N player mappings"
git push origin main
```

### What Gets Retrained

| Artifact | What Changes |
|----------|-------------|
| `player_index.pkl` | Player lookup table (grows with more mapped players) |
| `player_scaler.pkl` | Fitted scaler (changes with new data distribution) |
| `player_similarity.pkl` | Similarity matrix (N×N, grows quadratically) |

---

<p align="center">
  <sub>pipelines over pages. signals over sentiment.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Ball_Knowledge-v3.0-00D68F?style=flat-square&labelColor=000" />
</p>
