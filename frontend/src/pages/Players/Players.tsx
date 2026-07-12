import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getPlayers, searchPlayers } from "../../api/players";
import PlayerCard from "../../components/player/PlayerCard";

import type { PlayerCard as PlayerCardType } from "../../types/players";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.04,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

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
            <div className="players-header">
                <div className="players-header__top">
                    <h1 className="players-header__title">Players</h1>
                    <span className="players-header__count">
                        {players.length} {players.length === 1 ? "player" : "players"}
                    </span>
                </div>
                <p className="players-header__subtitle">
                    Search and explore player profiles, stats, and similarity networks.
                </p>
            </div>

            <div className="players-search">
                <svg className="players-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    className="players-search__input"
                    type="text"
                    placeholder="Search players by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {players.length > 0 ? (
                <motion.div
                    className="grid grid--auto-fill"
                    variants={container}
                    initial="hidden"
                    animate="show"
                    key={query || "all"}
                >
                    {players.map((player) => (
                        <motion.div key={player.id} variants={item}>
                            <PlayerCard player={player} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="players-empty">
                    <div className="players-empty__icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                    <p className="players-empty__title">No players found</p>
                    <p className="players-empty__text">Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
}
