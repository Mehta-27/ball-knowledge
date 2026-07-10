import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroup, getGroupStandings, getGroupMatches } from "../../api/groups";
import type { GroupDetail } from "../../types/groups";
import type { Standing } from "../../types/standings";
import type { MatchCard } from "../../types/matches";

export default function GroupDetailPage() {
    const { id } = useParams();

    const [group, setGroup] = useState<GroupDetail | null>(null);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [matches, setMatches] = useState<MatchCard[]>([]);

    useEffect(() => {
        async function fetchGroup() {
            if (!id) return;

            const data = await getGroup(id);
            setGroup(data);
        }

        fetchGroup();
    }, [id]);

    useEffect(() => {
        async function fetchStandings() {
            if (!id) return;

            const data = await getGroupStandings(id);
            setStandings(data);
        }

        fetchStandings();
    }, [id]);

    useEffect(() => {
        async function fetchMatches() {
            if (!id) return;

            const data = await getGroupMatches(id);
            setMatches(data);
        }

        fetchMatches();
    }, [id]);

    if (!group) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1>{group.name}</h1>
            <p>Stage: {group.stage_name}</p>

            <h2>Standings</h2>
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
                    {standings.map((s) => (
                        <tr key={s.position}>
                            <td>{s.position}</td>
                            <td>{s.team}</td>
                            <td>{s.played}</td>
                            <td>{s.wins}</td>
                            <td>{s.draws}</td>
                            <td>{s.losses}</td>
                            <td>{s.goals_for}</td>
                            <td>{s.goals_against}</td>
                            <td>{s.goal_difference}</td>
                            <td>{s.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Matches</h2>
            {matches.map((m) => (
                <div key={m.id}>
                    <p>{m.home} vs {m.away} — {m.score ?? "TBD"}</p>
                </div>
            ))}
        </>
    );
}
