from models.match import Match
from orm.match import MatchORM


def match_to_orm(match: Match) -> MatchORM:
    return MatchORM(
        id=match.id,
        home_team_id=match.home_team_id,
        away_team_id=match.away_team_id,
        date=match.date,
        season_id=match.season_id,
        competition_id=match.competition_id,
        home_score=match.home_score,
        away_score=match.away_score,
        home_tactics=match.home_tactics,
        away_tactics=match.away_tactics,
        venue_id=match.venue_id,
        group_id=match.group_id,
        stage_id=match.stage_id,
        group=match.group,
        stage=match.stage,
        attendance=match.attendance,
        local_date=match.local_date,
    )
