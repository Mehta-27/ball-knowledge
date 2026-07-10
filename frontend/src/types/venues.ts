export interface VenueCard {
    id: number;
    stadium: string;
    city: string;
    capacity: number | null;
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
