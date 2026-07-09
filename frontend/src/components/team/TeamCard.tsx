import type { TeamCard } from "../../types/teams";
import { useNavigate } from "react-router-dom";

interface TeamCardProps {
    team: TeamCard;
}

export default function TeamCard({ team }: TeamCardProps) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/teams/${team.id}`)}>
            <h3>{team.name}</h3>
            <p>{team.code}</p>
        </div>
    );
}
