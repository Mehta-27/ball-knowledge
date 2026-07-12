import type { StandingGroup } from "../../types/standings";
import { useNavigate } from "react-router-dom";

interface StandingCardProps {
    group: StandingGroup;
}

export default function StandingCard({ group }: StandingCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="card card--clickable"
            onClick={() => navigate(`/standings/${encodeURIComponent(group.group)}`)}
        >
            <h3 className="card__title">{group.group}</h3>
            <p className="type-caption mt-2">{group.standings.length} teams</p>
        </div>
    );
}
