import type { SpriteAnimator } from "../lib/sprite-animator";
import { Entity } from "./entity";
import type { Direction } from "./entity";

export class Crate extends Entity {
  public readonly crateId: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    crateId: number,
    textureKey = "crate",
    animator: SpriteAnimator | null = null,
  ) {
    super(scene, x, y, textureKey, animator);
    this.crateId = crateId.toString();
  }

  move(direction: Direction, ease = "Circular") {
    super.move(direction, ease);
  }

  public get id(): string {
    return this.crateId;
  }
}
