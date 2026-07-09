import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStandingsByGroup } from "../../api/standings";
import type { Standing } from "../../types/standings";

export default function StandingDetail() {
    const { groupName } = useParams();

    const [standings, setStandings] =
        useState<Standing[]>([]);

    useEffect(() => {
        async function fetchStandings() {

            if (!groupName) return;

            const decoded = decodeURIComponent(groupName);
            const data = await getStandingsByGroup(decoded);
            setStandings(data);
        }

        fetchStandings();
    }, [groupName]);

    if (standings.length === 0) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1>{decodeURIComponent(groupName ?? "")}</h1>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((row) => (
                        <tr key={row.team}>
                            <td>{row.position}</td>
                            <td>{row.team}</td>
                            <td>{row.played}</td>
                            <td>{row.wins}</td>
                            <td>{row.draws}</td>
                            <td>{row.losses}</td>
                            <td>{row.goals_for}</td>
                            <td>{row.goals_against}</td>
                            <td>{row.goal_difference}</td>
                            <td>{row.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
