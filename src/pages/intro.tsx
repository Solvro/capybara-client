import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/button";
import { ErrorContainer } from "../components/error-container";
import { Input } from "../components/input";
import { IntroContainer } from "../components/intro-container";
import { TitleHeader } from "../components/title-header";
import { useRoom } from "../lib/use-room";

export function Intro() {
  const navigate = useNavigate();
  const { connect, disconnect, isReconnecting, room } = useRoom();

  // ui states
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "rejoining"
  >("idle");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // room rejoin timeout
  const [countdown, setCountdown] = useState(3);

  // keep local status in sync with provider-driven reconnection state
  // The countdown UI depends on provider-driven reconnection transitions.
  // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
  useEffect(() => {
    if (isReconnecting) {
      setStatus("rejoining");
      return;
    }

    if (status !== "rejoining") {
      return;
    }

    if (room !== null) {
      return;
    }

    setStatus("idle");
    setCountdown(3);
  }, [isReconnecting, status, room]);

  // handle timer and redirect
  useEffect(() => {
    // if already handling the rejoin
    if (status !== "rejoining") {
      return;
    }

    // if the player does not cancel, redirect to the game
    if (countdown <= 0) {
      void navigate("/game");
      return;
    }

    // tick tock
    const timerId = setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    // clear this if player cancels
    return () => {
      clearTimeout(timerId);
    };
  }, [status, countdown, navigate]);

  // remove the room connection and go back to 'base state'
  const handleCancelRejoin = async () => {
    await disconnect();
    setStatus("idle");
    setCountdown(3);
  };

  const handlePlay = async () => {
    if (name.trim() === "") {
      return;
    }

    setStatus("loading");
    try {
      await connect(name.trim());
      await navigate("/game");
    } catch {
      setErrorMessage("Wystąpił błąd. Spróbuj ponownie.");
      setStatus("error");
    }
  };

  return (
    <IntroContainer>
      <TitleHeader title="Capybara Escape" />

      {status === "rejoining" ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg text-amber-200">
            Found active session!
            <br />
            Rejoining in {countdown}...
          </p>
          <Button disabled={false} onClick={() => void handleCancelRejoin()}>
            Cancel (New Game)
          </Button>
        </div>
      ) : (
        <>
          <Input
            value={name}
            placeholder="Elek..."
            setValue={(value) => {
              setName(value.toUpperCase());
            }}
            disabled={status === "loading"}
          />

          <Button
            onClick={() => void handlePlay()}
            disabled={status === "loading" || name.trim() === ""}
          >
            {status === "loading" ? "Ładowanie..." : "Graj"}
          </Button>
        </>
      )}

      {status === "error" && <ErrorContainer errorMessage={errorMessage} />}
    </IntroContainer>
  );
}
