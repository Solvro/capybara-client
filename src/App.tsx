import type { Room } from "colyseus.js";
import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { Game } from "./pages/game";
import { Intro } from "./pages/intro";

export function App() {
  const [room, setRoom] = useState<Room | null>(null);

  return (
    <div className="arcade-font flex min-h-screen items-center justify-center bg-violet-950 text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Intro setRoom={setRoom} />} />
          <Route
            path="/game"
            element={
              room == null ? <Navigate to="/" replace /> : <Game room={room} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
