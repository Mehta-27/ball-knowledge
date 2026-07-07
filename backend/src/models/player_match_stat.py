from pydantic import BaseModel, field_validator


PLAYER_STAT_KEY_MAP: dict[str, str] = {
    "rating_title": "rating",
    "minutes_played": "minutes_played",
    "goals": "goals",
    "assists": "assists",
    "expected_goals": "xG",
    "expected_assists": "xA",
    "expected_goals_non_penalty": "xG_non_penalty",
    "expected_goals_on_target_faced": "xG_on_target_faced",
    "expected_goals_on_target_variant": "xG_on_target_variant",
    "xg_and_xa": "xG_plus_xA",
    "total_shots": "total_shots",
    "ShotsOnTarget": "shots_on_target",
    "ShotsOffTarget": "shots_off_target",
    "shot_accuracy": "shot_accuracy",
    "blocked_shots": "blocked_shots",
    "shots_woodwork": "shots_woodwork",
    "touches": "touches",
    "touches_opp_box": "touches_opposition_box",
    "passes_into_final_third": "passes_into_final_third",
    "accurate_passes": "accurate_passes",
    "accurate_crosses": "accurate_crosses",
    "long_balls_accurate": "long_balls_accurate",
    "corners": "corners",
    "dispossessed": "dispossessed",
    "chances_created": "chances_created",
    "big_chance_created_team_title": "big_chances_created",
    "defensive_actions": "defensive_actions",
    "matchstats.headers.tackles": "tackles",
    "interceptions": "interceptions",
    "clearances": "clearances",
    "headed_clearance": "headed_clearances",
    "recoveries": "recoveries",
    "duel_won": "duels_won",
    "duel_lost": "duels_lost",
    "ground_duels_won": "ground_duels_won",
    "aerials_won": "aerials_won",
    "dribbles_succeeded": "dribbles_succeeded",
    "fouls": "fouls",
    "was_fouled": "was_fouled",
    "Offsides": "offsides",
    "dribbled_past": "dribbled_past",
    "saves": "saves",
    "saves_inside_box": "saves_inside_box",
    "goals_conceded": "goals_conceded",
    "goals_prevented": "goals_prevented",
    "keeper_diving_save": "keeper_diving_saves",
    "keeper_high_claim": "keeper_high_claims",
    "keeper_sweeper": "keeper_sweeper_actions",
    "punches": "punches",
    "errors_led_to_goal": "errors_led_to_goal",
    "player_throws": "player_throws",
    "shot_blocks": "shot_blocks",
}


class PlayerMatchStat(BaseModel):
    id: int | None = None
    match_id: int
    fotmob_match_id: int
    team_id: int
    fotmob_player_id: int
    player_name: str
    is_goalkeeper: bool
    is_home: bool

    rating: float | None = None
    minutes_played: float | None = None
    goals: float | None = None
    assists: float | None = None
    xG: float | None = None
    xA: float | None = None
    xG_non_penalty: float | None = None
    xG_on_target_faced: float | None = None
    xG_on_target_variant: float | None = None
    xG_plus_xA: float | None = None
    total_shots: float | None = None
    shots_on_target: float | None = None
    shots_off_target: float | None = None
    shot_accuracy: float | None = None
    blocked_shots: float | None = None
    shots_woodwork: float | None = None
    touches: float | None = None
    touches_opposition_box: float | None = None
    passes_into_final_third: float | None = None
    accurate_passes: float | None = None
    accurate_crosses: float | None = None
    long_balls_accurate: float | None = None
    corners: float | None = None
    dispossessed: float | None = None
    chances_created: float | None = None
    big_chances_created: float | None = None
    defensive_actions: float | None = None
    tackles: float | None = None
    interceptions: float | None = None
    clearances: float | None = None
    headed_clearances: float | None = None
    recoveries: float | None = None
    duels_won: float | None = None
    duels_lost: float | None = None
    ground_duels_won: float | None = None
    aerials_won: float | None = None
    dribbles_succeeded: float | None = None
    fouls: float | None = None
    was_fouled: float | None = None
    offsides: float | None = None
    dribbled_past: float | None = None
    saves: float | None = None
    saves_inside_box: float | None = None
    goals_conceded: float | None = None
    goals_prevented: float | None = None
    keeper_diving_saves: float | None = None
    keeper_high_claims: float | None = None
    keeper_sweeper_actions: float | None = None
    punches: float | None = None
    errors_led_to_goal: float | None = None
    player_throws: float | None = None

    @field_validator("minutes_played", mode="after")
    @classmethod
    def default_minutes(cls, v: float | None) -> float:
        return v if v is not None else 0.0
