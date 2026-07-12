import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";

const links = [
  { to: "/players", label: "Players" },
  { to: "/teams", label: "Teams" },
  { to: "/matches", label: "Matches" },
  { to: "/standings", label: "Standings" },
  { to: "/venues", label: "Venues" },
  { to: "/groups", label: "Groups" },
  { to: "/stages", label: "Stages" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    if (window.scrollY > 20) {
      el.classList.add("navbar--scrolled");
    } else {
      el.classList.remove("navbar--scrolled");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const closeMobile = () => setMobileOpen(false);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav ref={navRef} className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMobile}>
          <div className="navbar__brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <span>Ball Knowledge</span>
        </Link>

        <div className={`navbar__links ${mobileOpen ? "navbar__links--mobile-open" : ""}`}>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar__link ${isActive(to) ? "navbar__link--active" : ""}`}
              onClick={closeMobile}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          className={`navbar__mobile-toggle ${mobileOpen ? "navbar__mobile-open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <div className="navbar__hamburger">
            <span />
            <span />
            <span />
          </div>
        </button>
      </div>
    </nav>
  );
}
