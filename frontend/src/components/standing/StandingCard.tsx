import type { StandingGroup } from "../../types/standings";
import { useNavigate } from "react-router-dom";

interface StandingCardProps {
    group: StandingGroup;
}

export default function StandingCard({ group }: StandingCardProps) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/standings/${encodeURIComponent(group.group)}`)}>
            <h3>{group.group}</h3>
            <p>{group.standings.length} teams</p>
        </div>
    )
}
