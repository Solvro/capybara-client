import { Client } from "colyseus.js";
import type { Room } from "colyseus.js";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/button";
import { ErrorContainer } from "../components/error-container";
import { Input } from "../components/input";
import { IntroContainer } from "../components/intro-container";
import { TitleHeader } from "../components/title-header";
import { setRoom as setGlobalRoom } from "../roomClient";

export function Intro({ setRoom }: { setRoom: (room: Room) => void }) {
  const navigate = useNavigate();
  const roomRef = useRef<Room | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePlay = async () => {
    setStatus("loading");
    try {
      const client = new Client("ws://localhost:2567");
      const room = await client.joinOrCreate("game_room", { name });

      roomRef.current = room;
      setStatus("success");
      setRoom(room);
      setGlobalRoom(room);
      await navigate("/game");
    } catch (error) {
      setErrorMessage("Nie udało się dołaczyć do gry. Spróbuj ponownie.");
      console.error("Failed to join the game room:", error); // debug - remove line later before production
      setStatus("error");
    }
  };

  return (
    <IntroContainer>
      <TitleHeader title="Capybara Escape" />
      <Input
        value={name}
        placeholder="Elek..."
        setValue={(value) => {
          setName(value.toUpperCase());
        }}
        disabled={status === "loading"}
      />
      <Button
        onClick={handlePlay}
        disabled={status === "loading" || name.trim() === ""}
      >
        {status === "loading" ? "Ładowanie..." : "Graj"}
      </Button>
      {status === "error" && <ErrorContainer errorMessage={errorMessage} />}
    </IntroContainer>
  );
}
