export interface VenueCard {
    id: number;
    stadium: string;
    city: string;
    capacity: number | null;
}

export interface PaginatedVenues {
    items: VenueCard[];
    total: number;
    limit: number;
    offset: number;
}

export interface VenueDetail {
    id: number;
    stadium: string;
    city: string;
    country: string;
    capacity: number | null;
    turf: string | null;
    roof: boolean | null;
    picture_url: string | null;
    matches_played: number;
}
