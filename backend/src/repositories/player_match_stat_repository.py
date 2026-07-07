from sqlalchemy.orm import Session, aliased
from sqlalchemy import func
from orm.player_match_stat import PlayerMatchStatORM
from orm.match import MatchORM
from orm.team import TeamORM


class PlayerMatchStatRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert(self, stat: PlayerMatchStatORM) -> str:
        existing = (
            self.session.query(PlayerMatchStatORM)
            .filter(
                PlayerMatchStatORM.match_id == stat.match_id,
                PlayerMatchStatORM.team_id == stat.team_id,
                PlayerMatchStatORM.fotmob_player_id == stat.fotmob_player_id,
            )
            .first()
        )
        if existing is None:
            self.session.add(stat)
            result = "inserted"
        else:
            existing.player_name = stat.player_name
            existing.is_goalkeeper = stat.is_goalkeeper
            existing.is_home = stat.is_home
            existing.rating = stat.rating
            existing.minutes_played = stat.minutes_played
            existing.goals = stat.goals
            existing.assists = stat.assists
            existing.xG = stat.xG
            existing.xA = stat.xA
            existing.xG_non_penalty = stat.xG_non_penalty
            existing.xG_on_target_faced = stat.xG_on_target_faced
            existing.xG_on_target_variant = stat.xG_on_target_variant
            existing.xG_plus_xA = stat.xG_plus_xA
            existing.total_shots = stat.total_shots
            existing.shots_on_target = stat.shots_on_target
            existing.shots_off_target = stat.shots_off_target
            existing.shot_accuracy = stat.shot_accuracy
            existing.blocked_shots = stat.blocked_shots
            existing.shots_woodwork = stat.shots_woodwork
            existing.touches = stat.touches
            existing.touches_opposition_box = stat.touches_opposition_box
            existing.passes_into_final_third = stat.passes_into_final_third
            existing.accurate_passes = stat.accurate_passes
            existing.accurate_crosses = stat.accurate_crosses
            existing.long_balls_accurate = stat.long_balls_accurate
            existing.corners = stat.corners
            existing.dispossessed = stat.dispossessed
            existing.chances_created = stat.chances_created
            existing.big_chances_created = stat.big_chances_created
            existing.defensive_actions = stat.defensive_actions
            existing.tackles = stat.tackles
            existing.interceptions = stat.interceptions
            existing.clearances = stat.clearances
            existing.headed_clearances = stat.headed_clearances
            existing.recoveries = stat.recoveries
            existing.duels_won = stat.duels_won
            existing.duels_lost = stat.duels_lost
            existing.ground_duels_won = stat.ground_duels_won
            existing.aerials_won = stat.aerials_won
            existing.dribbles_succeeded = stat.dribbles_succeeded
            existing.fouls = stat.fouls
            existing.was_fouled = stat.was_fouled
            existing.offsides = stat.offsides
            existing.dribbled_past = stat.dribbled_past
            existing.saves = stat.saves
            existing.saves_inside_box = stat.saves_inside_box
            existing.goals_conceded = stat.goals_conceded
            existing.goals_prevented = stat.goals_prevented
            existing.keeper_diving_saves = stat.keeper_diving_saves
            existing.keeper_high_claims = stat.keeper_high_claims
            existing.keeper_sweeper_actions = stat.keeper_sweeper_actions
            existing.punches = stat.punches
            existing.errors_led_to_goal = stat.errors_led_to_goal
            existing.player_throws = stat.player_throws
            result = "updated"
        self.session.commit()
        return result

    def count(self) -> int:
        return self.session.query(PlayerMatchStatORM).count()

    def get_by_match_id(self, match_id: int) -> list[PlayerMatchStatORM]:
        return (
            self.session.query(PlayerMatchStatORM)
            .filter(PlayerMatchStatORM.match_id == match_id)
            .all()
        )

    def get_by_team_id(self, team_id: int) -> list[PlayerMatchStatORM]:
        return (
            self.session.query(PlayerMatchStatORM)
            .filter(PlayerMatchStatORM.team_id == team_id)
            .all()
        )

    def get_by_player_ids(self, player_ids: list[int]) -> list[PlayerMatchStatORM]:
        return (
            self.session.query(PlayerMatchStatORM)
            .filter(PlayerMatchStatORM.fotmob_player_id.in_(player_ids))
            .all()
        )

    def get_all(self):
        return self.session.query(PlayerMatchStatORM).all()

    def get_by_fotmob_player_id(
        self, fotmob_player_id: int
    ) -> list[PlayerMatchStatORM]:
        return (
            self.session.query(PlayerMatchStatORM)
            .filter(PlayerMatchStatORM.fotmob_player_id == fotmob_player_id)
            .all()
        )

    def get_player_match_history(
        self, fotmob_player_id: int
    ) -> list[tuple[PlayerMatchStatORM, MatchORM, TeamORM, TeamORM]]:
        HomeTeam = aliased(TeamORM)
        AwayTeam = aliased(TeamORM)
        return (
            self.session.query(PlayerMatchStatORM, MatchORM, HomeTeam, AwayTeam)
            .join(MatchORM, PlayerMatchStatORM.match_id == MatchORM.id)
            .join(HomeTeam, MatchORM.home_team_id == HomeTeam.id)
            .join(AwayTeam, MatchORM.away_team_id == AwayTeam.id)
            .filter(PlayerMatchStatORM.fotmob_player_id == fotmob_player_id)
            .order_by(MatchORM.date.desc())
            .all()
        )
