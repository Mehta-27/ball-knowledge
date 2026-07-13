import axios from "axios";
import type { PlayerCard, PlayerDetail, PaginatedPlayers } from "../types/players";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export async function getPaginatedPlayers(
    limit = 24,
    offset = 0,
    search?: string,
): Promise<PaginatedPlayers> {
    const params: Record<string, string | number> = { limit, offset };
    if (search) params.search = search;
    const response = await API.get("/players", { params });
    return response.data;
}

export async function getPlayers(): Promise<PlayerCard[]> {
    const response = await API.get("/players");
    return response.data;
}

export async function getPlayer(id: string): Promise<PlayerDetail> {
    const response = await API.get(`/players/${id}`);
    return response.data;
}

export async function getSimilarPlayers(id: string) {
    const response = await API.get(`/players/${id}/similar`);
    return response.data;
}

export async function searchPlayers(query: string): Promise<PlayerCard[]> {
    const response = await API.get("/players/search", {
        params: {
            q: query,
        },
    });

    return response.data;
}

export async function resolvePlayerIds(
    fotmobIds: number[],
): Promise<Record<string, number>> {
    const response = await API.get("/players/resolve", {
        params: { fotmob_ids: fotmobIds.join(",") },
    });
    return response.data;
}
