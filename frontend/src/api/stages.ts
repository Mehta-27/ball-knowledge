import axios from "axios";
import type { StageCard, StageDetail } from "../types/stages";
import type { MatchCard } from "../types/matches";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export async function getStages(): Promise<StageCard[]> {
    const response = await API.get("/stages");
    return response.data;
}

export async function getStage(id: string): Promise<StageDetail> {
    const response = await API.get(`/stages/${id}`);
    return response.data;
}

export async function getStageMatches(stageId: string): Promise<MatchCard[]> {
    const response = await API.get(`/stages/${stageId}/matches`);
    return response.data;
}
