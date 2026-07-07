from orm.match import MatchORM
from orm.team import TeamORM
from orm.venue import VenueORM
from orm.team_match_stat import TeamMatchStatORM
from orm.player_match_stat import PlayerMatchStatORM
from schemas.match import (
    MatchCardResponse,
    MatchDetailResponse,
    TeamStatResponse,
    PlayerStatInMatch,
)


def match_orm_to_card(
    match: MatchORM, home: TeamORM, away: TeamORM
) -> MatchCardResponse:
    score = None
    if match.home_score is not None and match.away_score is not None:
        score = f"{match.home_score} - {match.away_score}"
    return MatchCardResponse(
        id=match.id,
        home=home.name,
        away=away.name,
        score=score,
        date=match.date,
        stage=match.stage,
    )


def _team_stat_to_response(
    stat: TeamMatchStatORM | None, team_name: str
) -> TeamStatResponse | None:
    if stat is None:
        return None
    return TeamStatResponse(
        team_id=stat.team_id,
        team_name=team_name,
        ball_possession=stat.ball_possession,
        expected_goals=stat.expected_goals,
        total_shots=stat.total_shots,
        shots_on_target=stat.shots_on_target,
        passes=stat.passes,
        corners=stat.corners,
        fouls=stat.fouls,
        tackles=stat.tackles,
        interceptions=stat.interceptions,
        saves=stat.keeper_saves,
        yellow_cards=stat.yellow_cards,
        red_cards=stat.red_cards,
    )


def _player_stat_to_response(stat: PlayerMatchStatORM) -> PlayerStatInMatch:
    return PlayerStatInMatch(
        player_name=stat.player_name,
        is_goalkeeper=stat.is_goalkeeper,
        rating=stat.rating,
        minutes_played=stat.minutes_played,
        goals=stat.goals,
        assists=stat.assists,
        xG=stat.xG,
        xA=stat.xA,
        total_shots=stat.total_shots,
        shots_on_target=stat.shots_on_target,
        touches=stat.touches,
        passes=stat.accurate_passes,
        tackles=stat.tackles,
        interceptions=stat.interceptions,
        duels_won=stat.duels_won,
        saves=stat.saves,
    )


def match_orm_to_detail(
    match: MatchORM,
    home: TeamORM,
    away: TeamORM,
    venue: VenueORM | None,
    home_stat: TeamMatchStatORM | None,
    away_stat: TeamMatchStatORM | None,
    player_stats: list[PlayerMatchStatORM],
) -> MatchDetailResponse:
    return MatchDetailResponse(
        id=match.id,
        home_team=home.name,
        away_team=away.name,
        home_score=match.home_score,
        away_score=match.away_score,
        venue=venue.name if venue else None,
        stage=match.stage,
        attendance=match.attendance,
        date=match.date,
        home_team_stats=_team_stat_to_response(home_stat, home.name),
        away_team_stats=_team_stat_to_response(away_stat, away.name),
        player_stats=[_player_stat_to_response(s) for s in player_stats],
    )
