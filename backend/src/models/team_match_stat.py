from pydantic import BaseModel


STAT_KEY_MAP: dict[str, str] = {
    "BallPossesion": "ball_possession",
    "expected_goals": "expected_goals",
    "total_shots": "total_shots",
    "ShotsOnTarget": "shots_on_target",
    "touches_opp_box": "touches_opposition_box",
    "big_chance": "big_chances",
    "big_chance_missed_title": "big_chances_missed",
    "accurate_passes": "accurate_passes",
    "yellow_cards": "yellow_cards",
    "corners": "corners",
    "ShotsOffTarget": "shots_off_target",
    "blocked_shots": "blocked_shots",
    "shots_woodwork": "shots_woodwork",
    "shots_inside_box": "shots_inside_box",
    "shots_outside_box": "shots_outside_box",
    "expected_goals_open_play": "expected_goals_open_play",
    "expected_goals_set_play": "expected_goals_set_play",
    "expected_goals_non_penalty": "expected_goals_non_penalty",
    "expected_goals_on_target": "expected_goals_on_target",
    "passes": "passes",
    "own_half_passes": "own_half_passes",
    "opposition_half_passes": "opposition_half_passes",
    "long_balls_accurate": "long_balls_accurate",
    "accurate_crosses": "accurate_crosses",
    "player_throws": "player_throws",
    "Offsides": "offsides",
    "matchstats.headers.tackles": "tackles",
    "interceptions": "interceptions",
    "shot_blocks": "shot_blocks",
    "clearances": "clearances",
    "keeper_saves": "keeper_saves",
    "duel_won": "duels_won",
    "ground_duels_won": "ground_duels_won",
    "aerials_won": "aerials_won",
    "dribbles_succeeded": "dribbles_succeeded",
    "red_cards": "red_cards",
    "fouls": "fouls",
}

STRING_COLUMNS: set[str] = {
    "accurate_passes",
    "long_balls_accurate",
    "accurate_crosses",
    "ground_duels_won",
    "aerials_won",
    "dribbles_succeeded",
}

NUMERIC_COLUMNS: set[str] = set(STAT_KEY_MAP.values()) - STRING_COLUMNS


class TeamMatchStat(BaseModel):
    id: int | None = None
    match_id: int
    fotmob_match_id: int
    team_id: int
    is_home: bool

    ball_possession: float | None = None
    expected_goals: float | None = None
    total_shots: float | None = None
    shots_on_target: float | None = None
    touches_opposition_box: float | None = None
    big_chances: float | None = None
    big_chances_missed: float | None = None
    accurate_passes: str | None = None
    yellow_cards: float | None = None
    corners: float | None = None
    shots_off_target: float | None = None
    blocked_shots: float | None = None
    shots_woodwork: float | None = None
    shots_inside_box: float | None = None
    shots_outside_box: float | None = None
    expected_goals_open_play: float | None = None
    expected_goals_set_play: float | None = None
    expected_goals_non_penalty: float | None = None
    expected_goals_on_target: float | None = None
    passes: float | None = None
    own_half_passes: float | None = None
    opposition_half_passes: float | None = None
    long_balls_accurate: str | None = None
    accurate_crosses: str | None = None
    player_throws: float | None = None
    offsides: float | None = None
    tackles: float | None = None
    interceptions: float | None = None
    shot_blocks: float | None = None
    clearances: float | None = None
    keeper_saves: float | None = None
    duels_won: float | None = None
    ground_duels_won: str | None = None
    aerials_won: str | None = None
    dribbles_succeeded: str | None = None
    red_cards: float | None = None
    fouls: float | None = None
