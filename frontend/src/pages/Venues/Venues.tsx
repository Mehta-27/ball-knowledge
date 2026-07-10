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
        <>
            <input
                type="text"
                placeholder="Search venues..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <p>{query}</p>

            <h1>Venues</h1>

            {venues.map((venue) => (
                <VenueCard
                    key={venue.id}
                    venue={venue}
                />
            ))}
        </>
    );
}
