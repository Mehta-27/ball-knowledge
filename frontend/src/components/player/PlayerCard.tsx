import type { PlayerCard } from "../../types/players";
import { useNavigate } from "react-router-dom";

interface PlayerCardProps {
    player: PlayerCard;
}

export default function PlayerCard({ player }: PlayerCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="card card--clickable"
            onClick={() => navigate(`/players/${player.id}`)}
        >
            <div className="flex gap-4">
                {player.picture_url && (
                    <img
                        src={player.picture_url}
                        alt={player.name}
                        className="avatar avatar--lg"
                    />
                )}
                <div className="flex--col gap-2" style={{ flex: 1 }}>
                    <div>
                        <h3 className="card__title">{player.name}</h3>
                        <p className="type-caption">{player.position}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span className="badge badge--primary">#{player.jersey_number}</span>
                        <span className="badge badge--neutral">{player.position}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
