export interface MatchCard {
    id: number;
    home: string;
    away: string;
    score: string | null;
    date: string;
    stage: string | null;
}

export interface TeamStatResponse {
    team_id: number
    team_name: string;
    ball_possession: number;
    expected_goals: number;
    total_shots: number;
    shots_on_target: number;
    passes: number;
    corners: number;
    fouls: number;
    tackles: number;
    interceptions: number;
    saves: number;
    yellow_cards: number;
    red_cards: number;
}

export interface PlayerStatInMatch {
    player_name: string;
    is_goalkeeper: boolean
    rating: number
    minutes_played: number;
    goals: number
    assists: number
    xG: number;
    xA: number;
    total_shots: number;
    shots_on_target: number;
    touches: number;
    passes: number;
    tackles: number;
    interceptions: number;
    duels_won: number;
    saves: number;
}


export interface MatchDetail {
    id: number
    home_team: string;
    away_team: string;
    home_score: number
    away_score: number
    venue: string | null
    stage: string | null
    attendance: number | null
    date: string
    home_team_stats: TeamStatResponse | null
    away_team_stats: TeamStatResponse | null
    player_stats: PlayerStatInMatch[]
}