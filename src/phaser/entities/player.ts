import { CELL_SIZE } from "../../constants/global";
import type { SpriteAnimator } from "../lib/sprite-animator";
import { Entity } from "./entity";

export class Player extends Entity {
  public readonly name: string;
  public readonly sessionId: string;
  public readonly local: boolean;
  private nameText: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    sessionId: string,
    local = false,
    textureKey = "player",
    animator: SpriteAnimator | null = null,
  ) {
    super(scene, x, y, textureKey, animator);
    this.name = name;
    this.sessionId = sessionId;
    this.local = local;

    this.nameText = this.scene.add
      .text(0, -(CELL_SIZE / 2) - 4, name, {
        fontSize: "16px",
        color: local ? "#ffdd77" : "#fff",
        align: "center",
      })
      .setOrigin(0.5, 1);
    this.add(this.nameText);
  }

  public get playerName(): string {
    return this.name;
  }

  public get id(): string {
    return this.sessionId;
  }

  public get isLocal(): boolean {
    return this.local;
  }
}
