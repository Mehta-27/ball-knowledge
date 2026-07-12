import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeam } from "../../api/teams";
import type { TeamDetail } from "../../types/teams";

export default function TeamDetailPage() {
    const { id } = useParams();

    const [team, setTeam] =
        useState<TeamDetail | null>(null);

    useEffect(() => {
        async function fetchTeam() {

            if (!id) return;

            const data = await getTeam(id);
            setTeam(data);
        }

        fetchTeam();
    }, [id]);

    if (!team) {
        return (
            <div className="state">
                <div className="spinner" />
                <p className="state__description">Loading team...</p>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="flex gap-6 mb-8">
                {team.flag_url && (
                    <img
                        src={team.flag_url}
                        alt={team.name}
                        className="avatar avatar--xl"
                        style={{ borderRadius: "var(--radius-lg)", objectFit: "cover" }}
                    />
                )}
                <div className="flex--col gap-2">
                    <h1 className="type-h1">{team.name}</h1>
                    <div className="flex gap-2 mt-2">
                        <span className="badge badge--primary badge--lg">{team.code}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid--4">
                <div className="stat">
                    <span className="stat__value">{team.continent}</span>
                    <span className="stat__label">Continent</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{team.confederation}</span>
                    <span className="stat__label">Confederation</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{team.current_stage}</span>
                    <span className="stat__label">Current Stage</span>
                </div>
            </div>
        </div>
    );
}
