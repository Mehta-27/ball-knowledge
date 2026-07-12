import axios from "axios";
import type { GroupCard, GroupDetail } from "../types/groups";
import type { Standing } from "../types/standings";
import type { MatchCard } from "../types/matches";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export async function getGroups(): Promise<GroupCard[]> {
    const response = await API.get("/groups");
    return response.data;
}

export async function getGroup(id: string): Promise<GroupDetail> {
    const response = await API.get(`/groups/${id}`);
    return response.data;
}

export async function getGroupStandings(groupId: string): Promise<Standing[]> {
    const response = await API.get(`/groups/${groupId}/standings`);
    return response.data;
}

export async function getGroupMatches(groupId: string): Promise<MatchCard[]> {
    const response = await API.get(`/groups/${groupId}/matches`);
    return response.data;
}
