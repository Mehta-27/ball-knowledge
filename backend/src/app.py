from fastapi import FastAPI
from routes.teams import router as team_router
from routes.players import router as player_router
from routes.matches import router as match_router
from routes.standings import router as standing_router
from routes.venues import router as venue_router
from routes.groups import router as group_router
from routes.stages import router as stage_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Ball Knowledge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(team_router)
app.include_router(player_router)
app.include_router(match_router)
app.include_router(standing_router)
app.include_router(venue_router)
app.include_router(group_router)
app.include_router(stage_router)
