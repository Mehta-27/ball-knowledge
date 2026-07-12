<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=28&duration=2000&pause=800&color=00E676&center=true&vCenter=true&width=435&lines=BALL+KNOWLEDGE;FOOTBALL+INTELLIGENCE+PLATFORM" alt="typing svg" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/pandas-150458?style=for-the-badge&logo=pandas&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=00E676&labelColor=000" />
</p>

---

<p align="center">
  <b><i>data doesn't have a favourite team.</i></b>
</p>

---

## what this is

**Ball Knowledge** is a football intelligence platform built around a **player similarity engine**. The core problem it solves: given any player, find the most statistically similar players across the entire tournament — not by name or reputation, but by actual performance data.

The system works by:
1. **Scraping** match-level data from FIFA and FotMob
2. **Engineering features** from raw per-match statistics
3. **Training** a cosine similarity model over standardized feature vectors
4. **Serving** similarity queries via API, visualized through a web UI

---

## the ML pipeline

```
                    ┌──────────────────────────┐
                    │     RAW MATCH DATA        │
                    │  FIFA API + FotMob         │
                    │  (per-match player stats)  │
                    └────────────┬───────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    FEATURE ENGINEERING                          │
│  PlayerFeatureBuilder aggregates per-match stats into          │
│  tournament-level feature vectors:                             │
│                                                                │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────────────┐ │
│  │ Attacking    │ │ Possession   │ │ Defensive               │ │
│  │ goals        │ │ touches      │ │ tackles                 │ │
│  │ assists      │ │ acc_passes   │ │ interceptions           │ │
│  │ xG, xA       │ │              │ │ duels_won               │ │
│  │ shots        │ │              │ │                         │ │
│  │ shots_on_tgt │ │              │ │                         │ │
│  └─────────────┘ └──────────────┘ └─────────────────────────┘ │
│  ┌─────────────┐ ┌──────────────┐                              │
│  │ Carrying     │ │ Overall      │                              │
│  │ dribbles     │ │ rating       │                              │
│  └─────────────┘ └──────────────┘                              │
│                                                                │
│  14 numerical features per player                              │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                    PREPROCESSING                                │
│  StandardScaler (μ=0, σ=1)                                     │
│  → normalizes feature magnitudes                               │
│  → prevents dominance of high-variance features                │
│  → fitted on full player population                            │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                    SIMILARITY MODEL                             │
│                                                                │
│  cosine_similarity(V_i, V_j) = (V_i · V_j) / (‖V_i‖ ‖V_j‖)  │
│                                                                │
│  → full N×N similarity matrix (precomputed)                    │
│  → symmetric: sim(A,B) = sim(B,A)                             │
│  → range: [-1, 1], higher = more similar                      │
│  → stored as serialized numpy array                            │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                    INFERENCE                                    │
│  PlayerSimilarityEngine:                                       │
│  1. lookup player row in index                                 │
│  2. read similarity scores from matrix row                     │
│  3. sort descending, skip self-match                           │
│  4. return top 10 similar players with scores                  │
│                                                                │
│  latency: < 5ms (precomputed matrix, in-memory lookup)         │
└────────────────────────────────────────────────────────────────┘
```

---

## feature vector schema

| feature | category | description |
|---------|----------|-------------|
| `minutes_played` | time | total minutes across all matches |
| `goals` | attacking | goals scored |
| `assists` | attacking | assists made |
| `xg` | attacking | expected goals (xG) |
| `xa` | attacking | expected assists (xA) |
| `total_shots` | attacking | all shot attempts |
| `shots_on_target` | attacking | shots on target |
| `touches` | possession | ball touches |
| `accurate_passes` | possession | successful passes |
| `tackles` | defensive | tackles made |
| `interceptions` | defensive | interceptions made |
| `duels_won` | defensive | aerial + ground duels won |
| `dribbles_succeeded` | carrying | successful dribbles |
| `rating` | overall | average match rating |

---

## training & artifacts

