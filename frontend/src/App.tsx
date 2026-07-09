import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import Players from "./pages/Players/Players";
import PlayerDetail from "./pages/PlayerDetail/PlayerDetail";
import Teams from "./pages/Teams/Teams";
import TeamDetailPage from "./pages/TeamDetail/TeamDetail";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;