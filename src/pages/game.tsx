import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/button";
import { PhaserGame } from "../components/phaser-game";
import { useRoom } from "../lib/use-room";

export function Game() {
  const { room, isConnected, joinError, disconnect, isReconnecting } =
    useRoom();
  const [showTimeoutError, setShowTimeoutError] = useState(false);
  const navigate = useNavigate();

  // If there's no room, no reconnection in progress, and no error yet,
  // redirect to intro page so user can enter their name
  useEffect(() => {
    if (room !== null || isConnected || isReconnecting || joinError) {
      return;
    }
    // Small delay to allow reconnection to start if it's going to
    const timer = setTimeout(() => {
      void navigate("/", { replace: true });
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [room, isConnected, isReconnecting, joinError, navigate]);

  useEffect(() => {
    // If we are already connected or have a join error, no need for timeout
    if (room !== null && isConnected) {
      return;
    }
    if (joinError) {
      return;
    }

    const timer = setTimeout(() => {
      setShowTimeoutError(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [room, isConnected, joinError]);

  if (joinError || showTimeoutError) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div>
          {joinError
            ? "Error joining room."
            : "Connection timed out. Server might be unreachable."}
        </div>
        <Button
          disabled={false}
          onClick={async () => {
            await disconnect();
            await navigate("/");
          }}
        >
          Back to Main Menu
        </Button>
      </div>
    );
  }

  if (room === null || !isConnected) {
    return <div>Connecting to the game server...</div>;
  }

  return (
    <div className="flex h-[560px] w-[800px] items-center justify-center overflow-hidden rounded-2xl bg-amber-200">
      <PhaserGame room={room} />
    </div>
  );
}
