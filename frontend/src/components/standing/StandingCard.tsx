import type { StandingGroup } from "../../types/standings";
import { useNavigate } from "react-router-dom";

interface StandingCardProps {
    group: StandingGroup;
}

export default function StandingCard({ group }: StandingCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="entity-card"
            onClick={() => navigate(`/standings/${encodeURIComponent(group.group)}`)}
        >
            <h3 className="entity-card__title">{group.group}</h3>
            <span className="badge badge--neutral">{group.standings.length} teams</span>
        </div>
    );
}
