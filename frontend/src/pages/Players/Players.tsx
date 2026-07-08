import { useEffect, useState } from "react";

import { getPlayers } from "../../api/players";
import PlayerCard from "../../components/player/PlayerCard";

import type { PlayerCard as PlayerCardType } from "../../types/players";

export default function Players() {
    const [players, setPlayers] = useState<PlayerCardType[]>([]);

    useEffect(() => {
        async function fetchPlayers() {
            const data = await getPlayers();
            setPlayers(data);
        }

        fetchPlayers();
    }, []);

    return (
        <>
            <h1>Players</h1>

            {players.map((player) => (
                <PlayerCard
                    key={player.id}
                    player={player}
                />
            ))}
        </>
    );
}