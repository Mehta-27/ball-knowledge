import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenue } from "../../api/venues";
import type { VenueDetail } from "../../types/venues";

export default function VenueDetailPage() {
    const { id } = useParams();

    const [venue, setVenue] =
        useState<VenueDetail | null>(null);

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
            <div className="state">
                <div className="spinner" />
                <p className="state__description">Loading venue...</p>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="flex gap-6 mb-8">
                {venue.picture_url && (
                    <img
                        src={venue.picture_url}
                        alt={venue.stadium}
                        className="avatar avatar--xl"
                        style={{ borderRadius: "var(--radius-lg)", objectFit: "cover" }}
                    />
                )}
                <div className="flex--col gap-2">
                    <h1 className="type-h1">{venue.stadium}</h1>
                    <p className="type-caption">{venue.city}, {venue.country}</p>
                </div>
            </div>

            <div className="grid grid--4">
                <div className="stat">
                    <span className="stat__value">{venue.capacity?.toLocaleString() ?? "N/A"}</span>
                    <span className="stat__label">Capacity</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{venue.turf ?? "N/A"}</span>
                    <span className="stat__label">Turf</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{venue.roof ? "Yes" : "No"}</span>
                    <span className="stat__label">Roof</span>
                </div>
                <div className="stat">
                    <span className="stat__value">{venue.matches_played}</span>
                    <span className="stat__label">Matches Played</span>
                </div>
            </div>
        </div>
    );
}
