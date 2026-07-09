export interface Standing {
    group: string;
    position: number;
    team: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    points: number;
}

export interface StandingGroup {
    group: string;
    standings: Standing[];
}
