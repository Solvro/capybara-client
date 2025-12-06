import type { Room } from "colyseus.js";
import { useEffect, useState } from "react";

import { Tilemap } from "../components/tilemap";
import { CELL_SIZE } from "../constants/global";
import type {
  MessageBoxDestroyed,
  MessageMapInfo,
  MessageOnAddPlayer,
  MessageOnRemovePlayer,
  MessagePositionUpdate,
} from "../types/messages";
import type { Player } from "../types/player";

export function Game({ room }: { room: Room }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [table, setTable] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    room.send("getMapInfo");
    setSessionId(room.sessionId);
  }, []);

  useEffect(() => {
    room.onMessage("mapInfo", (message: MessageMapInfo) => {
      setTable(message.grid);
      setWidth(message.width);
      setHeight(message.height);
      setPlayers(message.players);
      setIsLoading(false);
    });

    room.onMessage("positionUpdate", (message: MessagePositionUpdate) => {
      setPlayers((previousPlayers) =>
        previousPlayers.map((player) =>
          player.name === message.playerName
            ? { ...player, x: message.position.x, y: message.position.y }
            : player,
        ),
      );
    });

    room.onMessage("onAddPlayer", (message: MessageOnAddPlayer) => {
      setPlayers((previousPlayers: Player[]) => {
        if (previousPlayers.some((p) => p.name === message.playerName)) {
          return previousPlayers;
        }

        return [
          ...previousPlayers,
          {
            name: message.playerName,
            x: message.position.x,
            y: message.position.y,
            index: message.index,
            sessionId: message.sessionId,
          },
        ];
      });
    });

    room.onMessage("onRemovePlayer", (message: MessageOnRemovePlayer) => {
      setPlayers((previousPlayers) =>
        previousPlayers.filter((player) => player.name !== message.playerName),
      );
    });

    room.onMessage("box_destroyed", (message: MessageBoxDestroyed) => {
      setTable((prevTable) => {
        const newTable = prevTable.map((row) => [...row]);
        message.hits.forEach((hit) => {
          if (newTable[hit.y] && newTable[hit.y][hit.x] !== undefined) {
            newTable[hit.y][hit.x] = 0; // Set to GROUND
          }
        });
        return newTable;
      });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      let x = 0;
      let y = 0;

      switch (key) {
        case "w":
        case "arrowup": {
          y = -1;
          break;
        }
        case "a":
        case "arrowleft": {
          x = -1;
          break;
        }
        case "s":
        case "arrowdown": {
          y = 1;
          break;
        }
        case "d":
        case "arrowright": {
          x = 1;
          break;
        }
      }

      room.send("move", { x, y });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [room]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Tilemap
      width={width}
      height={height}
      cellSize={CELL_SIZE}
      initialTable={table}
      players={players}
      clientId={sessionId}
    />
  );
}
