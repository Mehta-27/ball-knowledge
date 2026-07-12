import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeam } from "../../api/teams";
import type { TeamDetail } from "../../types/teams";

export default function TeamDetailPage() {
    const { id } = useParams();
    const [team, setTeam] = useState<TeamDetail | null>(null);

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
            <div className="section">
                <div className="detail-hero">
                    <div className="skeleton skeleton--avatar" />
                    <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ width: "60%", height: "2rem", marginBottom: "var(--space-3)" }} />
                        <div className="skeleton" style={{ width: "30%", height: "1rem" }} />
                    </div>
                </div>
                <div className="stat-grid">
                    {[0, 1, 2].map((i) => (
                        <div className="stat-card" key={i}>
                            <div className="skeleton" style={{ width: "70%", height: "1.5rem", marginBottom: "var(--space-2)" }} />
                            <div className="skeleton" style={{ width: "50%", height: "0.75rem" }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="detail-hero">
                {team.flag_url && (
                    <img
                        src={team.flag_url}
                        alt={team.name}
                        className="detail-hero__image"
                        style={{ borderRadius: "var(--radius-lg)" }}
                    />
                )}
                <div>
                    <h1 className="detail-hero__name">{team.name}</h1>
                    <div className="detail-hero__badges">
                        <span className="badge badge--primary badge--lg">{team.code}</span>
                    </div>
                </div>
            </div>

            <div className="stat-grid">
                <div className="stat-card">
                    <span className="stat-card__value">{team.continent}</span>
                    <span className="stat-card__label">Continent</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{team.confederation}</span>
                    <span className="stat-card__label">Confederation</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{team.current_stage}</span>
                    <span className="stat-card__label">Current Stage</span>
                </div>
            </div>
        </div>
    );
}
