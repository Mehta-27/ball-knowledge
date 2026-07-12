import axios from "axios";
import type { MatchCard, MatchDetail, PaginatedMatches } from "../types/matches";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export async function getPaginatedMatches(
    limit = 24,
    offset = 0,
): Promise<PaginatedMatches> {
    const response = await API.get("/matches", { params: { limit, offset } });
    return response.data;
}

export async function getMatches(): Promise<MatchCard[]> {
    const response = await API.get("/matches");
    return response.data;
}

export async function getMatch(id: string): Promise<MatchDetail> {
    const response = await API.get(`/matches/${id}`);
    return response.data;
}
