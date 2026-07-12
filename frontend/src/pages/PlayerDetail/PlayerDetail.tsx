import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayer, getSimilarPlayers } from "../../api/players";
import SimilarPlayerRow from "../../components/player/SimilarPlayerRow";

import type { PlayerDetail } from "../../types/players";
import type { SimilarPlayer } from "../../types/players";

export default function PlayerDetailPage() {
    const { id } = useParams();

    const [player, setPlayer] = useState<PlayerDetail | null>(null);
    const [similarPlayers, setSimilarPlayers] = useState<SimilarPlayer[]>([]);

    useEffect(() => {
        async function fetchPlayer() {
            if (!id) return;

            const data = await getPlayer(id);
            setPlayer(data);

            const similar = await getSimilarPlayers(id);
            setSimilarPlayers(similar);
        }

        fetchPlayer();
    }, [id]);

    if (!player) {
        return (
            <div className="state">
                <div className="spinner" />
                <p className="state__description">Loading player...</p>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="player-detail__hero">
                {player.picture_url && (
                    <img
                        src={player.picture_url}
                        alt={player.name}
                        className="player-detail__portrait"
                    />
                )}
                <div>
                    <h1 className="player-detail__name">{player.name}</h1>
                    <div className="player-detail__badges">
                        <span className="badge badge--primary badge--lg">{player.position}</span>
                        <span className="badge badge--neutral">#{player.jersey_number}</span>
                    </div>
                </div>
            </div>

            <div className="player-detail__stats-grid">
                <div className="player-detail__stat">
                    <span className="player-detail__stat-value">{player.country}</span>
                    <span className="player-detail__stat-label">Country</span>
                </div>
                <div className="player-detail__stat">
                    <span className="player-detail__stat-value">{player.team}</span>
                    <span className="player-detail__stat-label">Team</span>
                </div>
                <div className="player-detail__stat">
                    <span className="player-detail__stat-value">{player.position}</span>
                    <span className="player-detail__stat-label">Position</span>
                </div>
                <div className="player-detail__stat">
                    <span className="player-detail__stat-value">{player.age}</span>
                    <span className="player-detail__stat-label">Age</span>
                </div>
            </div>

            {similarPlayers.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-6">Similar Players</h2>
                    <div className="flex--col gap-3">
                        {similarPlayers.map((p) => (
                            <SimilarPlayerRow
                                key={p.player_id}
                                player={p}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
