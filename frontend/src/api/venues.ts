import axios from "axios";
import type { VenueCard, VenueDetail, PaginatedVenues } from "../types/venues";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export async function getPaginatedVenues(
    limit = 24,
    offset = 0,
    search?: string,
): Promise<PaginatedVenues> {
    const params: Record<string, string | number> = { limit, offset };
    if (search) params.search = search;
    const response = await API.get("/venues", { params });
    return response.data;
}

export async function getVenues(): Promise<VenueCard[]> {
    const response = await API.get("/venues");
    return response.data;
}

export async function getVenue(id: string): Promise<VenueDetail> {
    const response = await API.get(`/venues/${id}`);
    return response.data;
}

export async function searchVenues(query: string): Promise<VenueCard[]> {
    const response = await API.get("/venues/search", {
        params: { q: query },
    });
    return response.data;
}
