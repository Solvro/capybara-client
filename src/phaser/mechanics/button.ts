import { Mechanic } from "./mechanic";

export class Button extends Mechanic {
  public readonly buttonId: string;
  public readonly color: string;
  private pressed: boolean;
  private pressedTextureKey: string;
  private releasedTextureKey: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    buttonId: string,
    color: string,
    pressed = false,
    pressedTextureKey = "button-pressed",
    releasedTextureKey = "button-released",
  ) {
    super(scene, x, y, pressed ? pressedTextureKey : releasedTextureKey);
    this.buttonId = buttonId;
    this.color = color;
    this.pressed = pressed;
    this.pressedTextureKey = pressedTextureKey;
    this.releasedTextureKey = releasedTextureKey;
  }

  public get id(): string {
    return this.buttonId;
  }

  public get isPressed(): boolean {
    return this.pressed;
  }

  public set isPressed(value: boolean) {
    this.pressed = value;
    const textureKey = this.pressed
      ? this.pressedTextureKey
      : this.releasedTextureKey;
    this.changeTexture(textureKey);
  }
}
