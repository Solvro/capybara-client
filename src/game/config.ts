import { AUTO } from "phaser";

import { Boot } from "./scenes/boot";
import { MainScene } from "./scenes/main-scene";
import { Preloader } from "./scenes/preloader";

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 640,
  height: 448,
  pixelArt: true,
  render: { antialias: false },
  parent: "game-container",
  backgroundColor: "#028af8",
  scene: [Boot, Preloader, MainScene],
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
};
