import { useEffect, useState } from "react";

import { getTeams } from "../../api/teams";
import TeamCard from "../../components/team/TeamCard";

import type { TeamCard as TeamCardType } from "../../types/teams";
import { searchTeams } from "../../api/teams";

export default function Teams() {
    const [teams, setTeams] = useState<TeamCardType[]>([]);

    const [query, setQuery] = useState("");

    useEffect(() => {
        async function fetchTeams() {
            if (query.trim() === "") {
                const data = await getTeams();
                setTeams(data);
            } else {
                const data = await searchTeams(query);
                setTeams(data);
            }
        }

        fetchTeams();
    }, [query]);

    return (
        <>
            <input
                type="text"
                placeholder="Search teams..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <p>{query}</p>

            <h1>Teams</h1>

            {teams.map((team) => (
                <TeamCard
                    key={team.id}
                    team={team}
                />
            ))}
        </>
    );
}
