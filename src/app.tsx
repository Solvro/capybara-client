import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Game } from "./pages/game";
import { Intro } from "./pages/intro";

export function App() {
  return (
    <div className="arcade-font flex min-h-screen items-center justify-center bg-violet-950 text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}
