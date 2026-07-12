import type { StageCard } from "../../types/stages";
import { useNavigate } from "react-router-dom";

interface StageCardProps {
    stage: StageCard;
}

export default function StageCard({ stage }: StageCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="entity-card"
            onClick={() => navigate(`/stages/${stage.id}`)}
        >
            <h3 className="entity-card__title">{stage.name}</h3>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                <span className="badge badge--neutral">{stage.type}</span>
                <span className="badge badge--primary">Order {stage.order}</span>
            </div>
        </div>
    );
}
