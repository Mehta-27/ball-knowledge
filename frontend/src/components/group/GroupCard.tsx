import type { GroupCard } from "../../types/groups";
import { useNavigate } from "react-router-dom";

interface GroupCardProps {
    group: GroupCard;
}

export default function GroupCard({ group }: GroupCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="entity-card"
            onClick={() => navigate(`/groups/${group.id}`)}
        >
            <h3 className="entity-card__title">{group.name}</h3>
            <span className="badge badge--primary">View details</span>
        </div>
    );
}
