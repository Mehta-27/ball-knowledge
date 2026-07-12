import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar />
      {isHome ? (
        <Outlet />
      ) : (
        <main className="page page--centered">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      )}
    </>
  );
}
