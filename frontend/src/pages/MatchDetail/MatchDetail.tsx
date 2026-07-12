import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMatch } from "../../api/matches";
import type { MatchDetail } from "../../types/matches";

export default function MatchDetail() {
    const { id } = useParams();

    const [match, setMatch] =
        useState<MatchDetail | null>(null);

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
            <div className="state">
                <div className="spinner" />
                <p className="state__description">Loading match...</p>
            </div>
        );
    }

    return (
        <div className="section">
            <h1 className="type-h1 mb-2">{match.home_team} vs {match.away_team}</h1>

            <div className="flex gap-4 mb-8">
                {match.stage && <span className="badge badge--primary">{match.stage}</span>}
                <span className="type-caption">
                    {new Date(match.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
                {match.venue && <span className="type-caption">{match.venue}</span>}
                {match.attendance && <span className="type-caption">{match.attendance.toLocaleString()} attendance</span>}
            </div>

            {match.home_team_stats && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Home Team Stats</h2>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>{match.home_team}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Ball Possession</td><td>{match.home_team_stats.ball_possession}</td></tr>
                                <tr><td>Expected Goals</td><td>{match.home_team_stats.expected_goals}</td></tr>
                                <tr><td>Total Shots</td><td>{match.home_team_stats.total_shots}</td></tr>
                                <tr><td>Shots on Target</td><td>{match.home_team_stats.shots_on_target}</td></tr>
                                <tr><td>Passes</td><td>{match.home_team_stats.passes}</td></tr>
                                <tr><td>Corners</td><td>{match.home_team_stats.corners}</td></tr>
                                <tr><td>Fouls</td><td>{match.home_team_stats.fouls}</td></tr>
                                <tr><td>Tackles</td><td>{match.home_team_stats.tackles}</td></tr>
                                <tr><td>Interceptions</td><td>{match.home_team_stats.interceptions}</td></tr>
                                <tr><td>Saves</td><td>{match.home_team_stats.saves}</td></tr>
                                <tr><td>Yellow Cards</td><td>{match.home_team_stats.yellow_cards}</td></tr>
                                <tr><td>Red Cards</td><td>{match.home_team_stats.red_cards}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {match.away_team_stats && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Away Team Stats</h2>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>{match.away_team}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Ball Possession</td><td>{match.away_team_stats.ball_possession}</td></tr>
                                <tr><td>Expected Goals</td><td>{match.away_team_stats.expected_goals}</td></tr>
                                <tr><td>Total Shots</td><td>{match.away_team_stats.total_shots}</td></tr>
                                <tr><td>Shots on Target</td><td>{match.away_team_stats.shots_on_target}</td></tr>
                                <tr><td>Passes</td><td>{match.away_team_stats.passes}</td></tr>
                                <tr><td>Corners</td><td>{match.away_team_stats.corners}</td></tr>
                                <tr><td>Fouls</td><td>{match.away_team_stats.fouls}</td></tr>
                                <tr><td>Tackles</td><td>{match.away_team_stats.tackles}</td></tr>
                                <tr><td>Interceptions</td><td>{match.away_team_stats.interceptions}</td></tr>
                                <tr><td>Saves</td><td>{match.away_team_stats.saves}</td></tr>
                                <tr><td>Yellow Cards</td><td>{match.away_team_stats.yellow_cards}</td></tr>
                                <tr><td>Red Cards</td><td>{match.away_team_stats.red_cards}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {match.player_stats.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Player Stats</h2>
                    <div className="grid grid--auto-fill">
                        {match.player_stats.map((player) => (
                            <div className="card card--compact" key={player.player_name}>
                                <h3 className="card__title">{player.player_name}</h3>
                                <div className="grid grid--3 mt-4" style={{ gap: "var(--space-2)" }}>
                                    <div className="stat">
                                        <span className="stat__value">{player.rating}</span>
                                        <span className="stat__label">Rating</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat__value">{player.goals}</span>
                                        <span className="stat__label">Goals</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat__value">{player.assists}</span>
                                        <span className="stat__label">Assists</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
