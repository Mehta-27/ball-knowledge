import axios from "axios";
import type { TeamCard } from "../types/teams";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

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
