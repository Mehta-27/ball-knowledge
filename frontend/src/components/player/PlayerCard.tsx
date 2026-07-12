import type { PlayerCard as PlayerCardType } from "../../types/players";
import { useNavigate } from "react-router-dom";

interface PlayerCardProps {
    player: PlayerCardType;
}

export default function PlayerCard({ player }: PlayerCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="player-card"
            onClick={() => navigate(`/players/${player.id}`)}
        >
            {player.picture_url && (
                <div className="player-card__image-wrap">
                    <img
                        src={player.picture_url}
                        alt={player.name}
                        className="player-card__image"
                        loading="lazy"
                    />
                    <span className="player-card__number">
                        {player.jersey_number}
                    </span>
                </div>
            )}
            <div className="player-card__info">
                <h3 className="player-card__name">{player.name}</h3>
                <div className="player-card__meta">
                    <span className="player-card__position">{player.position}</span>
                    <span className="player-card__dot" />
                    <span className="player-card__jersey">#{player.jersey_number}</span>
                </div>
            </div>
        </div>
    );
}
