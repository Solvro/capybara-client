import type { Room } from "colyseus.js";
import { createContext, useContext } from "react";

export interface RoomContextType {
  room: Room | null;
  gameId: string | null;
  isConnected: boolean;
  joinError: boolean;
  joinErrorMessage: string | null;
  isReconnecting: boolean;
  connect: (playerName: string, gameId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

export const RoomContext = createContext<RoomContextType>({
  room: null,
  gameId: null,
  isConnected: false,
  joinError: false,
  joinErrorMessage: null,
  isReconnecting: false,
  connect: async () => {
    /* placeholder */
  },
  disconnect: async () => {
    /* placeholder */
  },
});

export function useRoom() {
  return useContext(RoomContext);
}
