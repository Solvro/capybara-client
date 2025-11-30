import { Scene } from "phaser";

export class MainScene extends Scene {
  constructor() {
    super("MainGame");
  }

  // Loading assets
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  preload() {}

  // Scene setup
  create() {
    this.add.text(512, 384, "Main Scene", {
      fontSize: "64px",
      color: "#ffffff",
    });
  }

  changeScene() {
    this.scene.start("Another Scene idk");
  }

  // Game loop
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update() {}
}
