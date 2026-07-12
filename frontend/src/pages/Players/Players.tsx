import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

import { getPaginatedPlayers } from "../../api/players";
import PlayerCard from "../../components/player/PlayerCard";

import type { PlayerCard as PlayerCardType } from "../../types/players";

const PAGE_SIZE = 24;
const DEBOUNCE_MS = 300;

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.03 },
    },
};

const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

function SkeletonCard() {
    return (
        <div className="player-card" aria-hidden>
            <div className="skeleton skeleton--image" />
            <div className="player-card__info">
                <div className="skeleton skeleton--text" style={{ width: "70%", height: 16 }} />
                <div className="skeleton skeleton--text" style={{ width: "50%", height: 12, marginTop: 8 }} />
            </div>
        </div>
    );
}

export default function Players() {
    const [players, setPlayers] = useState<PlayerCardType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState("");
    const debouncedQuery = useRef("");
    const offsetRef = useRef(0);
    const abortRef = useRef(0);

    const loadPage = useCallback(async (search: string, offset: number, append: boolean) => {
        const reqId = ++abortRef.current;
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const data = await getPaginatedPlayers(PAGE_SIZE, offset, search || undefined);
            if (reqId !== abortRef.current) return;

            setPlayers((prev) => (append ? [...prev, ...data.items] : data.items));
            setTotal(data.total);
            offsetRef.current = offset + data.items.length;
        } catch {
            // request was aborted or failed
        } finally {
            if (reqId === abortRef.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadPage("", 0, false);
    }, [loadPage]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query !== debouncedQuery.current) {
                debouncedQuery.current = query;
                offsetRef.current = 0;
                loadPage(query, 0, false);
            }
        }, DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query, loadPage]);

    const handleLoadMore = () => {
        loadPage(debouncedQuery.current, offsetRef.current, true);
    };

    const hasMore = players.length < total;
    const showSkeletons = loading && players.length === 0;
    const showEmpty = !loading && players.length === 0;

    return (
        <div className="section">
            <div className="players-header">
                <div className="players-header__top">
                    <h1 className="players-header__title">Players</h1>
                    {total > 0 && (
                        <span className="players-header__count">
                            {total} {total === 1 ? "player" : "players"}
                        </span>
                    )}
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

            {showSkeletons && (
                <div className="grid grid--auto-fill">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {!showSkeletons && players.length > 0 && (
                <motion.div
                    className="grid grid--auto-fill"
                    variants={container}
                    initial="hidden"
                    animate="show"
                    key={debouncedQuery.current || "all"}
                >
                    {players.map((player) => (
                        <motion.div key={player.id} variants={item}>
                            <PlayerCard player={player} />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {hasMore && !loading && (
                <div className="players-load-more">
                    <button
                        className="players-load-more__btn"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore ? "Loading..." : `Show more (${players.length} of ${total})`}
                    </button>
                </div>
            )}

            {loadingMore && (
                <div className="grid grid--auto-fill" style={{ marginTop: "var(--space-5)" }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {showEmpty && (
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
