import React from "react";

import { fireLaser } from "../roomClient";

export function GameControls() {
  const start = { x: 1, y: 1 };
  return (
    <div style={{ position: "absolute", bottom: 8, left: 8, zIndex: 1000 }}>
      <button
        onClick={() =>
          fireLaser({ start, dir: { dx: 1, dy: 0 }, color: "red" })
        }
      >
        Fire Right (Red)
      </button>{" "}
      <button
        onClick={() =>
          fireLaser({ start, dir: { dx: -1, dy: 0 }, color: "green" })
        }
      >
        Fire Left (Green)
      </button>{" "}
      <button
        onClick={() =>
          fireLaser({ start, dir: { dx: 0, dy: -1 }, color: "blue" })
        }
      >
        Fire Up (Blue)
      </button>
    </div>
  );
}
