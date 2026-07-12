export interface TeamCard {
    id: number;
    name: string;
    code: string;
}

export interface PaginatedTeams {
    items: TeamCard[];
    total: number;
    limit: number;
    offset: number;
}

export interface TeamDetail {
    id: number;
    name: string;
    code: string;
    continent: string;
    confederation: string;
    flag_url: string;
    current_stage: string;
}
