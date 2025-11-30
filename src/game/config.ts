import { AUTO } from "phaser";

import { Boot } from "./scenes/boot";
import { MainScene } from "./scenes/main-scene";
import { Preloader } from "./scenes/preloader";

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#028af8",
  scene: [Boot, Preloader, MainScene],
};
