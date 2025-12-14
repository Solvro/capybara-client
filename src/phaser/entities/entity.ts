import { TILE_SIZE } from "../lib/const";

type Direction = "left" | "right" | "up" | "down";

export class Entity extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  protected gridX: number;
  protected gridY: number;

  constructor(
    scene: Phaser.Scene,
    gridX: number,
    gridY: number,
    textureKey = "player",
  ) {
    super(scene);

    this.gridX = gridX;
    this.gridY = gridY;

    this.sprite = this.scene.add.sprite(0, 0, textureKey);
    this.add(this.sprite);

    this.setPosition(
      this.gridX * TILE_SIZE + TILE_SIZE / 2,
      this.gridY * TILE_SIZE + TILE_SIZE / 2,
    );
  }

  move(direction: Direction, ease = "Linear") {
    switch (direction) {
      case "left": {
        this.gridX -= 1;
        break;
      }
      case "right": {
        this.gridX += 1;
        break;
      }
      case "up": {
        this.gridY -= 1;
        break;
      }
      case "down": {
        this.gridY += 1;
        break;
      }
    }

    const targetX = this.gridX * TILE_SIZE + TILE_SIZE / 2;
    const targetY = this.gridY * TILE_SIZE + TILE_SIZE / 2;

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: 140,
      ease,
      onComplete: () => {
        this.setPosition(targetX, targetY);
      },
    });
  }
}
