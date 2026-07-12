import { useEffect, useState } from "react";

import { getVenues } from "../../api/venues";
import { searchVenues } from "../../api/venues";
import VenueCard from "../../components/venue/VenueCard";

import type { VenueCard as VenueCardType } from "../../types/venues";

export default function Venues() {
    const [venues, setVenues] = useState<VenueCardType[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        async function fetchVenues() {
            if (query.trim() === "") {
                const data = await getVenues();
                setVenues(data);
            } else {
                const data = await searchVenues(query);
                setVenues(data);
            }
        }

        fetchVenues();
    }, [query]);

    return (
        <div className="section">
            <div className="section-header">
                <h1 className="type-h1">Venues</h1>
            </div>

            <div className="search-bar mb-6">
                <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    className="input"
                    type="text"
                    placeholder="Search venues by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid--auto-fill">
                {venues.map((venue) => (
                    <VenueCard
                        key={venue.id}
                        venue={venue}
                    />
                ))}
            </div>

            {venues.length === 0 && (
                <div className="state">
                    <div className="state__icon state__icon--empty">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                    <p className="state__title">No venues found</p>
                    <p className="state__description">Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
}
