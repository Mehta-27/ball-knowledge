from dataclasses import dataclass


@dataclass
class PlayerFeature:
    # Identity
    player_id: int
    player_name: str
    team_id: int
    position: str

    # Playing Time
    minutes_played: float

    # Attacking
    goals: float
    assists: float
    xg: float
    xa: float
    total_shots: float
    shots_on_target: float

    # Possession
    touches: float
    accurate_passes: float

    # Defensive
    tackles: float
    interceptions: float
    duels_won: float

    # Ball Carrying
    dribbles_succeeded: float

    # Overall
    rating: float
