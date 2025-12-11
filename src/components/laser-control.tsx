import { fireLaser } from "../roomClient";

export function GameControls() {
  const start = { x: 1, y: 1 };
  return (
    <div style={{ position: "absolute", bottom: 8, left: 8, zIndex: 1000 }}>
      {/* Buttons used to fire/toggle lasers. 
          Re-using the fireLaser function name but mapping it to toggle_laser in roomClient. */}
      <button
        onClick={() => {
          fireLaser({ start, dir: { dx: 1, dy: 0 }, color: "red" });
        }}
      >
        Toggle Right (Red)
      </button>{" "}
      <button
        onClick={() => {
          fireLaser({ start, dir: { dx: -1, dy: 0 }, color: "green" });
        }}
      >
        Toggle Left (Green)
      </button>{" "}
      <button
        onClick={() => {
          fireLaser({ start, dir: { dx: 0, dy: -1 }, color: "blue" });
        }}
      >
        Toggle Up (Blue)
      </button>
    </div>
  );
}
