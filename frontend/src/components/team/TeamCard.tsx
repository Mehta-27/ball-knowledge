import type { TeamCard } from "../../types/teams";
import { useNavigate } from "react-router-dom";

interface TeamCardProps {
    team: TeamCard;
}

export default function TeamCard({ team }: TeamCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="team-card"
            onClick={() => navigate(`/teams/${team.id}`)}
        >
            <h3 className="team-card__name">{team.name}</h3>
            <span className="badge badge--neutral">{team.code}</span>
        </div>
    );
}
