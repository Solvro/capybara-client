import crate from "../assets/images/crate.png";
import ground from "../assets/images/ground.png";
import wall from "../assets/images/wall.png";

export const BlockTypes = {
  GROUND: 0,
  WALL: 1,
  CRATE: 2,
} as const;

export type BlockType = (typeof BlockTypes)[keyof typeof BlockTypes];

export const TILES = [ground, wall, crate];
