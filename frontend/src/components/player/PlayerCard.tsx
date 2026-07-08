import type { PlayerCard } from "../../types/players";
import { useNavigate } from "react-router-dom";

interface PlayerCardProps {
    player: PlayerCard;
}

export default function PlayerCard({ player }: PlayerCardProps) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/players/${player.id}`)}>
            <img
                src={player.picture_url ?? ""}
                alt={player.name}
                width={120}
            />

            <h3>{player.name}</h3>

            <p>{player.position}</p>

            <p>#{player.jersey_number}</p>
        </div>
    );
}