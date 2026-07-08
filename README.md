<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=28&duration=2000&pause=800&color=00E676&center=true&vCenter=true&width=435&lines=BALL+KNOWLEDGE;FOOTBALL+INTELLIGENCE;DATA+%26+PREDICTION" alt="typing svg" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=00E676&labelColor=000" />
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=00E676&labelColor=000" />
</p>

---

<p align="center">
  <b><i>football doesn't lie. neither does the data.</i></b>
</p>

---

**ball-knowledge** is a full-stack football intelligence platform that scrapes, stores, and serves structured data from FIFA 2026 World Cup sources and FotMob. It exposes a REST API backed by PostgreSQL with 7 domain routers, syncs 30+ data pipelines, and runs ML models for player similarity, clustering, and performance inference.

---

## stack

| layer | tech |
|-------|------|
| API | FastAPI — 33 endpoints across 7 routers |
| frontend | React 19 + Vite + Tailwind CSS v4 + TanStack Query |
| database | PostgreSQL + SQLAlchemy + Alembic |
| scrapers | httpx, BeautifulSoup — FIFA API, FotMob |
| ML | scikit-learn — clustering, similarity engine, pipelines |
| viz | Recharts, Framer Motion |

## routes

```
GET  /teams         — list teams (paginated, filterable)
GET  /teams/:id     — team detail + squad + recent matches
GET  /players       — list players
GET  /players/:id   — player detail + similar players
GET  /matches       — list matches (filter by team/stage/group)
GET  /matches/:id   — match detail + stats
GET  /standings     — standings by stage/group
GET  /stages        — competition stages
GET  /groups        — group stage groups
GET  /venues        — venues
```

## ml modules

```
clustering/     — k-means, hierarchical, DBSCAN over player/team vectors
similarity/     — cosine-similarity engine for "similar players"
features/       — feature engineering pipelines
training/       — model training workflows
inference/      — prediction serving
```

## quick start

```bash
# backend
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -e .
uvicorn src.app:app --reload

# frontend
cd frontend
npm install
npm run dev
```

## sync pipeline

Run the full data sync to pull FIFA 2026 + FotMob data:

```bash
python -m src.main
```

This runs 11 sync services in sequence: teams → players → venues → stages → groups → matches → standings → FotMob mappings → player mappings → team stats → player stats.

---

<p align="center">
  <sub>built with the understanding that every pass, every shot, every game — is a signal.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/aura-dark_energy-00E676?style=flat-square&labelColor=000" />
  <img src="https://img.shields.io/badge/vibe-knowledge-00E676?style=flat-square&labelColor=000" />
</p>
