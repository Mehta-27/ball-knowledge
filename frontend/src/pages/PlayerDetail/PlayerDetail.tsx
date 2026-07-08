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
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1>{player.name}</h1>

            <img
                src={player.picture_url ?? ""}
                alt={player.name}
                width={180}
            />

            <p>Country: {player.country}</p>
            <p>Team: {player.team}</p>
            <p>Position: {player.position}</p>
            <p>Age: {player.age}</p>

            <h2>Similar Players</h2>

            {similarPlayers.map((player) => (
                <SimilarPlayerRow
                    key={player.player_id}
                    player={player}
                />
            ))}
        </>
    );
}