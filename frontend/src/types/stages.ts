export interface StageCard {
    id: number;
    name: string;
    type: string;
    order: number;
}

export interface StageDetail {
    id: number;
    name: string;
    type: string;
    order: number;
    season_id: number;
    start_date: string | null;
    end_date: string | null;
}
