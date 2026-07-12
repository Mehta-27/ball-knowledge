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
        <div className="section">
            <div className="section-header">
                <h1 className="type-h1">Standings</h1>
            </div>

            <div className="grid grid--auto-fill">
                {groups.map((group) => (
                    <StandingCard
                        key={group.group}
                        group={group}
                    />
                ))}
            </div>
        </div>
    );
}
