import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStage, getStageMatches } from "../../api/stages";
import type { StageDetail } from "../../types/stages";
import type { MatchCard } from "../../types/matches";

export default function StageDetailPage() {
    const { id } = useParams();
    const [stage, setStage] = useState<StageDetail | null>(null);
    const [matches, setMatches] = useState<MatchCard[]>([]);

    useEffect(() => {
        async function fetchStage() {
            if (!id) return;
            const data = await getStage(id);
            setStage(data);
        }
        fetchStage();
    }, [id]);

    useEffect(() => {
        async function fetchMatches() {
            if (!id) return;
            const data = await getStageMatches(id);
            setMatches(data);
        }
        fetchMatches();
    }, [id]);

    if (!stage) {
        return (
            <div className="section">
                <div className="skeleton" style={{ width: "50%", height: "2rem", marginBottom: "var(--space-3)" }} />
                <div className="skeleton" style={{ width: "30%", height: "1rem", marginBottom: "var(--space-8)" }} />
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
            <h1 className="type-h1" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", marginBottom: "var(--space-2)" }}>
                {stage.name}
            </h1>
            <div className="detail-hero__badges" style={{ marginBottom: "var(--space-8)" }}>
                <span className="badge badge--primary">{stage.type}</span>
                <span className="badge badge--neutral">Order: {stage.order}</span>
                <span className="badge badge--neutral">Season {stage.season_id}</span>
            </div>

            <div className="stat-grid">
                <div className="stat-card">
                    <span className="stat-card__value">{stage.start_date ?? "N/A"}</span>
                    <span className="stat-card__label">Start Date</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{stage.end_date ?? "N/A"}</span>
                    <span className="stat-card__label">End Date</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{matches.length}</span>
                    <span className="stat-card__label">Matches</span>
                </div>
            </div>

            {matches.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Matches</h2>
                    <div className="table-wrap">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Home</th>
                                    <th style={{ textAlign: "center" }}>Score</th>
                                    <th>Away</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map((m) => (
                                    <tr key={m.id}>
                                        <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{m.home}</td>
                                        <td style={{ textAlign: "center", fontWeight: 600, color: "var(--primary)" }}>{m.score ?? "TBD"}</td>
                                        <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{m.away}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
