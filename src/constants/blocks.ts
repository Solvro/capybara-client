import crate from "/images/crate.png";
import ground from "/images/ground.png";
import wall from "/images/wall.png";

export const BlockTypes = {
  GROUND: 0,
  WALL: 1,
  CRATE: 2,
} as const;

export type BlockType = (typeof BlockTypes)[keyof typeof BlockTypes];

export const TILES = [ground, wall, crate];
