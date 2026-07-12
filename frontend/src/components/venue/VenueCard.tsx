import type { VenueCard } from "../../types/venues";
import { useNavigate } from "react-router-dom";

interface VenueCardProps {
    venue: VenueCard;
}

export default function VenueCard({ venue }: VenueCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="card card--clickable"
            onClick={() => navigate(`/venues/${venue.id}`)}
        >
            <h3 className="card__title">{venue.stadium}</h3>
            <p className="type-caption mt-2">{venue.city}</p>
            <div className="mt-4">
                <span className="badge badge--neutral">
                    {venue.capacity != null ? `${venue.capacity.toLocaleString()} seats` : "Capacity TBD"}
                </span>
            </div>
        </div>
    );
}
