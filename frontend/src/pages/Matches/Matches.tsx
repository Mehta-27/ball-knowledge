import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { getPaginatedMatches } from "../../api/matches";
import MatchCard from "../../components/match/MatchCard";
import type { MatchCard as MatchCardType } from "../../types/matches";

const PAGE_SIZE = 24;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

function SkeletonCard() {
    return (
        <div className="match-card" aria-hidden>
            <div className="match-card__inner">
                <div className="match-card__teams">
                    <div className="skeleton skeleton--text" style={{ width: 120, height: 16 }} />
                    <div className="skeleton skeleton--text" style={{ width: 24, height: 12 }} />
                    <div className="skeleton skeleton--text" style={{ width: 120, height: 16 }} />
                </div>
                <div className="skeleton skeleton--text" style={{ width: 60, height: 28, borderRadius: "var(--radius-md)" }} />
            </div>
            <div style={{ marginTop: 12 }}>
                <div className="skeleton skeleton--text" style={{ width: 100, height: 12 }} />
            </div>
        </div>
    );
}

export default function Matches() {
    const [matches, setMatches] = useState<MatchCardType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const offsetRef = useRef(0);

    const loadPage = useCallback(async (offset: number, append: boolean) => {
        if (append) setLoadingMore(true); else setLoading(true);
        try {
            const data = await getPaginatedMatches(PAGE_SIZE, offset);
            setMatches((prev) => (append ? [...prev, ...data.items] : data.items));
            setTotal(data.total);
            offsetRef.current = offset + data.items.length;
        } catch { /* */ }
        finally { setLoading(false); setLoadingMore(false); }
    }, []);

    useEffect(() => { loadPage(0, false); }, [loadPage]);

    const handleLoadMore = () => loadPage(offsetRef.current, true);
    const hasMore = matches.length < total;

    return (
        <div className="section">
            <div className="players-header">
                <div className="players-header__top">
                    <h1 className="players-header__title">Matches</h1>
                    {total > 0 && <span className="players-header__count">{total} matches</span>}
                </div>
                <p className="players-header__subtitle">Results, scores, and detailed match analytics.</p>
            </div>

            {loading && matches.length === 0 && (
                <div className="flex--col gap-4">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>
            )}

            {!loading && matches.length > 0 && (
                <motion.div className="flex--col gap-4" variants={container} initial="hidden" animate="show">
                    {matches.map((match) => <motion.div key={match.id} variants={item}><MatchCard match={match} /></motion.div>)}
                </motion.div>
            )}

            {hasMore && !loading && (
                <div className="players-load-more">
                    <button className="players-load-more__btn" onClick={handleLoadMore} disabled={loadingMore}>
                        {loadingMore ? "Loading..." : `Show more (${matches.length} of ${total})`}
                    </button>
                </div>
            )}

            {loadingMore && <div className="flex--col gap-4" style={{ marginTop: "var(--space-5)" }}>{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>}

            {!loading && matches.length === 0 && (
                <div className="players-empty">
                    <div className="players-empty__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" /><polyline points="17 2 12 7 7 2" /></svg></div>
                    <p className="players-empty__title">No matches yet</p>
                    <p className="players-empty__text">Match data will appear here once available.</p>
                </div>
            )}
        </div>
    );
}
