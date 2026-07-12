import type { StageCard } from "../../types/stages";
import { useNavigate } from "react-router-dom";

interface StageCardProps {
    stage: StageCard;
}

export default function StageCard({ stage }: StageCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="card card--clickable"
            onClick={() => navigate(`/stages/${stage.id}`)}
        >
            <h3 className="card__title">{stage.name}</h3>
            <div className="mt-2">
                <span className="badge badge--neutral">{stage.type}</span>
            </div>
        </div>
    );
}
