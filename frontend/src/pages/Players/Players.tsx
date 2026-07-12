import { useEffect, useState } from "react";

import { getPlayers } from "../../api/players";
import { searchPlayers } from "../../api/players";
import PlayerCard from "../../components/player/PlayerCard";

import type { PlayerCard as PlayerCardType } from "../../types/players";

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
        <div className="section">
            <div className="section-header">
                <h1 className="type-h1">Players</h1>
            </div>

            <div className="search-bar mb-6">
                <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    className="input"
                    type="text"
                    placeholder="Search players by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid--auto-fill">
                {players.map((player) => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                    />
                ))}
            </div>

            {players.length === 0 && (
                <div className="state">
                    <div className="state__icon state__icon--empty">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                    <p className="state__title">No players found</p>
                    <p className="state__description">Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
}
