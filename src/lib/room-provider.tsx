import { Client } from "colyseus.js";
import type { Room } from "colyseus.js";
import React, { useEffect, useState } from "react";

import { RoomContext } from "./use-room";

const client = new Client("ws://localhost:2567");

interface CachedReconnection {
  roomId: string;
  token: string;
}

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinError, setJoinError] = useState(false);

  const connect = async (playerName: string) => {
    try {
      const newRoom = await client.joinOrCreate("game_room", {
        name: playerName,
      });
      setRoom(newRoom);
      setIsConnected(true);
      localStorage.setItem(
        "reconnection",
        JSON.stringify({
          roomId: newRoom.roomId,
          token: newRoom.reconnectionToken,
        }),
      );
    } catch (error) {
      console.error("Join error", error);
      setJoinError(true);
      throw error;
    }
  };

  useEffect(() => {
    const reconnect = async () => {
      const cached = localStorage.getItem("reconnection");
      if (cached !== null) {
        try {
          const parsed = JSON.parse(cached) as CachedReconnection;
          const { token } = parsed;

          const reconnected = await client.reconnect(token);
          setRoom(reconnected);
          setIsConnected(true);
        } catch {
          localStorage.removeItem("reconnection");
        }
      }
    };

    void reconnect();
  }, []);

  return (
    <RoomContext.Provider value={{ room, isConnected, joinError, connect }}>
      {children}
    </RoomContext.Provider>
  );
}
