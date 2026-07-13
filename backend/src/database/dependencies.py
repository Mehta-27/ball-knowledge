from sqlalchemy.orm import Session
from .connection import SessionLocal
from repositories.team_repository import TeamRepository
from repositories.player_repository import PlayerRepository
from repositories.match_repository import MatchRepository
from repositories.venue_repository import VenueRepository
from repositories.stage_repository import StageRepository
from repositories.group_repository import GroupRepository
from repositories.standing_repository import StandingRepository
from repositories.team_match_stat_repository import TeamMatchStatRepository
from repositories.player_match_stat_repository import PlayerMatchStatRepository
from repositories.player_mapping_repository import PlayerMappingRepository
from fastapi import Depends


def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def get_team_repository(db: Session = Depends(get_db)):
    return TeamRepository(db)


def get_player_repository(db: Session = Depends(get_db)):
    return PlayerRepository(db)


def get_match_repository(db: Session = Depends(get_db)):
    return MatchRepository(db)


def get_venue_repository(db: Session = Depends(get_db)):
    return VenueRepository(db)


def get_stage_repository(db: Session = Depends(get_db)):
    return StageRepository(db)


def get_group_repository(db: Session = Depends(get_db)):
    return GroupRepository(db)


def get_standing_repository(db: Session = Depends(get_db)):
    return StandingRepository(db)


def get_team_match_stat_repository(db: Session = Depends(get_db)):
    return TeamMatchStatRepository(db)


def get_player_match_stat_repository(db: Session = Depends(get_db)):
    return PlayerMatchStatRepository(db)


def get_player_mapping_repository(db: Session = Depends(get_db)):
    return PlayerMappingRepository(db)
