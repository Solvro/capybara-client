import { TILE_SIZE } from "../lib/const";

export class Mechanic extends Phaser.GameObjects.Container {
  protected sprite: Phaser.GameObjects.Sprite;
  protected gridX: number;
  protected gridY: number;

  constructor(
    scene: Phaser.Scene,
    gridX: number,
    gridY: number,
    textureKey = "door",
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

  public changeTexture(textureKey: string) {
    this.sprite.setTexture(textureKey);
  }
}
