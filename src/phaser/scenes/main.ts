import type { Room } from "colyseus.js";
import * as Phaser from "phaser";

import type {
  MessageMapInfo,
  MessageOnAddPlayer,
  MessageOnRemovePlayer,
  MessagePositionUpdate,
} from "../../types/messages";
import type { Player as PlayerType } from "../../types/player";
import { Player } from "../entities/player";
import { TILE_SIZE } from "../lib/const";
import {
  PLAYER_TEXTURE_KEYS,
  createPlayerAnimators,
  getPlayerAnimator,
  getPlayerTextureKey,
} from "../lib/player-animators";
import type { SpriteAnimator } from "../lib/sprite-animator";
import { getTileName } from "../lib/utils";

export class Main extends Phaser.Scene {
  private room!: Room;
  private players = new Map<string, Player>();
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private playerMoveDebounce = 0;
  private playerAnimators!: SpriteAnimator[];

  constructor() {
    super({ key: "Main" });
  }

  init() {
    if (!this.registry.has("room")) {
      throw new Error("Room not found in registry");
    }
    this.room = this.registry.get("room") as Room;
  }

  preload() {
    this.load.setBaseURL(import.meta.env.BASE_URL);

    this.load.image("wall", "images/wall.png");
    this.load.image("crate", "images/crate.png");
    this.load.image("ground", "images/ground.png");

    for (const [index, textureKey] of PLAYER_TEXTURE_KEYS.entries()) {
      this.load.spritesheet(
        textureKey,
        `images/players/${String(index + 1)}.png`,
        {
          frameWidth: 64,
          frameHeight: 64,
        },
      );
    }
  }

  create() {
    this.playerAnimators = createPlayerAnimators();
    for (const animator of this.playerAnimators) {
      animator.register(this);
    }

    // Input setup
    if (this.input.keyboard !== null) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys("W,A,S,D") as {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      };
    }

    // Colyseus message handlers
    try {
      const room = this.registry.get("room") as Room;

      room.onMessage("mapInfo", (message: MessageMapInfo) => {
        this.createMap(message.grid, message.width, message.height);

        for (const player of message.players) {
          this.addPlayer(player);
        }
      });

      room.onMessage("onAddPlayer", (message: MessageOnAddPlayer) => {
        this.addPlayer({
          sessionId: message.sessionId,
          name: message.playerName,
          x: message.position.x,
          y: message.position.y,
          index: message.index, // what is this for?
          isLocal: message.sessionId === this.room.sessionId,
        });
      });

      room.onMessage("onRemovePlayer", (message: MessageOnRemovePlayer) => {
        const player = this.players.get(message.sessionId);
        if (player !== undefined) {
          player.destroy();
          this.players.delete(message.sessionId);
        }
      });

      room.onMessage("positionUpdate", (message: MessagePositionUpdate) => {
        const player = this.players.get(message.sessionId);
        if (player !== undefined) {
          player.move(message.direction);
        }
      });

      this.room.send("getMapInfo");
    } catch (error) {
      console.error("Error setting up Colyseus message handlers:", error);
    }
  }

  update(time: number) {
    if (time - this.playerMoveDebounce < 250) {
      return;
    }

    this.handleInput(time);
  }

  private addPlayer(playerSpawnInfo: PlayerType) {
    const textureKey = getPlayerTextureKey(playerSpawnInfo.index);
    const animator = getPlayerAnimator(
      this.playerAnimators,
      playerSpawnInfo.index,
    );

    const player = new Player(
      this,
      playerSpawnInfo.x,
      playerSpawnInfo.y,
      playerSpawnInfo.name,
      playerSpawnInfo.sessionId,
      playerSpawnInfo.isLocal,
      textureKey,
      animator,
    );
    this.players.set(playerSpawnInfo.sessionId, player);
    this.add.existing(player);
  }

  createMap(grid: number[][], width: number, height: number) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileType = grid[y][x];

        this.add.image(
          x * TILE_SIZE + TILE_SIZE / 2,
          y * TILE_SIZE + TILE_SIZE / 2,
          "ground",
        );

        if (tileType === 0) {
          continue;
        }

        this.add.image(
          x * TILE_SIZE + TILE_SIZE / 2,
          y * TILE_SIZE + TILE_SIZE / 2,
          getTileName(tileType),
        );
      }
    }
  }

  handleInput(time: number) {
    let direction = "";

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      direction = "left";
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      direction = "right";
    } else if (this.cursors.up.isDown || this.wasd.W.isDown) {
      direction = "up";
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      direction = "down";
    }

    if (direction !== "") {
      this.room.send("move", { direction });
      this.playerMoveDebounce = time;
    }
  }
}
