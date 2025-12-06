import { Client } from "colyseus.js";
import type { Room } from "colyseus.js";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { RoomContext } from "./use-room";

const client = new Client("ws://localhost:2567");

const SESSION_KEY = "capybara_session";

interface SessionData {
  reconnectionToken: string;
  playerName: string;
  gameId: string;
}

function getSession(): SessionData | null {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    if (data === null) {
      return null;
    }
    return JSON.parse(data) as SessionData;
  } catch {
    return null;
  }
}

function saveSession(token: string, playerName: string, gameId: string): void {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ reconnectionToken: token, playerName, gameId }),
  );
}

function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Use ref to track the actual room instance (survives re-renders and closures)
  const roomRef = useRef<Room | null>(null);
  // Track if disconnect was intentional
  const intentionalDisconnectRef = useRef(false);
  // Track if we're currently connecting
  const connectingRef = useRef(false);

  // Helper to properly leave a room
  const leaveRoom = useCallback(
    async (roomToLeave: Room | null, consented: boolean) => {
      if (roomToLeave === null) {
        return;
      }
      try {
        await roomToLeave.leave(consented);
      } catch {
        // Ignore errors when leaving
      }
    },
    [],
  );

  const setupRoomHandlers = useCallback(
    (activeRoom: Room, playerName: string, activeGameId: string) => {
      activeRoom.onMessage(
        "error",
        (payload: { code?: string; message?: string }) => {
          if (payload.code === "new_login") {
            intentionalDisconnectRef.current = true;
            clearSession();
            console.warn(
              payload.message ??
                "Disconnected: new login from another location",
            );
          } else if (payload.code === "name_taken") {
            // Name was taken - set error and disconnect
            intentionalDisconnectRef.current = true;
            clearSession();
            setJoinError(true);
            setJoinErrorMessage(payload.message ?? "Name is already taken");
            console.warn(payload.message ?? "Name is already taken");
          }
        },
      );

      activeRoom.onLeave(() => {
        // Only update state if this is still the current room
        if (roomRef.current === activeRoom) {
          roomRef.current = null;
          setRoom(null);
          setGameId(null);
          setIsConnected(false);

          if (intentionalDisconnectRef.current) {
            clearSession();
            intentionalDisconnectRef.current = false;
          }
        }
      });

      // Save session for reconnection
      saveSession(activeRoom.reconnectionToken, playerName, activeGameId);
    },
    [],
  );

  // Connect to a new game
  const connect = useCallback(
    async (playerName: string, targetGameId?: string) => {
      if (connectingRef.current) {
        console.warn("Connection already in progress");
        return;
      }

      connectingRef.current = true;
      setJoinError(false);
      setJoinErrorMessage(null);

      try {
        // Always leave any existing room first (using ref for reliable access)
        if (roomRef.current !== null) {
          intentionalDisconnectRef.current = true;
          await leaveRoom(roomRef.current, true);
          roomRef.current = null;
          setRoom(null);
          setIsConnected(false);
          setGameId(null);
        }

        // Clear any existing session
        clearSession();

        // Use provided gameId or generate a default one
        const finalGameId = targetGameId ?? "default";

        const newRoom = await client.joinOrCreate("game_room", {
          name: playerName,
          gameId: finalGameId,
        });
        roomRef.current = newRoom;
        setupRoomHandlers(newRoom, playerName, finalGameId);
        setRoom(newRoom);
        setGameId(finalGameId);
        setIsConnected(true);
      } catch (error) {
        console.error("Failed to join room:", error);
        setJoinError(true);
        throw error;
      } finally {
        connectingRef.current = false;
      }
    },
    [setupRoomHandlers, leaveRoom],
  );

  // Disconnect from current game
  const disconnect = useCallback(async () => {
    intentionalDisconnectRef.current = true;
    clearSession();

    const currentRoom = roomRef.current;
    roomRef.current = null;
    setRoom(null);
    setIsConnected(false);

    await leaveRoom(currentRoom, true);
  }, [leaveRoom]);

  // Try to reconnect on mount if we have a saved session
  useEffect(() => {
    const tryReconnect = async () => {
      const session = getSession();

      // Skip if no session, already have a room, or already connecting
      if (
        session === null ||
        roomRef.current !== null ||
        connectingRef.current
      ) {
        return;
      }

      connectingRef.current = true;
      setIsReconnecting(true);

      try {
        const reconnectedRoom = await client.reconnect(
          session.reconnectionToken,
        );
        roomRef.current = reconnectedRoom;
        setupRoomHandlers(reconnectedRoom, session.playerName, session.gameId);
        setRoom(reconnectedRoom);
        setGameId(session.gameId);
        setIsConnected(true);
      } catch (error) {
        console.error("Reconnection failed:", error);
        clearSession();
      } finally {
        connectingRef.current = false;
        setIsReconnecting(false);
      }
    };

    void tryReconnect();
  }, [setupRoomHandlers]);

  return (
    <RoomContext.Provider
      value={{
        room,
        gameId,
        isConnected,
        joinError,
        joinErrorMessage,
        isReconnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}
