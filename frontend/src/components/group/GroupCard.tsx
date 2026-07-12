import type { GroupCard } from "../../types/groups";
import { useNavigate } from "react-router-dom";

interface GroupCardProps {
    group: GroupCard;
}

export default function GroupCard({ group }: GroupCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="card card--clickable"
            onClick={() => navigate(`/groups/${group.id}`)}
        >
            <h3 className="card__title">{group.name}</h3>
        </div>
    );
}
