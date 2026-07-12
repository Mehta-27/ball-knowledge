import axios from "axios";
import type { Standing, StandingGroup } from "../types/standings";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export async function getStandings(): Promise<StandingGroup[]> {
    const response = await API.get("/standings");
    return response.data;
}

export async function getStandingsByGroup(groupName: string): Promise<Standing[]> {
    const response = await API.get(`/standings/${groupName}`);
    return response.data;
}

export async function getStandingByTeam(teamId: string): Promise<Standing> {
    const response = await API.get(`/standings/team/${teamId}`);
    return response.data;
}
