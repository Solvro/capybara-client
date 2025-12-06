import { Client } from "colyseus.js";
import type { Room } from "colyseus.js";
import React, { useEffect, useState } from "react";

import { RoomContext } from "./use-room";

const client = new Client("ws://localhost:2567");

interface CachedReconnection {
  roomId: string;
  token: string;
  playerId: string;
  playerName: string;
}

// Global flag to prevent double reconnection in Strict Mode
let isReconnecting = false;

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const connect = async (playerName: string) => {
    try {
      const newRoom = await client.joinOrCreate("game_room", {
        name: playerName,
      });
      setRoom(newRoom);
      setIsConnected(true);
      setPlayerId(crypto.randomUUID());
      localStorage.setItem(
        "reconnection",
        JSON.stringify({
          roomId: newRoom.roomId,
          token: newRoom.reconnectionToken,
          playerId,
          playerName,
        }),
      );
    } catch (error) {
      console.error("Join error", error);
      setJoinError(true);
      throw error;
    }
  };

  const disconnect = async () => {
    if (room !== null) {
      await room.leave();
      setRoom(null);
      setIsConnected(false);
      setPlayerId(null);
      localStorage.removeItem("reconnection");
    }
  };

  useEffect(() => {
    const reconnect = async () => {
      if (isReconnecting) {
        return;
      }

      const cached = localStorage.getItem("reconnection");
      if (cached !== null) {
        isReconnecting = true;
        try {
          const parsed = JSON.parse(cached) as CachedReconnection;
          const { token } = parsed;

          const reconnected = await client.reconnect(token);

          setRoom(reconnected);
          setIsConnected(true);

          // Update the token for future reconnections
          localStorage.setItem(
            "reconnection",
            JSON.stringify({
              roomId: reconnected.roomId,
              token: reconnected.reconnectionToken,
            }),
          );
        } catch (error) {
          console.error("Reconnection failed:", error);
          localStorage.removeItem("reconnection");
        } finally {
          isReconnecting = false;
        }
      }
    };

    void reconnect();
  }, []);

  return (
    <RoomContext.Provider
      value={{ room, isConnected, joinError, connect, disconnect }}
    >
      {children}
    </RoomContext.Provider>
  );
}
