from datetime import date
from orm.player import PlayerORM
from orm.team import TeamORM
from orm.player_match_stat import PlayerMatchStatORM
from schemas.player import PlayerCardResponse, PlayerDetailResponse, PlayerStatSummary


def _compute_age(birth_date) -> int:
    today = date.today()
    return (
        today.year
        - birth_date.year
        - ((today.month, today.day) < (birth_date.month, birth_date.day))
    )


def player_orm_to_card(player: PlayerORM) -> PlayerCardResponse:
    return PlayerCardResponse(
        id=player.id,
        name=player.name,
        picture_url=player.picture_url,
        jersey_number=player.jersey_number,
        position=player.position,
        age=_compute_age(player.birth_date),
    )


def player_orm_to_detail(
    player: PlayerORM,
    team: TeamORM,
    stats: list[PlayerMatchStatORM],
) -> PlayerDetailResponse:
    if not stats:
        return PlayerDetailResponse(
            id=player.id,
            name=player.name,
            picture_url=player.picture_url,
            jersey_number=player.jersey_number,
            country=player.country,
            team=team.name,
            position=player.position,
            age=_compute_age(player.birth_date),
            statistics=PlayerStatSummary(),
        )

    matches = len(stats)
    starts = sum(1 for s in stats if s.minutes_played and s.minutes_played > 0)
    minutes = sum(s.minutes_played or 0 for s in stats)
    goals = sum(s.goals or 0 for s in stats)
    assists = sum(s.assists or 0 for s in stats)
    xG = sum(s.xG or 0 for s in stats)
    xA = sum(s.xA or 0 for s in stats)
    shots = sum(s.total_shots or 0 for s in stats)
    shots_on_target = sum(s.shots_on_target or 0 for s in stats)
    passes = sum(s.accurate_passes or 0 for s in stats)
    touches = sum(s.touches or 0 for s in stats)
    tackles = sum(s.tackles or 0 for s in stats)
    interceptions = sum(s.interceptions or 0 for s in stats)
    duels_won = sum(s.duels_won or 0 for s in stats)
    saves = sum(s.saves or 0 for s in stats)
    clean_sheets = sum(
        1
        for s in stats
        if s.is_goalkeeper and s.goals_conceded is not None and s.goals_conceded == 0
    )

    ratings = [s.rating for s in stats if s.rating is not None]
    avg_rating = sum(ratings) / len(ratings) if ratings else None

    return PlayerDetailResponse(
        id=player.id,
        name=player.name,
        picture_url=player.picture_url,
        jersey_number=player.jersey_number,
        country=player.country,
        team=team.name,
        position=player.position,
        age=_compute_age(player.birth_date),
        statistics=PlayerStatSummary(
            matches=matches,
            starts=starts,
            minutes=round(minutes, 1),
            goals=goals,
            assists=assists,
            xG=round(xG, 2),
            xA=round(xA, 2),
            shots=shots,
            shots_on_target=shots_on_target,
            passes=passes,
            touches=touches,
            tackles=tackles,
            interceptions=interceptions,
            duels_won=duels_won,
            saves=saves,
            clean_sheets=clean_sheets,
            rating=round(avg_rating, 2) if avg_rating is not None else None,
        ),
    )
