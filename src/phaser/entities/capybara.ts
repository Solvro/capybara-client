import { TILE_SIZE } from "../lib/const";
import { Entity } from "./entity";

export class Capybara extends Entity {
  private moveTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "capybara");
  }

  moveToGrid(gridX: number, gridY: number, duration = 200) {
    const targetX = gridX * TILE_SIZE + TILE_SIZE / 2;
    const targetY = gridY * TILE_SIZE + TILE_SIZE / 2;

    if (this.x === targetX && this.y === targetY) {
      return;
    }

    this.gridX = gridX;
    this.gridY = gridY;

    this.moveTween?.stop();
    this.moveTween = this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration,
      ease: "Linear",
      onComplete: () => {
        this.setPosition(targetX, targetY);
        this.moveTween = undefined;
      },
    });
  }
}
