import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenue } from "../../api/venues";
import type { VenueDetail } from "../../types/venues";

export default function VenueDetailPage() {
    const { id } = useParams();
    const [venue, setVenue] = useState<VenueDetail | null>(null);

    useEffect(() => {
        async function fetchVenue() {
            if (!id) return;
            const data = await getVenue(id);
            setVenue(data);
        }
        fetchVenue();
    }, [id]);

    if (!venue) {
        return (
            <div className="section">
                <div className="detail-hero">
                    <div className="skeleton skeleton--avatar" />
                    <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ width: "60%", height: "2rem", marginBottom: "var(--space-3)" }} />
                        <div className="skeleton" style={{ width: "30%", height: "1rem" }} />
                    </div>
                </div>
                <div className="stat-grid">
                    {[0, 1, 2, 3].map((i) => (
                        <div className="stat-card" key={i}>
                            <div className="skeleton" style={{ width: "70%", height: "1.5rem", marginBottom: "var(--space-2)" }} />
                            <div className="skeleton" style={{ width: "50%", height: "0.75rem" }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="detail-hero">
                {venue.picture_url && (
                    <img
                        src={venue.picture_url}
                        alt={venue.stadium}
                        className="detail-hero__image"
                    />
                )}
                <div>
                    <h1 className="detail-hero__name">{venue.stadium}</h1>
                    <div className="detail-hero__badges">
                        <span className="badge badge--primary badge--lg">{venue.city}</span>
                        <span className="badge badge--neutral">{venue.country}</span>
                    </div>
                </div>
            </div>

            <div className="stat-grid">
                <div className="stat-card">
                    <span className="stat-card__value">{venue.capacity?.toLocaleString() ?? "N/A"}</span>
                    <span className="stat-card__label">Capacity</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{venue.turf ?? "N/A"}</span>
                    <span className="stat-card__label">Turf</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{venue.roof ? "Yes" : "No"}</span>
                    <span className="stat-card__label">Roof</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{venue.matches_played}</span>
                    <span className="stat-card__label">Matches Played</span>
                </div>
            </div>
        </div>
    );
}
