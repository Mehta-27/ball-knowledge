import type { VenueCard } from "../../types/venues";
import { useNavigate } from "react-router-dom";

interface VenueCardProps {
    venue: VenueCard;
}

export default function VenueCard({ venue }: VenueCardProps) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/venues/${venue.id}`)}>
            <h3>{venue.stadium}</h3>
            <p>{venue.city}</p>
            <p>{venue.capacity}</p>
        </div>
    )
}
