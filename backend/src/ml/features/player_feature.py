from dataclasses import dataclass


@dataclass
class PlayerFeature:
    # Identity
    player_id: int
    player_name: str
    team_id: int
    position: str

    # Volume
    minutes_played: float

    # Attacking
    goals: float
    assists: float
    xg: float
    xa: float
    xg_non_penalty: float
    xg_plus_xa: float
    total_shots: float
    shots_on_target: float
    shots_off_target: float
    shot_accuracy: float
    blocked_shots: float
    shots_woodwork: float

    # Possession / Passing
    touches: float
    touches_opposition_box: float
    accurate_passes: float
    accurate_crosses: float
    long_balls_accurate: float
    passes_into_final_third: float
    corners: float

    # Chance Creation
    chances_created: float
    big_chances_created: float

    # Defensive
    tackles: float
    interceptions: float
    defensive_actions: float
    clearances: float
    headed_clearances: float
    recoveries: float
    duels_won: float
    duels_lost: float
    ground_duels_won: float
    aerials_won: float

    # Ball Carrying
    dribbles_succeeded: float
    dribbled_past: float
    dispossessed: float
    was_fouled: float

    # Discipline
    fouls: float
    offsides: float
    errors_led_to_goal: float
    player_throws: float

    # Goalkeeper
    saves: float
    saves_inside_box: float
    goals_conceded: float
    goals_prevented: float
    keeper_diving_saves: float
    keeper_high_claims: float
    keeper_sweeper_actions: float
    punches: float
    xg_on_target_faced: float
    xg_on_target_variant: float

    # Rating
    rating: float
