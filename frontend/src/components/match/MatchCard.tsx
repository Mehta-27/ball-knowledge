import type { MatchCard } from "../../types/matches";
import { useNavigate } from "react-router-dom";

interface MatchCardProps {
    match: MatchCard;
}

export default function MatchCard({ match }: MatchCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="card card--clickable"
            onClick={() => navigate(`/matches/${match.id}`)}
        >
            <div className="card__header">
                <div>
                    <h3 className="card__title">
                        {match.home} <span style={{ color: "var(--text-muted)" }}>vs</span> {match.away}
                    </h3>
                    {match.stage && (
                        <p className="card__subtitle">{match.stage}</p>
                    )}
                </div>
                {match.score && (
                    <span className="badge badge--primary badge--lg">{match.score}</span>
                )}
            </div>
            <div className="card__footer">
                <span className="type-caption">
                    {new Date(match.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            </div>
        </div>
    );
}
