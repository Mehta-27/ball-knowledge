import axios from "axios";
import type { MatchCard, MatchDetail } from "../types/matches";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export async function getMatches(): Promise<MatchCard[]> {
    const response = await API.get("/matches");
    return response.data;
}

export async function getMatch(id: string): Promise<MatchDetail> {
    const response = await API.get(`/matches/${id}`);
    return response.data;
}