```bash
# train the similarity model (builds features → scales → computes matrix)
python -m src.ml.training.player_similarity_trainer
```

produces three serialized artifacts:

| artifact | format | contents |
|----------|--------|----------|
| `player_index.pkl` | pandas DataFrame | player_id, name, team_id, position (lookup index) |
| `player_scaler.pkl` | sklearn StandardScaler | fitted scaler for feature normalization |
| `player_similarity.pkl` | numpy ndarray | precomputed N×N cosine similarity matrix |

---

## data collection

11 ETL pipelines extract from two sources and load into PostgreSQL:

| pipeline | source | method |
|----------|--------|--------|
| teams | FIFA API | httpx |
| players | FIFA API | httpx |
| venues | FIFA API | httpx |
| stages | FIFA API | httpx |
| groups | FIFA API | httpx |
| matches | FIFA API | httpx |
| standings | computed | derived from match results |
| fotmob mappings | FotMob | BeautifulSoup + lxml |
| player mappings | internal | FIFA↔FotMob cross-reference |
| team match stats | FotMob | BeautifulSoup |
| player match stats | FotMob | BeautifulSoup |

```bash
python -m src.main    # runs all 11 pipelines sequentially
```

---

## project structure

```
backend/
├── src/
│   ├── ml/
│   │   ├── features/          # feature engineering
│   │   │   ├── player_feature.py          # dataclass schema
│   │   │   └── player_feature_builder.py  # aggregation logic
│   │   ├── preprocessing/
│   │   │   └── player_scaler.py           # StandardScaler wrapper
│   │   ├── training/
│   │   │   └── player_similarity_trainer.py  # train pipeline
│   │   ├── inference/
│   │   │   └── player_similarity_engine.py   # serve queries
│   │   ├── similarity/
│   │   │   └── cosine_similarity.py       # similarity utilities
│   │   └── artifacts/         # serialized models (.pkl)
│   ├── scraper/               # data collection (FIFA + FotMob)
│   ├── services/              # ETL sync services (11 pipelines)
│   ├── repositories/          # database access layer
│   ├── routes/                # FastAPI endpoints (35 GET routes)
│   └── database/              # SQLAlchemy models + connection
frontend/
├── src/
│   ├── pages/                 # 15 pages (7 list + 7 detail + home)
│   ├── components/            # card components + layout
│   ├── api/                   # API client layer
│   └── types/                 # TypeScript interfaces
```

---

## API endpoints

| endpoint | description |
|----------|-------------|
| `GET /players` | paginated player list (search, limit, offset) |
| `GET /players/{id}` | player detail |
| `GET /players/{id}/similar` | **top 10 similar players** (ML-powered) |
| `GET /teams` | paginated team list |
| `GET /teams/{id}` | team detail |
| `GET /matches` | paginated match list (filter by team/stage/group) |
| `GET /matches/{id}` | match detail + team + player stats |
| `GET /standings` | full standings |
| `GET /standings/{group}` | standings filtered by group |
| `GET /stages` | competition stages |
| `GET /stages/{id}` | stage detail + matches |
| `GET /groups` | groups |
| `GET /groups/{id}` | group detail + standings + matches |
| `GET /venues` | paginated venue list |
| `GET /venues/{id}` | venue detail |

---

## tech stack

| layer | tools |
|-------|-------|
| data collection | httpx, BeautifulSoup, lxml |
| ETL | custom sync services, SQLAlchemy, Alembic |
| storage | PostgreSQL |
| feature engineering | pandas, dataclasses |
| ML | scikit-learn (StandardScaler, cosine_similarity) |
| model serialization | joblib |
| API | FastAPI, Pydantic |
| frontend | React 19, Vite, TypeScript, Framer Motion |

---

<p align="center">
  <sub>pipelines over pages. signals over sentiment.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/aura-data_gravity-00E676?style=flat-square&labelColor=000" />
  <img src="https://img.shields.io/badge/vibe-engineer-00E676?style=flat-square&labelColor=000" />
</p>
