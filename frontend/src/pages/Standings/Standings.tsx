import { useEffect, useState } from "react";

import { getStandings } from "../../api/standings";
import StandingCard from "../../components/standing/StandingCard";

import type { StandingGroup } from "../../types/standings";

export default function Standings() {
    const [groups, setGroups] = useState<StandingGroup[]>([]);

    useEffect(() => {
        async function fetchStandings() {
            const data = await getStandings();
            setGroups(data);
        }

        fetchStandings();
    }, []);

    return (
        <>
            <h1>Standings</h1>

            {groups.map((group) => (
                <StandingCard
                    key={group.group}
                    group={group}
                />
            ))}
        </>
    );
}
