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
            <div className="section">
                <div className="skeleton" style={{ width: "40%", height: "2rem", marginBottom: "var(--space-3)" }} />
                <div className="skeleton" style={{ width: "25%", height: "1rem", marginBottom: "var(--space-8)" }} />
                <div className="skeleton" style={{ width: "100%", height: "16rem" }} />
            </div>
        );
    }

    return (
        <div className="section">
            <h1 className="type-h1" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", marginBottom: "var(--space-2)" }}>
                {group.name}
            </h1>
            <div className="detail-hero__badges" style={{ marginBottom: "var(--space-8)" }}>
                <span className="badge badge--primary">{group.stage_name}</span>
            </div>

            {standings.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Standings</h2>
                    <div className="table-wrap">
                        <table className="table-premium">
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
                                        <td style={{ fontWeight: 600, color: s.position <= 2 ? "var(--primary)" : undefined }}>{s.position}</td>
                                        <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{s.team}</td>
                                        <td>{s.played}</td>
                                        <td>{s.wins}</td>
                                        <td>{s.draws}</td>
                                        <td>{s.losses}</td>
                                        <td>{s.goals_for}</td>
                                        <td>{s.goals_against}</td>
                                        <td style={{ color: s.goal_difference > 0 ? "var(--primary)" : s.goal_difference < 0 ? "var(--error)" : undefined }}>
                                            {s.goal_difference > 0 ? `+${s.goal_difference}` : s.goal_difference}
                                        </td>
                                        <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>{s.points}</td>
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
                    <div className="table-wrap">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Home</th>
                                    <th style={{ textAlign: "center" }}>Score</th>
                                    <th>Away</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map((m) => (
                                    <tr key={m.id}>
                                        <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{m.home}</td>
                                        <td style={{ textAlign: "center", fontWeight: 600, color: "var(--primary)" }}>{m.score ?? "TBD"}</td>
                                        <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{m.away}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
