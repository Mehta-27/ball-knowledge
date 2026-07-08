import axios from "axios";
import type { PlayerCard, PlayerDetail } from "../types/players";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

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