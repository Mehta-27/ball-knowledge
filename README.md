<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=28&duration=2000&pause=800&color=00E676&center=true&vCenter=true&width=435&lines=BALL+KNOWLEDGE;DATA+PIPELINES;ETL+%2B+ML" alt="typing svg" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/pandas-150458?style=for-the-badge&logo=pandas&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/SQLAlchemy-100000?style=for-the-badge&logo=python&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=00E676&labelColor=000" />
</p>

---

<p align="center">
  <b><i>data doesn't have a favourite team.</i></b>
</p>

---

this is a data engineering & ML project dressed as a product.

the core work is **building pipelines** — scraping heterogeneous sources (FIFA API, FotMob), transforming raw match/player/team data into structured schemas, storing it in PostgreSQL, and running ML on top. the UI exists because a product needs a face, not because the stack needed another frontend.

---

## what this actually is

```
┌─────────────────────────────────────────────────┐
│                   SCRAPERS                       │
│  FIFA API → httpx    FotMob → BeautifulSoup      │
└────────────────────┬────────────────────────────┘
                     │ raw data
                     ▼
┌─────────────────────────────────────────────────┐
│               SYNC SERVICES (ETL)                │
│  11 pipelines: extract → map → upsert            │
│  teams → players → venues → stages → groups     │
│  → matches → standings → mappings → stats        │
└────────────────────┬────────────────────────────┘
                     │ structured ORM models
                     ▼
┌─────────────────────────────────────────────────┐
│              FEATURE ENGINEERING                 │
│  player features: minutes, goals, xG, xA,       │
│  shots, passes, tackles, pressures, dribbles...  │
│  → pandas DataFrames → feature vectors           │
└────────────────────┬────────────────────────────┘
                     │ feature space
                     ▼
┌─────────────────────────────────────────────────┐
│                    ML MODULE                     │
│  similarity engine  │  clustering  │  inference  │
│  cosine-similarity  │  k-means     │  pipelines  │
│  on player vectors  │  DBSCAN      │  prediction │
└────────────────────┬────────────────────────────┘
                     │ served via API
                     ▼
┌─────────────────────────────────────────────────┐
│              FASTAPI LAYER (33 endpoints)        │
│  /teams  /players  /matches  /standings          │
│  /stages  /groups  /venues                      │
└────────────────────┬────────────────────────────┘
                     │ JSON
                     ▼
┌─────────────────────────────────────────────────┐
│              REACT UI (product face)             │
│  React 19 · Vite · Tailwind v4 · TanStack Query │
└─────────────────────────────────────────────────┘
```

## etl pipelines

11 sync services that run sequentially. each one extracts from either the FIFA API or FotMob, maps raw JSON into domain models, and upserts into PostgreSQL.

```bash
python -m src.main    # runs all 11 pipelines
```

| pipeline | source | output |
|----------|--------|--------|
| teams | FIFA API | team records |
| players | FIFA API | player records |
| venues | FIFA API | venue records |
| stages | FIFA API | competition stages |
| groups | FIFA API | group tables |
| matches | FIFA API | match fixtures + results |
| standings | computed | derived standings |
| fotmob mappings | FotMob | cross-ID mapping table |
| player mappings | internal | FIFA↔FotMob player links |
| team match stats | FotMob | per-match team statistics |
| player match stats | FotMob | per-match player statistics |

## ml layer

```
features/     — player_feature_builder.py : aggregates match stats into
                feature vectors (goals, xG, xA, passes, pressures, etc.)
similarity/   — cosine-similarity engine : "find me players like this one"
clustering/   — k-means, DBSCAN over player/team vectors
training/     — model training workflows
inference/    — prediction serving
```

the similarity engine is operational (used in the player detail view). clustering and training modules are structured for expansion.

## why a ui then

the UI isn't the point — it's the **proof**. data pipelines and ML models don't mean much if nobody can interact with them. the frontend exists to make the backend tangible: browse teams, inspect players, see who's similar, watch the predictions render. it's a product skin over an engineering skeleton.

## stack (it's a means, not the end)

| layer | what |
|-------|------|
| scraping | httpx, BeautifulSoup, lxml |
| ETL | custom sync services, SQLAlchemy, Alembic |
| storage | PostgreSQL |
| feature engineering | pandas |
| ML | scikit-learn (cosine similarity, clustering) |
| API | FastAPI (33 endpoints) |
| frontend | React 19, Vite, Tailwind CSS v4, TanStack Query |

## routes

```
GET  /teams         — paginated team list
GET  /teams/:id     — team detail + squad + recent matches
GET  /players       — paginated player list
GET  /players/:id   — player detail + similar players
GET  /matches       — match list (filter by team/stage/group)
GET  /matches/:id   — match detail + team/player stats
GET  /standings     — standings by stage/group
GET  /stages        — competition stages
GET  /groups        — group stage groups
GET  /venues        — venues
```

---

<p align="center">
  <sub>pipelines over pages. signals over sentiment.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/aura-data_gravity-00E676?style=flat-square&labelColor=000" />
  <img src="https://img.shields.io/badge/vibe-engineer-00E676?style=flat-square&labelColor=000" />
</p>
