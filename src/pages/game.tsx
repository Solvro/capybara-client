import type { Room } from "colyseus.js";
import { useEffect, useRef, useState } from "react";

import { Tilemap } from "../components/tilemap";
import { CELL_SIZE } from "../constants/global";
import type { Button } from "../types/button";
import type { Crate } from "../types/crate";
import type { Door } from "../types/door";
import type {
  MessageCrateUpdate,
  MessageDoorUpdate,
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
  const [crates, setCrates] = useState<Crate[]>([]);
  const [doors, setDoors] = useState<Door[]>([]);
  const [buttons, setButtons] = useState<Button[]>([]);

  const playersRef = useRef(players);
  const cratesRef = useRef(crates);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);
  useEffect(() => {
    cratesRef.current = crates;
  }, [crates]);

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
      setCrates(message.crates);
      setButtons(message.buttons);
      setDoors(message.doors);

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

    room.onMessage("crateUpdate", (message: MessageCrateUpdate) => {
      setCrates((previous) =>
        previous.map((crate) =>
          crate.crateId === message.crateId
            ? { ...crate, x: message.position.x, y: message.position.y }
            : crate,
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

    room.onMessage("doorUpdate", (message: MessageDoorUpdate) => {
      setDoors((previousDoors) =>
        previousDoors.map((door) =>
          door.doorId === message.doorId
            ? { ...door, open: message.open }
            : door,
        ),
      );
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

      const player = playersRef.current.find((p) => p.sessionId === sessionId);
      if (player == null) {
        return;
      }

      const targetX = player.x + x;
      const targetY = player.y + y;

      const targetCrate = getCrateAt(targetX, targetY, cratesRef.current);

      if (targetCrate == null) {
        console.warn(`Moving player ${player.name}`);
        room.send("move", { x, y });
      } else {
        console.warn(`Crate ${targetCrate.crateId}`);
        console.warn(`Pushing crate by ${player.name}`);
        room.send("pushCrate", { crateId: targetCrate.crateId, dx: x, dy: y });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [room, sessionId]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Tilemap
      width={width}
      height={height}
      cellSize={CELL_SIZE}
      grid={table}
      players={players}
      crates={crates}
      doors={doors}
      buttons={buttons}
      clientId={sessionId}
    />
  );
}
function getCrateAt(
  x: number,
  y: number,
  crates: { crateId: string; x: number; y: number }[],
) {
  return crates.find((crate) => crate.x === x && crate.y === y) ?? null;
}
