import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatch } from "../../api/matches";
import { resolvePlayerIds } from "../../api/players";
import type { MatchDetail, PlayerStatInMatch } from "../../types/matches";

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
    const navigate = useNavigate();
    const [match, setMatch] = useState<MatchDetail | null>(null);
    const [idMap, setIdMap] = useState<Record<string, number>>({});

    useEffect(() => {
        async function fetchMatch() {
            if (!id) return;
            const data = await getMatch(id);
            setMatch(data);

            const fotmobIds = [
                ...new Set(data.player_stats.map((p) => p.fotmob_player_id)),
            ];
            if (fotmobIds.length > 0) {
                try {
                    const resolved = await resolvePlayerIds(fotmobIds);
                    setIdMap(resolved);
                } catch {
                    setIdMap({});
                }
            }
        }
        fetchMatch();
    }, [id]);

    function handlePlayerClick(player: PlayerStatInMatch) {
        const fifaId = idMap[String(player.fotmob_player_id)];
        if (fifaId) {
            navigate(`/players/${fifaId}`);
        }
    }

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

    const active = match.player_stats.filter((p) => (p.minutes_played ?? 0) > 0);

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

            {active.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Player Performance</h2>
                    <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>
                        Click any player to view their full World Cup stats and similar players
                    </p>
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
                                {active.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).map((player) => {
                                    const hasLink = !!idMap[String(player.fotmob_player_id)];
                                    return (
                                        <tr
                                            key={player.fotmob_player_id}
                                            onClick={() => handlePlayerClick(player)}
                                            style={{
                                                cursor: hasLink ? "pointer" : "default",
                                                opacity: hasLink ? 1 : 0.7,
                                            }}
                                            className={hasLink ? "card--clickable" : undefined}
                                        >
                                            <td style={{ fontWeight: 500, color: hasLink ? "var(--primary)" : "var(--text-primary)" }}>
                                                {player.player_name}
                                            </td>
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
