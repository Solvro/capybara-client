import { Mechanic } from "./mechanic";

export class Door extends Mechanic {
  public readonly doorId: string;
  public readonly color: string;
  private openTextureKey: string;
  private closedTextureKey: string;
  private open: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    doorId: string,
    color: string,
    open = false,
    openTextureKey = "door-open",
    closedTextureKey = "door-closed",
  ) {
    super(scene, x, y, open ? openTextureKey : closedTextureKey);
    this.doorId = doorId;
    this.color = color;
    this.open = open;
    this.openTextureKey = openTextureKey;
    this.closedTextureKey = closedTextureKey;
  }

  public get id(): string {
    return this.doorId;
  }

  public get isOpen(): boolean {
    return this.open;
  }

  public set isOpen(value: boolean) {
    this.open = value;
    const textureKey = this.open ? this.openTextureKey : this.closedTextureKey;
    this.changeTexture(textureKey);
  }
}
