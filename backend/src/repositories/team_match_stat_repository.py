from sqlalchemy.orm import Session
from orm.team_match_stat import TeamMatchStatORM


class TeamMatchStatRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert(self, stat: TeamMatchStatORM) -> str:
        existing = (
            self.session.query(TeamMatchStatORM)
            .filter(
                TeamMatchStatORM.match_id == stat.match_id,
                TeamMatchStatORM.team_id == stat.team_id,
            )
            .first()
        )
        if existing is None:
            self.session.add(stat)
            result = "inserted"
        else:
            existing.fotmob_match_id = stat.fotmob_match_id
            existing.is_home = stat.is_home
            existing.ball_possession = stat.ball_possession
            existing.expected_goals = stat.expected_goals
            existing.total_shots = stat.total_shots
            existing.shots_on_target = stat.shots_on_target
            existing.touches_opposition_box = stat.touches_opposition_box
            existing.big_chances = stat.big_chances
            existing.big_chances_missed = stat.big_chances_missed
            existing.accurate_passes = stat.accurate_passes
            existing.yellow_cards = stat.yellow_cards
            existing.corners = stat.corners
            existing.shots_off_target = stat.shots_off_target
            existing.blocked_shots = stat.blocked_shots
            existing.shots_woodwork = stat.shots_woodwork
            existing.shots_inside_box = stat.shots_inside_box
            existing.shots_outside_box = stat.shots_outside_box
            existing.expected_goals_open_play = stat.expected_goals_open_play
            existing.expected_goals_set_play = stat.expected_goals_set_play
            existing.expected_goals_non_penalty = stat.expected_goals_non_penalty
            existing.expected_goals_on_target = stat.expected_goals_on_target
            existing.passes = stat.passes
            existing.own_half_passes = stat.own_half_passes
            existing.opposition_half_passes = stat.opposition_half_passes
            existing.long_balls_accurate = stat.long_balls_accurate
            existing.accurate_crosses = stat.accurate_crosses
            existing.player_throws = stat.player_throws
            existing.offsides = stat.offsides
            existing.tackles = stat.tackles
            existing.interceptions = stat.interceptions
            existing.shot_blocks = stat.shot_blocks
            existing.clearances = stat.clearances
            existing.keeper_saves = stat.keeper_saves
            existing.duels_won = stat.duels_won
            existing.ground_duels_won = stat.ground_duels_won
            existing.aerials_won = stat.aerials_won
            existing.dribbles_succeeded = stat.dribbles_succeeded
            existing.red_cards = stat.red_cards
            existing.fouls = stat.fouls
            result = "updated"
        self.session.commit()
        return result

    def count(self) -> int:
        return self.session.query(TeamMatchStatORM).count()

    def get_by_team_id(self, team_id: int) -> list[TeamMatchStatORM]:
        return (
            self.session.query(TeamMatchStatORM)
            .filter(TeamMatchStatORM.team_id == team_id)
            .all()
        )

    def get_by_match_id(self, match_id: int) -> list[TeamMatchStatORM]:
        return (
            self.session.query(TeamMatchStatORM)
            .filter(TeamMatchStatORM.match_id == match_id)
            .all()
        )
