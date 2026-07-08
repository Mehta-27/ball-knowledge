import { useEffect, useState } from "react";

import { getPlayers } from "../../api/players";
import PlayerCard from "../../components/player/PlayerCard";

import type { PlayerCard as PlayerCardType } from "../../types/players";
import { searchPlayers } from "../../api/players";

export default function Players() {
    const [players, setPlayers] = useState<PlayerCardType[]>([]);

    const [query, setQuery] = useState("");

    useEffect(() => {
        async function fetchPlayers() {
            if (query.trim() === "") {
                const data = await getPlayers();
                setPlayers(data);
            } else {
                const data = await searchPlayers(query);
                setPlayers(data);
            }
        }

        fetchPlayers();
    }, [query]);

    return (
        <>
            <input
                type="text"
                placeholder="Search players..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <p>{query}</p>

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