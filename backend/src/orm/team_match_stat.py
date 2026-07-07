from sqlalchemy import String, Integer, BigInteger, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base


class TeamMatchStatORM(Base):
    __tablename__ = "team_match_stats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    match_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    fotmob_match_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    team_id: Mapped[int] = mapped_column(Integer, nullable=False)
    is_home: Mapped[bool] = mapped_column(Boolean, nullable=False)

    ball_possession: Mapped[float | None] = mapped_column(Float, nullable=True)
    expected_goals: Mapped[float | None] = mapped_column(Float, nullable=True)
    total_shots: Mapped[float | None] = mapped_column(Float, nullable=True)
    shots_on_target: Mapped[float | None] = mapped_column(Float, nullable=True)
    touches_opposition_box: Mapped[float | None] = mapped_column(Float, nullable=True)
    big_chances: Mapped[float | None] = mapped_column(Float, nullable=True)
    big_chances_missed: Mapped[float | None] = mapped_column(Float, nullable=True)
    accurate_passes: Mapped[str | None] = mapped_column(String(30), nullable=True)
    yellow_cards: Mapped[float | None] = mapped_column(Float, nullable=True)
    corners: Mapped[float | None] = mapped_column(Float, nullable=True)
    shots_off_target: Mapped[float | None] = mapped_column(Float, nullable=True)
    blocked_shots: Mapped[float | None] = mapped_column(Float, nullable=True)
    shots_woodwork: Mapped[float | None] = mapped_column(Float, nullable=True)
    shots_inside_box: Mapped[float | None] = mapped_column(Float, nullable=True)
    shots_outside_box: Mapped[float | None] = mapped_column(Float, nullable=True)
    expected_goals_open_play: Mapped[float | None] = mapped_column(Float, nullable=True)
    expected_goals_set_play: Mapped[float | None] = mapped_column(Float, nullable=True)
    expected_goals_non_penalty: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )
    expected_goals_on_target: Mapped[float | None] = mapped_column(Float, nullable=True)
    passes: Mapped[float | None] = mapped_column(Float, nullable=True)
    own_half_passes: Mapped[float | None] = mapped_column(Float, nullable=True)
    opposition_half_passes: Mapped[float | None] = mapped_column(Float, nullable=True)
    long_balls_accurate: Mapped[str | None] = mapped_column(String(30), nullable=True)
    accurate_crosses: Mapped[str | None] = mapped_column(String(30), nullable=True)
    player_throws: Mapped[float | None] = mapped_column(Float, nullable=True)
    offsides: Mapped[float | None] = mapped_column(Float, nullable=True)
    tackles: Mapped[float | None] = mapped_column(Float, nullable=True)
    interceptions: Mapped[float | None] = mapped_column(Float, nullable=True)
    shot_blocks: Mapped[float | None] = mapped_column(Float, nullable=True)
    clearances: Mapped[float | None] = mapped_column(Float, nullable=True)
    keeper_saves: Mapped[float | None] = mapped_column(Float, nullable=True)
    duels_won: Mapped[float | None] = mapped_column(Float, nullable=True)
    ground_duels_won: Mapped[str | None] = mapped_column(String(30), nullable=True)
    aerials_won: Mapped[str | None] = mapped_column(String(30), nullable=True)
    dribbles_succeeded: Mapped[str | None] = mapped_column(String(30), nullable=True)
    red_cards: Mapped[float | None] = mapped_column(Float, nullable=True)
    fouls: Mapped[float | None] = mapped_column(Float, nullable=True)
