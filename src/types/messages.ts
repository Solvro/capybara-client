import type { Player } from "../types/player";

export interface MessageMapInfo {
  grid: number[][];
  width: number;
  height: number;
  players: Player[];
}

export interface MessagePositionUpdate {
  playerName: string;
  position: { x: number; y: number };
}

export interface MessageOnAddPlayer {
  playerName: string;
  position: { x: number; y: number };
  index: number;
  sessionId: string;
}

export interface MessageOnRemovePlayer {
  playerName: string;
}

export interface MessageBoxDestroyed {
  hits: { type: "box"; x: number; y: number }[];
  color: string;
}
