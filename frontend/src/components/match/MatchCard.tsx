import type { MatchCard } from "../../types/matches";
import { useNavigate } from "react-router-dom";

interface MatchCardProps {
    match: MatchCard;
}

export default function MatchCard({ match }: MatchCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="match-card"
            onClick={() => navigate(`/matches/${match.id}`)}
        >
            <div className="match-card__inner">
                <div className="match-card__teams">
                    <span className="match-card__team">{match.home}</span>
                    <span className="match-card__vs">vs</span>
                    <span className="match-card__team">{match.away}</span>
                </div>
                {match.score && (
                    <span className="match-card__score">{match.score}</span>
                )}
            </div>
            <div className="match-card__meta">
                <span className="match-card__date">
                    {new Date(match.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
                {match.stage && (
                    <span className="match-card__stage">{match.stage}</span>
                )}
            </div>
        </div>
    );
}
