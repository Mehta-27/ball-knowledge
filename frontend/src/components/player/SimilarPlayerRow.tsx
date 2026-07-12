import { useNavigate } from "react-router-dom";
import type { SimilarPlayer } from "../../types/players";

interface SimilarPlayerRowProps {
    player: SimilarPlayer;
}

export default function SimilarPlayerRow({
    player,
}: SimilarPlayerRowProps) {
    const navigate = useNavigate();
    return (
        <div
            className="card card--clickable card--compact"
            onClick={() => navigate(`/players/${player.player_id}`)}
        >
            <div className="flex flex--between">
                <div className="flex gap-3">
                    <p style={{ fontWeight: 500 }}>{player.player_name}</p>
                    <span className="badge badge--neutral">{player.position}</span>
                </div>
                <span className="badge badge--success">
                    {(player.similarity * 100).toFixed(1)}%
                </span>
            </div>
        </div>
    );
}
