import laserSource from "../assets/images/Temp_Laser.png";
import crate from "../assets/images/crate.png";
import ground from "../assets/images/ground.png";
import wall from "../assets/images/wall.png";

export const BlockTypes = {
  GROUND: 0,
  WALL: 1,
  LASER_SOURCE: 2,
  CRATE: 3,
} as const;

export type BlockType = (typeof BlockTypes)[keyof typeof BlockTypes];

export const TILES = [ground, wall, laserSource, crate];
