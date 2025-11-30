import { PhaserGame } from "../components/phaser-game";
import { useRoom } from "../lib/use-room";

export function Game() {
  const { room, isConnected, joinError } = useRoom();

  if (joinError) {
    return <div>Error joining room.</div>;
  }
  if (room === null || !isConnected) {
    return <div>Connecting to the game server...</div>;
  }

  return (
    <div className="flex h-[600px] w-[800px] items-center justify-center">
      <PhaserGame room={room} />
    </div>
  );
}
