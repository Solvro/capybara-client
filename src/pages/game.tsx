import type { Player } from "../types/player";
import Tilemap from "../components/tilemap";
import { Room } from "colyseus.js";
import { useEffect, useState } from "react";

const CELL_SIZE = 64;

function Game({ room }: { room: Room }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [table, setTable] = useState<number[][]>(new Array(0));
  const [isLoading, setIsLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    room.send("getMapInfo");
    setSessionId(room.sessionId);
  }, []);

  useEffect(() => {
    room.onMessage("mapInfo", (message) => {
      setTable(message.grid);
      setWidth(message.width);
      setHeight(message.height);
      setPlayers(message.players);
      setIsLoading(false);
      console.log("Map info received:");
    });

    room.onMessage("positionUpdate", (message) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.name === message.playerName
            ? { ...player, x: message.position.x, y: message.position.y }
            : player
        )
      );
    });

    room.onMessage("onAddPlayer", (message) => {
      if (players.find((p) => p.name === message.playerName)) {
        return;
      }
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        {
          name: message.playerName,
          x: message.position.x,
          y: message.position.y,
          index: message.index,
          sessionId: message.sessionId,
        },
      ]);
      console.log("Player added:", message.playerName);
    });

    room.onMessage("onRemovePlayer", (message) => {
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.name !== message.playerName)
      );
      console.log("Player removed:", message.playerName);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let x: number = 0;
      let y: number = 0;

      switch (key) {
        case "w":
        case "arrowup":
          y = -1;
          break;
        case "a":
        case "arrowleft":
          x = -1;
          break;
        case "s":
        case "arrowdown":
          y = 1;
          break;
        case "d":
        case "arrowright":
          x = 1;
          break;
      }

      room.send("move", { x, y });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [room]);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
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
}

export default Game;
