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
import { Playground } from "./pages/playground";

export function App() {
  const [room, setRoom] = useState<Room | null>(null);

  return (
    <div className="arcade-font via- flex min-h-screen items-center justify-center bg-linear-to-br from-violet-950/96 to-sky-950/95 text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Intro setRoom={setRoom} />} />
          <Route
            path="/game"
            element={
              room == null ? <Navigate to="/" replace /> : <Game room={room} />
            }
          />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </Router>
    </div>
  );
}
