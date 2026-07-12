import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStandingsByGroup } from "../../api/standings";
import type { Standing } from "../../types/standings";

export default function StandingDetail() {
    const { groupName } = useParams();
    const [standings, setStandings] = useState<Standing[]>([]);

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
        return (
            <div className="section">
                <div className="skeleton" style={{ width: "50%", height: "2rem", marginBottom: "var(--space-6)" }} />
                <div className="skeleton" style={{ width: "100%", height: "20rem" }} />
            </div>
        );
    }

    return (
        <div className="section">
            <h1 className="type-h1" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", marginBottom: "var(--space-2)" }}>
                {decodeURIComponent(groupName ?? "")}
            </h1>
            <div className="detail-hero__badges" style={{ marginBottom: "var(--space-8)" }}>
                <span className="badge badge--primary">Group Standings</span>
            </div>

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
                        {standings.map((row) => (
                            <tr key={row.team}>
                                <td style={{ fontWeight: 600, color: row.position <= 2 ? "var(--primary)" : undefined }}>{row.position}</td>
                                <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{row.team}</td>
                                <td>{row.played}</td>
                                <td>{row.wins}</td>
                                <td>{row.draws}</td>
                                <td>{row.losses}</td>
                                <td>{row.goals_for}</td>
                                <td>{row.goals_against}</td>
                                <td style={{ color: row.goal_difference > 0 ? "var(--primary)" : row.goal_difference < 0 ? "var(--error)" : undefined }}>
                                    {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                                </td>
                                <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>{row.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
