import type { TeamCard } from "../../types/teams";
import { useNavigate } from "react-router-dom";

interface TeamCardProps {
    team: TeamCard;
}

export default function TeamCard({ team }: TeamCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="card card--clickable"
            onClick={() => navigate(`/teams/${team.id}`)}
        >
            <h3 className="card__title">{team.name}</h3>
            <div className="mt-2">
                <span className="badge badge--neutral">{team.code}</span>
            </div>
        </div>
    );
}
