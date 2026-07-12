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
        return (
            <div className="state">
                <div className="spinner" />
                <p className="state__description">Loading group...</p>
            </div>
        );
    }

    return (
        <div className="section">
            <h1 className="type-h1 mb-2">{group.name}</h1>
            <p className="type-caption mb-8">Stage: {group.stage_name}</p>

            {standings.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Standings</h2>
                    <div className="table-wrap">
                        <table className="table">
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
                                        <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{s.team}</td>
                                        <td>{s.played}</td>
                                        <td>{s.wins}</td>
                                        <td>{s.draws}</td>
                                        <td>{s.losses}</td>
                                        <td>{s.goals_for}</td>
                                        <td>{s.goals_against}</td>
                                        <td>{s.goal_difference}</td>
                                        <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {matches.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Matches</h2>
                    <div className="flex--col gap-3">
                        {matches.map((m) => (
                            <div className="card card--compact" key={m.id}>
                                <div className="flex flex--between">
                                    <span style={{ fontWeight: 500 }}>{m.home} vs {m.away}</span>
                                    <span className="badge badge--primary">{m.score ?? "TBD"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
