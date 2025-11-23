import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Room } from "colyseus.js";
import Intro from "./pages/Intro";
import Game from "./pages/Game";

function App() {
  const [room, setRoom] = useState<Room | null>(null);

  return (
    <div className="bg-violet-950 text-white min-h-screen flex items-center justify-center arcade-font">
      <Router>
        <Routes>
          <Route path="/" element={<Intro setRoom={setRoom} />} />
          <Route
            path="/game"
            element={room ? <Game room={room} /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
