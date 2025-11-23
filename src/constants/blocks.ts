import ground from "../assets/images/ground.png";
import wall from "../assets/images/wall.png";
import crate from "../assets/images/crate.png";

export const BlockType = {
  GROUND: 0,
  WALL: 1,
  CRATE: 2,
} as const;

export type BlockType = (typeof BlockType)[keyof typeof BlockType];

export const TILES = [ground, wall, crate];
