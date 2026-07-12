import { useEffect, useState } from "react";

import { getMatches } from "../../api/matches";
import MatchCard from "../../components/match/MatchCard";

import type { MatchCard as MatchCardType } from "../../types/matches";

export default function Matches() {
    const [matches, setMatches] = useState<MatchCardType[]>([]);

    useEffect(() => {
        async function fetchMatches() {
            const data = await getMatches();
            setMatches(data);
        }

        fetchMatches();
    }, []);

    return (
        <div className="section">
            <div className="section-header">
                <h1 className="type-h1">Matches</h1>
            </div>

            <div className="flex--col gap-4">
                {matches.map((match) => (
                    <MatchCard
                        key={match.id}
                        match={match}
                    />
                ))}
            </div>

            {matches.length === 0 && (
                <div className="state">
                    <div className="state__icon state__icon--empty">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                            <polyline points="17 2 12 7 7 2" />
                        </svg>
                    </div>
                    <p className="state__title">No matches yet</p>
                    <p className="state__description">Match data will appear here once available.</p>
                </div>
            )}
        </div>
    );
}
