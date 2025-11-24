import { TILES } from "../constants/blocks";
import { PLAYER_SPRITES } from "../constants/player-sprites";
import type { Player } from "../types/player";
import { Entity } from "./entity";

interface TilemapProps {
  width: number;
  height: number;
  cellSize: number;
  initialTable: number[][];
  players: Player[];
  clientId?: string;
}

export function Tilemap({
  width,
  height,
  cellSize,
  initialTable,
  players,
  clientId,
}: TilemapProps) {
  console.warn("Tilemap rendering with players:", clientId);
  return (
    <div
      className="grid"
      style={{
        position: "relative",
        width: width * cellSize,
        border: "2px solid #444",
        height: height * cellSize,
        gridTemplateColumns: `repeat(${width.toString()}, ${cellSize.toString()}px)`,
        gridTemplateRows: `repeat(${height.toString()}, ${cellSize.toString()}px)`,
      }}
    >
      {initialTable.flat().map((tile, index) => {
        return (
          <div key={index} className="bg-gray-500">
            <img
              src={TILES[tile]}
              alt={String(tile)}
              style={{ width: cellSize, height: cellSize, display: "block" }}
            />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: width * cellSize,
          height: height * cellSize,
          pointerEvents: "none",
        }}
      >
        {players.map((player) => {
          const left = player.x * cellSize;
          const top = player.y * cellSize;
          const frames = PLAYER_SPRITES[player.index];

          return (
            <div
              key={player.name}
              style={{
                position: "absolute",
                width: cellSize,
                height: cellSize,
                transform: `translate(${left.toString()}px, ${top.toString()}px)`,
                transition: "transform 160ms linear",
                willChange: "transform",
                pointerEvents: "auto",
              }}
            >
              <Entity
                allFrames={frames}
                position={{ x: player.x, y: player.y }}
                cellSize={cellSize}
                type="player"
                name={
                  player.sessionId === clientId
                    ? `${player.name} (You)`
                    : player.name
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
