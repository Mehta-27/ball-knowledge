import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayer, getSimilarPlayers } from "../../api/players";
import SimilarPlayerRow from "../../components/player/SimilarPlayerRow";

import type { PlayerDetail } from "../../types/players";
import type { SimilarPlayer } from "../../types/players";

const statSections = [
    {
        title: "Attacking",
        stats: [
            { key: "goals", label: "Goals" },
            { key: "assists", label: "Assists" },
            { key: "xG", label: "xG" },
            { key: "xA", label: "xA" },
            { key: "shots", label: "Shots" },
            { key: "shots_on_target", label: "Shots on Target" },
        ],
    },
    {
        title: "Possession & Passing",
        stats: [
            { key: "passes", label: "Passes" },
            { key: "touches", label: "Touches" },
        ],
    },
    {
        title: "Defensive",
        stats: [
            { key: "tackles", label: "Tackles" },
            { key: "interceptions", label: "Interceptions" },
            { key: "duels_won", label: "Duels Won" },
        ],
    },
    {
        title: "Overall",
        stats: [
            { key: "matches", label: "Matches" },
            { key: "starts", label: "Starts" },
            { key: "minutes", label: "Minutes" },
            { key: "rating", label: "Avg Rating" },
            { key: "clean_sheets", label: "Clean Sheets" },
            { key: "saves", label: "Saves" },
        ],
    },
];

export default function PlayerDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [player, setPlayer] = useState<PlayerDetail | null>(null);
    const [similarPlayers, setSimilarPlayers] = useState<SimilarPlayer[]>([]);

    useEffect(() => {
        async function fetchPlayer() {
            if (!id) return;

            const data = await getPlayer(id);
            setPlayer(data);

            try {
                const similar = await getSimilarPlayers(id);
                setSimilarPlayers(similar);
            } catch {
                setSimilarPlayers([]);
            }
        }

        fetchPlayer();
    }, [id]);

    if (!player) {
        return (
            <div className="state">
                <div className="spinner" />
                <p className="state__description">Loading player...</p>
            </div>
        );
    }

    const stats = player.statistics;

    return (
        <div className="section">
            <div className="player-detail__hero">
                {player.picture_url && (
                    <img
                        src={player.picture_url}
                        alt={player.name}
                        className="player-detail__portrait"
                    />
                )}
                <div>
                    <h1 className="player-detail__name">{player.name}</h1>
                    <div className="player-detail__badges">
                        <span className="badge badge--primary badge--lg">{player.position}</span>
                        <span className="badge badge--neutral">#{player.jersey_number}</span>
                    </div>
                </div>
            </div>

            <div className="player-detail__stats-grid">
                <div className="player-detail__stat">
                    <span className="player-detail__stat-value">{player.country}</span>
                    <span className="player-detail__stat-label">Country</span>
                </div>
                <div className="player-detail__stat">
                    <span className="player-detail__stat-value">{player.team}</span>
                    <span className="player-detail__stat-label">Team</span>
                </div>
                <div className="player-detail__stat">
                    <span className="player-detail__stat-value">{player.position}</span>
                    <span className="player-detail__stat-label">Position</span>
                </div>
                <div className="player-detail__stat">
                    <span className="player-detail__stat-value">{player.age}</span>
                    <span className="player-detail__stat-label">Age</span>
                </div>
            </div>

            <div className="section">
                <h2 className="type-h2 mb-4">World Cup Stats</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
                    {statSections.map((section) => (
                        <div key={section.title} className="card card--compact">
                            <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>
                                {section.title}
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                                {section.stats.map(({ key, label }) => {
                                    const val = stats[key as keyof typeof stats];
                                    const display = typeof val === "number"
                                        ? key === "minutes"
                                            ? `${Math.round(val)}"`
                                            : key === "rating" || key === "xG" || key === "xA"
                                                ? val.toFixed(2)
                                                : val
                                        : val;
                                    return (
                                        <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-1) 0" }}>
                                            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{label}</span>
                                            <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>{display ?? "—"}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {similarPlayers.length > 0 && (
                <div className="section">
                    <h2 className="type-h2 mb-4">Similar Players</h2>
                    <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>
                        Based on per-90 minute statistical profile across the World Cup
                    </p>
                    <div className="flex--col gap-3">
                        {similarPlayers.map((p) => (
                            <SimilarPlayerRow
                                key={p.player_id}
                                player={p}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
