import { CELL_SIZE } from "../../constants/global";

export class PlayerEntity extends Phaser.GameObjects.Container {
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
