import { Room } from "colyseus.js";

let room: Room | null = null;

export function setRoom(r: Room) {
  room = r;
}

export function getRoom() {
  return room;
}

export function fireLaser(payload: {
  start?: { x: number; y: number };
  dir: { dx: number; dy: number };
  color?: string;
}) {
  if (!room) {
    console.warn("room not set");
    return;
  }
  room.send("toggle_laser", payload);
}

export function on(event: string, handler: any) {
  if (!room) {
    return;
  }
  room.onMessage(event, handler);
}
