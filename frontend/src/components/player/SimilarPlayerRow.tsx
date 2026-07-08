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
        <div onClick={() => navigate(`/players/${player.player_id}`)}>

            <p>{player.player_name}</p>
            <p>{player.position}</p>
            <p>{(player.similarity * 100).toFixed(1)}%</p>
        </div>
    );
}