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
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1>{stage.name}</h1>
            <p>Type: {stage.type}</p>
            <p>Order: {stage.order}</p>
            <p>Season ID: {stage.season_id}</p>
            <p>Start Date: {stage.start_date ?? "N/A"}</p>
            <p>End Date: {stage.end_date ?? "N/A"}</p>

            <h2>Matches</h2>
            {matches.map((m) => (
                <div key={m.id}>
                    <p>{m.home} vs {m.away} — {m.score ?? "TBD"}</p>
                </div>
            ))}
        </>
    );
}
