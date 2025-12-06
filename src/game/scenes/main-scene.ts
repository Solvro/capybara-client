import type { Room } from "colyseus.js";
import * as Phaser from "phaser";

import { TILES } from "../../constants/blocks";
import { CELL_SIZE } from "../../constants/global";
import { PLAYER_SPRITES } from "../../constants/player-sprites";
import type {
  MessageMapInfo,
  MessageOnAddPlayer,
  MessageOnRemovePlayer,
  MessagePositionUpdate,
} from "../../types/messages";
import { PlayerEntity } from "./player";

// Helper class to group Sprite + Name Tag
type PlayerLookupPreference = "any" | "local" | "remote";

export class MainScene extends Phaser.Scene {
  private players = new Map<string, PlayerEntity>();
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private lastMoveTime = 0;
  private currentPlayerName: string | null = null;

  constructor() {
    super("MainGame");
  }

  preload() {
    // 1. Load Tile Images
    for (const [index, tileSource] of TILES.entries()) {
      this.load.image(`tile_${index.toString()}`, tileSource);
    }

    // 2. Load Player Spritesheets / Frames
    // We iterate over the complex PLAYER_SPRITES array to load every frame
    for (const [skinIndex, skin] of PLAYER_SPRITES.entries()) {
      const directions = ["front", "back", "left", "right"] as const;
      for (const direction of directions) {
        for (const [frameIndex, frameSource] of skin[direction].entries()) {
          this.load.image(
            `p_${skinIndex.toString()}_${direction}_${frameIndex.toString()}`,
            frameSource,
          );
        }
      }
    }
  }

  create() {
    // 1. Create Animations
    for (const [skinIndex] of PLAYER_SPRITES.entries()) {
      const directions = ["front", "back", "left", "right"] as const;
      for (const direction of directions) {
        const frames = [0, 1, 2].map((index) => ({
          key: `p_${skinIndex.toString()}_${direction}_${index.toString()}`,
        }));

        // Ping-pong animation: 0 -> 1 -> 2 -> 1 -> 0
        this.anims.create({
          key: `player_${skinIndex.toString()}_${direction}`,
          frames,
          frameRate: 10,
          repeat: -1,
          yoyo: true,
        });
      }
    }

    // 2. Setup Input
    if (this.input.keyboard !== null) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys("W,A,S,D") as {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      };
    }

    // 3. Connect to Room
    try {
      const room = this.registry.get("room") as Room;

      // -- Handlers --

      room.onMessage("mapInfo", (message: MessageMapInfo) => {
        this.createMap(message.grid, message.width, message.height);

        // Create existing players
        for (const p of message.players) {
          this.addPlayer(
            p.sessionId,
            p.name,
            p.x,
            p.y,
            p.index,
            p.sessionId === room.sessionId,
          );
        }
      });

      room.onMessage("onAddPlayer", (message: MessageOnAddPlayer) => {
        if (this.players.has(message.sessionId)) {
          return;
        }

        this.addPlayer(
          message.sessionId,
          message.playerName,
          message.position.x,
          message.position.y,
          message.index,
          message.sessionId === room.sessionId,
        );
      });

      room.onMessage("onRemovePlayer", (message: MessageOnRemovePlayer) => {
        const removed =
          this.removePlayerByName(message.playerName, "remote") ??
          this.removePlayerByName(message.playerName, "any");

        if (removed == null) {
          console.warn("Player removal requested for unknown name", message);
        }
      });

      room.onMessage("positionUpdate", (message: MessagePositionUpdate) => {
        const preference =
          this.currentPlayerName === message.playerName ? "local" : "any";

        const target = this.findPlayerByName(message.playerName, preference);
        target?.movePlayerTo(message.position.x, message.position.y);
      });

      // Request initial state
      room.send("getMapInfo");
    } catch (error) {
      console.error("Room not connected", error);
    }
  }

  update(time: number) {
    const room = this.registry.get("room") as Room | undefined;
    if (room == null) {
      return;
    }

    // Simple debounce to prevent flooding
    if (time - this.lastMoveTime < 150) {
      return;
    }

    let x = 0;
    let y = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      x = -1;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      x = 1;
    } else if (this.cursors.up.isDown || this.wasd.W.isDown) {
      y = -1;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      y = 1;
    }

    if (x !== 0 || y !== 0) {
      room.send("move", { x, y });
      this.lastMoveTime = time;
    }
  }

  private createMap(grid: number[][], width: number, height: number) {
    // Center the map or start at 0,0
    // React code used grid layout. Here we just place images.

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileType = grid[y][x];

        // 1. Always draw the floor (tile_0) as the base layer
        // This ensures transparent walls/crates show the floor, not the blue background
        const floor = this.add.image(
          x * CELL_SIZE + CELL_SIZE / 2,
          y * CELL_SIZE + CELL_SIZE / 2,
          "tile_0",
        );
        floor.setDisplaySize(CELL_SIZE, CELL_SIZE);
        floor.setDepth(0);

        // 2. If the specific tile is NOT the floor (e.g. it's a wall or crate),
        // draw it on top of the floor.
        if (tileType !== 0) {
          const tile = this.add.image(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            `tile_${tileType.toString()}`,
          );
          tile.setDisplaySize(CELL_SIZE, CELL_SIZE);
          tile.setDepth(1); // Layer above floor
        }
      }
    }
  }

  private addPlayer(
    sessionId: string,
    name: string,
    x: number,
    y: number,
    skinIndex: number,
    isMe: boolean,
  ) {
    // Initial texture key
    const initialKey = `p_${skinIndex.toString()}_front_0`;

    const player = new PlayerEntity(
      this,
      x,
      y,
      initialKey,
      name,
      isMe,
      skinIndex,
    );
    player.setDepth(10); // Above tiles

    this.players.set(sessionId, player);

    if (isMe) {
      this.currentPlayerName = name;
    }
  }

  private findPlayerByName(
    playerName: string,
    preference: PlayerLookupPreference,
  ): PlayerEntity | null {
    const isLocalPreference = preference === "local";
    const isRemotePreference = preference === "remote";

    for (const entity of this.players.values()) {
      if (entity.playerName !== playerName) {
        continue;
      }

      if (isLocalPreference && entity.isLocalPlayer !== true) {
        continue;
      }

      if (isRemotePreference && entity.isLocalPlayer === true) {
        continue;
      }

      return entity;
    }

    return null;
  }

  private removePlayerByName(
    playerName: string,
    preference: PlayerLookupPreference,
  ): PlayerEntity | null {
    const isLocalPreference = preference === "local";
    const isRemotePreference = preference === "remote";

    for (const [sessionId, entity] of this.players.entries()) {
      if (entity.playerName !== playerName) {
        continue;
      }

      if (isLocalPreference && entity.isLocalPlayer !== true) {
        continue;
      }

      if (isRemotePreference && entity.isLocalPlayer === true) {
        continue;
      }

      entity.destroy();
      this.players.delete(sessionId);
      return entity;
    }

    return null;
  }
}
