import type { Room } from "colyseus.js";
import { Scene } from "phaser";

// This scene exists solely to preload the assets
// required for the loading screen itself
export class Boot extends Scene {
  room!: Room;

  constructor() {
    super("Boot");
  }

  init() {
    if (!this.registry.has("room")) {
      throw new Error("Room not found in the registry");
    }
    this.room = this.registry.get("room") as Room;
  }

  preload() {
    this.load.image("ground", "images/ground.png");
  }

  create() {
    this.scene.start("Preloader");
  }
}
