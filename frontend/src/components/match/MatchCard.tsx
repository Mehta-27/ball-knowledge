import type { MatchCard } from "../../types/matches";
import { useNavigate } from "react-router-dom";

interface MatchCardProps {
    match: MatchCard;
}

export default function MatchCard({ match }: MatchCardProps) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/matches/${match.id}`)}>
            <h3>{match.home} vs {match.away}</h3>
            <p>{match.score}</p>
            <p>{new Date(match.date).toLocaleDateString()}</p>
            <p>{match.stage}</p>
        </div>
    )
}
