from database.connection import engine
from database.base import Base

from orm.team import TeamORM
from orm.player import PlayerORM
from orm.match import MatchORM
from orm.venue import VenueORM
from orm.stage import StageORM
from orm.group import GroupORM
from orm.standing import StandingORM
from orm.match_mapping import MatchMappingORM
from orm.team_match_stat import TeamMatchStatORM
from orm.player_match_stat import PlayerMatchStatORM
from orm.player_mapping import PlayerMappingORM

Base.metadata.create_all(bind=engine)
