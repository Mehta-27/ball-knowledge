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
        <>
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
