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
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1>{venue.stadium}</h1>

            <img
                src={venue.picture_url ?? ""}
                alt={venue.stadium}
                width={180}
            />

            <p>City: {venue.city}</p>
            <p>Country: {venue.country}</p>
            <p>Capacity: {venue.capacity}</p>
            <p>Turf: {venue.turf}</p>
            <p>Roof: {venue.roof ? "Yes" : "No"}</p>
            <p>Matches Played: {venue.matches_played}</p>
        </>
    );
}
