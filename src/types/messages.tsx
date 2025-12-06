import type { Crate } from "../types/crate";
import type { Player } from "../types/player";
import type { Button } from "./button";
import type { Door } from "./door";

export interface MessageMapInfo {
  grid: number[][];
  width: number;
  height: number;
  players: Player[];
  crates: Crate[];
  buttons: Button[];
  doors: Door[];
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

export interface MessageCrateUpdate {
  crateId: string;
  position: { x: number; y: number };
}

export interface MessageDoorUpdate {
  doorId: string;
  position: { x: number; y: number };
  open: boolean;
}
