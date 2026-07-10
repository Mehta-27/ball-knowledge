import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import Players from "./pages/Players/Players";
import PlayerDetail from "./pages/PlayerDetail/PlayerDetail";
import Teams from "./pages/Teams/Teams";
import TeamDetailPage from "./pages/TeamDetail/TeamDetail";
import Matches from "./pages/Matches/Matches";
import MatchDetail from "./pages/MatchDetail/MatchDetail";
import Standings from "./pages/Standings/Standings";
import StandingDetail from "./pages/StandingDetail/StandingDetail";
import Venues from "./pages/Venues/Venues";
import VenueDetailPage from "./pages/VenueDetail/VenueDetail";
import Groups from "./pages/Groups/Groups";
import GroupDetailPage from "./pages/GroupDetail/GroupDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/standings/:groupName" element={<StandingDetail />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;