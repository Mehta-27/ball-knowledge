import axios from "axios";
import type { TeamCard, TeamDetail, PaginatedTeams } from "../types/teams";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export async function getPaginatedTeams(
    limit = 24,
    offset = 0,
    search?: string,
): Promise<PaginatedTeams> {
    const params: Record<string, string | number> = { limit, offset };
    if (search) params.search = search;
    const response = await API.get("/teams", { params });
    return response.data;
}

export async function getTeams(): Promise<TeamCard[]> {
    const response = await API.get("/teams");
    return response.data;
}

export async function getTeam(id: string) {
    const response = await API.get(`/teams/${id}`);
    return response.data;
}

export async function searchTeams(query: string): Promise<TeamCard[]> {
    const response = await API.get("/teams/search", {
        params: { q: query },
    });
    return response.data;
}
