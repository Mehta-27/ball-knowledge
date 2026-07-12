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
            <div className="state">
                <div className="spinner" />
                <p className="state__description">Loading stage...</p>
            </div>
        );
    }

    return (
        <div className="section">
            <h1 className="type-h1 mb-2">{stage.name}</h1>
            <div className="flex gap-3 mb-8">
                <span className="badge badge--primary">{stage.type}</span>
                <span className="type-caption">Order: {stage.order}</span>
                <span className="type-caption">Season ID: {stage.season_id}</span>
            </div>

            <div className="grid grid--3 mb-8">
                <div className="stat">
                    <span className="stat__value">{stage.start_date ?? "N/A"}</span>
                    <span className="stat__label">Start Date</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{stage.end_date ?? "N/A"}</span>
                    <span className="stat__label">End Date</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{matches.length}</span>
                    <span className="stat__label">Matches</span>
                </div>
            </div>

            {matches.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Matches</h2>
                    <div className="flex--col gap-3">
                        {matches.map((m) => (
                            <div className="card card--compact" key={m.id}>
                                <div className="flex flex--between">
                                    <span style={{ fontWeight: 500 }}>{m.home} vs {m.away}</span>
                                    <span className="badge badge--primary">{m.score ?? "TBD"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
