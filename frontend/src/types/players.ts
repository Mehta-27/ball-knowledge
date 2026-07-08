export interface PlayerCard {
    id: number;
    name: string;
    picture_url: string | null;
    jersey_number: number;
    position: string;
}

export interface PlayerStatSummary {
    matches: number;
    starts: number;
    minutes: number;
    goals: number;
    assists: number;
    xG: number;
    xA: number;
    shots: number;
    shots_on_target: number;
    passes: number;
    touches: number;
    tackles: number;
    interceptions: number;
    duels_won: number;
    saves: number;
    clean_sheets: number;
    rating: number;
}

export interface PlayerDetail {
    id: number;
    name: string;
    picture_url: string | null;
    jersey_number: number;
    country: string;
    team: string;
    position: string;
    age: number;
    statistics: PlayerStatSummary;
}

export interface SimilarPlayer {
    player_id: number;
    player_name: string;
    team_id: number;
    position: string;
    similarity: number;
}