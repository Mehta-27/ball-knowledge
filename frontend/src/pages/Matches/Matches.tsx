import { useEffect, useState } from "react";

import { getMatches } from "../../api/matches";
import MatchCard from "../../components/match/MatchCard";

import type { MatchCard as MatchCardType } from "../../types/matches";
import { searchMatches } from "../../api/matches";

export default function Matches() {
    const [matches, setMatches] = useState<MatchCardType[]>([]);

    const [query, setQuery] = useState("");

    useEffect(() => {
        async function fetchMatches() {
            if (query.trim() === "") {
                const data = await getMatches();
                setMatches(data);
            } else {
                const data = await searchMatches(query);
                setMatches(data);
            }
        }

        fetchMatches();
    }, [query]);

    return (
        <>
            <input
                type="text"
                placeholder="Search matches..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <p>{query}</p>

            <h1>Matches</h1>

            {matches.map((match) => (
                <MatchCard
                    key={match.id}
                    match={match}
                />
            ))}
        </>
    );
}
