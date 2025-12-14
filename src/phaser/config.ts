import { AUTO } from "phaser";

import { Main } from "./scenes/main";

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 640,
  height: 448,
  pixelArt: true,
  render: {
    antialias: false,
    pixelArt: true,
    antialiasGL: false,
    roundPixels: true,
  },
  parent: "game-container",
  backgroundColor: "#000000",
  scene: [Main],
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
};
