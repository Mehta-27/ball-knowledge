import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeam } from "../../api/teams";
import type { TeamDetail } from "../../types/teams";

export default function TeamDetailPage() {
    const { id } = useParams();

    const [team, setTeam] =
        useState<TeamDetail | null>(null);

    useEffect(() => {
        async function fetchTeam() {

            if (!id) return;

            const data = await getTeam(id);
            setTeam(data);
        }

        fetchTeam();
    }, [id]);

    if (!team) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1>{team.name}</h1>

            <img
                src={team.flag_url ?? ""}
                alt={team.name}
                width={180}
            />

            <p>Code: {team.code}</p>
            <p>Continent: {team.continent}</p>
            <p>Confederation: {team.confederation}</p>
            <p>Current Stage: {team.current_stage}</p>
        </>
    );
}
