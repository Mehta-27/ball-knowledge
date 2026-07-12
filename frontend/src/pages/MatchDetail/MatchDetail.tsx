import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMatch } from "../../api/matches";
import type { MatchDetail } from "../../types/matches";

const statLabels: Record<string, string> = {
    ball_possession: "Possession",
    expected_goals: "xG",
    total_shots: "Total Shots",
    shots_on_target: "Shots on Target",
    passes: "Passes",
    corners: "Corners",
    fouls: "Fouls",
    tackles: "Tackles",
    interceptions: "Interceptions",
    saves: "Saves",
    yellow_cards: "Yellow Cards",
    red_cards: "Red Cards",
};

const statKeys = Object.keys(statLabels);

export default function MatchDetail() {
    const { id } = useParams();
    const [match, setMatch] = useState<MatchDetail | null>(null);

    useEffect(() => {
        async function fetchMatch() {
            if (!id) return;
            const data = await getMatch(id);
            setMatch(data);
        }
        fetchMatch();
    }, [id]);

    if (!match) {
        return (
            <div className="section">
                <div className="skeleton" style={{ width: "40%", height: "1.5rem", marginBottom: "var(--space-6)" }} />
                <div className="match-scoreboard">
                    <div className="skeleton" style={{ width: "30%", height: "2rem" }} />
                    <div className="skeleton" style={{ width: "15%", height: "3rem" }} />
                    <div className="skeleton" style={{ width: "30%", height: "2rem" }} />
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="match-scoreboard">
                <div className="match-scoreboard__team">
                    <span className="match-scoreboard__name">{match.home_team}</span>
                </div>
                <div className="match-scoreboard__score">
                    {match.home_score} <span className="match-scoreboard__divider">—</span> {match.away_score}
                </div>
                <div className="match-scoreboard__team">
                    <span className="match-scoreboard__name">{match.away_team}</span>
                </div>
            </div>

            <div className="match-scoreboard__meta">
                {match.stage && <span className="badge badge--primary">{match.stage}</span>}
                <span>{new Date(match.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                {match.venue && <span>{match.venue}</span>}
                {match.attendance && <span>{match.attendance.toLocaleString()} attendance</span>}
            </div>

            {match.home_team_stats && match.away_team_stats && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Team Comparison</h2>
                    <div className="table-wrap">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>{match.home_team}</th>
                                    <th>{match.away_team}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statKeys.map((key) => {
                                    const homeVal = match.home_team_stats![key as keyof typeof match.home_team_stats];
                                    const awayVal = match.away_team_stats![key as keyof typeof match.away_team_stats];
                                    const homeNum = typeof homeVal === "number" ? homeVal : 0;
                                    const awayNum = typeof awayVal === "number" ? awayVal : 0;
                                    const homeWins = homeNum > awayNum;
                                    const awayWins = awayNum > homeNum;
                                    return (
                                        <tr key={key}>
                                            <td>{statLabels[key]}</td>
                                            <td style={{ fontWeight: homeWins ? 600 : 400, color: homeWins ? "var(--primary)" : undefined }}>{String(homeVal)}</td>
                                            <td style={{ fontWeight: awayWins ? 600 : 400, color: awayWins ? "var(--primary)" : undefined }}>{String(awayVal)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {match.player_stats.length > 0 && (() => {
                const active = match.player_stats.filter((p) => (p.minutes_played ?? 0) > 0);
                if (active.length === 0) return null;
                return (
                    <div className="section">
                        <h2 className="type-h2 mb-4">Player Performance</h2>
                        <div className="table-wrap">
                            <table className="table-premium">
                                <thead>
                                    <tr>
                                        <th>Player</th>
                                        <th>Min</th>
                                        <th>Rating</th>
                                        <th>Goals</th>
                                        <th>Assists</th>
                                        <th>xG</th>
                                        <th>xA</th>
                                        <th>Shots</th>
                                        <th>SOT</th>
                                        <th>Touches</th>
                                        <th>Passes</th>
                                        <th>Tackles</th>
                                        <th>Int</th>
                                        <th>Duels W</th>
                                        <th>Saves</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {active.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).map((player) => (
                                        <tr key={player.player_name}>
                                            <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{player.player_name}</td>
                                            <td>{player.minutes_played != null ? `${Math.round(player.minutes_played)}'` : "—"}</td>
                                            <td style={{ fontWeight: 600, color: (player.rating ?? 0) >= 7.5 ? "var(--primary)" : undefined }}>{player.rating != null ? player.rating.toFixed(1) : "—"}</td>
                                            <td>{player.goals ?? "—"}</td>
                                            <td>{player.assists ?? "—"}</td>
                                            <td>{player.xG != null ? player.xG.toFixed(2) : "—"}</td>
                                            <td>{player.xA != null ? player.xA.toFixed(2) : "—"}</td>
                                            <td>{player.total_shots ?? "—"}</td>
                                            <td>{player.shots_on_target ?? "—"}</td>
                                            <td>{player.touches ?? "—"}</td>
                                            <td>{player.passes ?? "—"}</td>
                                            <td>{player.tackles ?? "—"}</td>
                                            <td>{player.interceptions ?? "—"}</td>
                                            <td>{player.duels_won ?? "—"}</td>
                                            <td>{player.saves ?? "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
