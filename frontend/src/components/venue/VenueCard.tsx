import type { VenueCard } from "../../types/venues";
import { useNavigate } from "react-router-dom";

interface VenueCardProps {
    venue: VenueCard;
}

export default function VenueCard({ venue }: VenueCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="venue-card"
            onClick={() => navigate(`/venues/${venue.id}`)}
        >
            <h3 className="venue-card__name">{venue.stadium}</h3>
            <p className="venue-card__city">{venue.city}</p>
            <span className="badge badge--neutral">
                {venue.capacity != null ? `${venue.capacity.toLocaleString()} seats` : "Capacity TBD"}
            </span>
        </div>
    );
}
