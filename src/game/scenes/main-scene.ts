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

// Helper class to group Sprite + Name Tag
class PlayerEntity extends Phaser.GameObjects.Container {
  public skinIndex: number;
  private sprite: Phaser.GameObjects.Sprite;
  private nameText: Phaser.GameObjects.Text;
  private targetX: number;
  private targetY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    name: string,
    isCurrentPlayer: boolean,
    skinIndex: number,
  ) {
    super(scene, x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
    this.targetX = x;
    this.targetY = y;
    this.skinIndex = skinIndex;

    // Create Sprite
    this.sprite = scene.add.sprite(0, 0, texture);
    this.sprite.setDisplaySize(CELL_SIZE * 0.9, CELL_SIZE * 0.9);

    // Create Name Tag
    this.nameText = scene.add.text(
      0,
      -CELL_SIZE / 2 - 10,
      isCurrentPlayer ? `${name} (You)` : name,
      {
        fontSize: "12px",
        color: "#ffffff",
        align: "center",
      },
    );
    this.nameText.setOrigin(0.5);

    this.add([this.sprite, this.nameText]);
    scene.add.existing(this);
  }

  public get playerName(): string {
    return this.nameText.text;
  }

  movePlayerTo(gridX: number, gridY: number) {
    // Determine animation key based on direction
    // direction logic: compare new gridX/Y with old
    let animKey = `player_${this.skinIndex.toString()}_front`; // default
    if (gridY < this.targetY) {
      animKey = `player_${this.skinIndex.toString()}_back`;
    } else if (gridY > this.targetY) {
      animKey = `player_${this.skinIndex.toString()}_front`;
    } else if (gridX < this.targetX) {
      animKey = `player_${this.skinIndex.toString()}_left`;
    } else if (gridX > this.targetX) {
      animKey = `player_${this.skinIndex.toString()}_right`;
    }

    this.sprite.play(animKey, true);

    this.targetX = gridX;
    this.targetY = gridY;

    // Tween for smooth movement (replaces CSS transition)
    this.scene.tweens.add({
      targets: this,
      x: gridX * CELL_SIZE + CELL_SIZE / 2,
      y: gridY * CELL_SIZE + CELL_SIZE / 2,
      duration: 160, // Matches the 160ms CSS transition
      ease: "Linear",
    });
  }
}

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
        if (!this.players.has(message.playerName)) {
          this.addPlayer(
            message.sessionId,
            message.playerName,
            message.position.x,
            message.position.y,
            message.index,
            message.sessionId === room.sessionId,
          );
        }
      });

      room.onMessage("onRemovePlayer", (message: MessageOnRemovePlayer) => {
        // Based on React code, it filters by name. Let's find the entity by name.
        // Ideally, server should send sessionId for removal too.
        // For now, let's iterate values to find the name.
        for (const [id, entity] of this.players.entries()) {
          if (entity.playerName.startsWith(message.playerName)) {
            entity.destroy();
            this.players.delete(id);
            break;
          }
        }
      });

      room.onMessage("positionUpdate", (message: MessagePositionUpdate) => {
        // Find player by name (React code used name)
        for (const entity of this.players.values()) {
          if (entity.playerName.startsWith(message.playerName)) {
            entity.movePlayerTo(message.position.x, message.position.y);
          }
        }
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
        const tile = this.add.image(
          x * CELL_SIZE + CELL_SIZE / 2,
          y * CELL_SIZE + CELL_SIZE / 2,
          `tile_${tileType.toString()}`,
        );
        tile.setDisplaySize(CELL_SIZE, CELL_SIZE);
        tile.setDepth(0); // Background
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
  }
}
