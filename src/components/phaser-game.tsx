import type { Room } from "colyseus.js";
import { useEffect, useRef } from "react";

import { phaserConfig } from "../game/config";

export interface PhaserGameProps {
  room: Room;
}

export function PhaserGame({ room }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  // perhaps useLayoutEffect will be better in future
  // (if the game container has dynamic sizing or scaling)
  useEffect(() => {
    if (gameRef.current == null) {
      const config = { ...phaserConfig };
      config.callbacks = {
        preBoot: (game) => {
          game.registry.set("room", room);
        },
      };
      gameRef.current = new Phaser.Game(config);
    }
  }, [room]);

  return <div id="game-container"></div>;
}

PhaserGame.displayName = "PhaserGame";
