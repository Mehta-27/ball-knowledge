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
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1>{match.home_team} vs {match.away_team}</h1>

            <p>Venue: {match.venue}</p>
            <p>Stage: {match.stage}</p>
            <p>Attendance: {match.attendance}</p>
            <p>Date: {new Date(match.date).toLocaleDateString()}</p>

            <h2>Home Team Stats</h2>
            <p>Ball Possession: {match.home_team_stats?.ball_possession}</p>
            <p>Expected Goals: {match.home_team_stats?.expected_goals}</p>
            <p>Total Shots: {match.home_team_stats?.total_shots}</p>
            <p>Shots on Target: {match.home_team_stats?.shots_on_target}</p>
            <p>Passes: {match.home_team_stats?.passes}</p>
            <p>Corners: {match.home_team_stats?.corners}</p>
            <p>Fouls: {match.home_team_stats?.fouls}</p>
            <p>Tackles: {match.home_team_stats?.tackles}</p>
            <p>Interceptions: {match.home_team_stats?.interceptions}</p>
            <p>Saves: {match.home_team_stats?.saves}</p>
            <p>Yellow Cards: {match.home_team_stats?.yellow_cards}</p>
            <p>Red Cards: {match.home_team_stats?.red_cards}</p>

            <h2>Away Team Stats</h2>
            <p>Ball Possession: {match.away_team_stats?.ball_possession}</p>
            <p>Expected Goals: {match.away_team_stats?.expected_goals}</p>
            <p>Total Shots: {match.away_team_stats?.total_shots}</p>
            <p>Shots on Target: {match.away_team_stats?.shots_on_target}</p>
            <p>Passes: {match.away_team_stats?.passes}</p>
            <p>Corners: {match.away_team_stats?.corners}</p>
            <p>Fouls: {match.away_team_stats?.fouls}</p>
            <p>Tackles: {match.away_team_stats?.tackles}</p>
            <p>Interceptions: {match.away_team_stats?.interceptions}</p>
            <p>Saves: {match.away_team_stats?.saves}</p>
            <p>Yellow Cards: {match.away_team_stats?.yellow_cards}</p>
            <p>Red Cards: {match.away_team_stats?.red_cards}</p>

            <h2>Player Stats</h2>
            {match.player_stats.map((player) => (
                <div key={player.player_name}>
                    <h3>{player.player_name}</h3>
                    <p>Rating: {player.rating}</p>
                    <p>Goals: {player.goals}</p>
                    <p>Assists: {player.assists}</p>
                    <p>Shots: {player.total_shots}</p>
                    <p>Shots on Target: {player.shots_on_target}</p>
                    <p>Passes: {player.passes}</p>
                    <p>Tackles: {player.tackles}</p>
                    <p>Interceptions: {player.interceptions}</p>
                    <p>Duels Won: {player.duels_won}</p>
                    <p>Saves: {player.saves}</p>
                </div>
            ))}
        </>
    );
}
