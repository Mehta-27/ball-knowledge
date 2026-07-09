import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>{" | "}
            <Link to="/players">Players</Link>{" | "}
            <Link to="/teams">Teams</Link>{" | "}
            <Link to="/matches">Matches</Link>{" | "}
            <Link to="/standings">Standings</Link>
        </nav>
    );
}