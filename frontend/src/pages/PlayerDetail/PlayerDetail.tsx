import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayer } from "../../api/players";
import type { PlayerDetail } from "../../types/players";
import { getSimilarPlayers } from "../../api/players";
import SimilarPlayerRow from "../../components/player/SimilarPlayerRow";
import type { SimilarPlayer } from "../../types/players";

export default function PlayerDetailPage() {
    const { id } = useParams();

    const [player, setPlayer] =
        useState<PlayerDetail | null>(null);

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
            <div className="flex gap-6 mb-8">
                {player.picture_url && (
                    <img
                        src={player.picture_url}
                        alt={player.name}
                        className="avatar avatar--xl"
                    />
                )}
                <div className="flex--col gap-2">
                    <h1 className="type-h1">{player.name}</h1>
                    <div className="flex gap-2 mt-2">
                        <span className="badge badge--primary badge--lg">{player.position}</span>
                        <span className="badge badge--neutral">#{player.jersey_number}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid--4 mb-8">
                <div className="stat">
                    <span className="stat__value">{player.country}</span>
                    <span className="stat__label">Country</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{player.team}</span>
                    <span className="stat__label">Team</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{player.position}</span>
                    <span className="stat__label">Position</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{player.age}</span>
                    <span className="stat__label">Age</span>
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
