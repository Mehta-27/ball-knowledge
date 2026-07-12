import { useEffect, useState } from "react";

import { getTeams } from "../../api/teams";
import { searchTeams } from "../../api/teams";
import TeamCard from "../../components/team/TeamCard";

import type { TeamCard as TeamCardType } from "../../types/teams";

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
        <div className="section">
            <div className="section-header">
                <h1 className="type-h1">Teams</h1>
            </div>

            <div className="search-bar mb-6">
                <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    className="input"
                    type="text"
                    placeholder="Search teams by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid--auto-fill">
                {teams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                    />
                ))}
            </div>

            {teams.length === 0 && (
                <div className="state">
                    <div className="state__icon state__icon--empty">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                    <p className="state__title">No teams found</p>
                    <p className="state__description">Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
}
