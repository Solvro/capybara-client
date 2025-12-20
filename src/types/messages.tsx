import type { Crate } from "../types/crate";
import type { Player } from "../types/player";

export interface MessageMapInfo {
  grid: number[][];
  width: number;
  height: number;
  players: Player[];
  crates: Crate[];
}

export interface MessageCratesUpdate {
  crates: { crateId: number; direction: "left" | "right" | "up" | "down" }[];
}

export interface MessagePositionUpdate {
  sessionId: string;
  direction: "left" | "right" | "up" | "down";
}

export interface MessageOnAddPlayer {
  sessionId: string;
  playerName: string;
  position: { x: number; y: number };
  index: number;
}

export interface MessageOnRemovePlayer {
  sessionId: string;
}
