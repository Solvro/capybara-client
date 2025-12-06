import buttonImg from "../assets/images/buttons/button-red.png";
import crate from "../assets/images/crate.png";
import doorClosed from "../assets/images/doors/door-red-closed.png";
import doorOpen from "../assets/images/doors/door-red-open.png";
import ground from "../assets/images/ground.png";
import wall from "../assets/images/wall.png";

export const BlockTypes = {
  GROUND: 0,
  WALL: 1,
  CRATE: 2,
  CLOSED_DOOR: 3,
  OPEN_DOOR: 4,
} as const;

export type BlockType = (typeof BlockTypes)[keyof typeof BlockTypes];

export const TILES = [ground, wall, crate, doorClosed, doorOpen, buttonImg];
