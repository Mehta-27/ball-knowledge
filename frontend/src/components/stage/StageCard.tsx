import type { StageCard } from "../../types/stages";
import { useNavigate } from "react-router-dom";

interface StageCardProps {
    stage: StageCard;
}

export default function StageCard({ stage }: StageCardProps) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/stages/${stage.id}`)}>
            <h3>{stage.name}</h3>
            <p>{stage.type}</p>
        </div>
    );
}
