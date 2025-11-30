import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/button";
import { ErrorContainer } from "../components/error-container";
import { Input } from "../components/input";
import { IntroContainer } from "../components/intro-container";
import { TitleHeader } from "../components/title-header";
import { useRoom } from "../lib/use-room";

export function Intro() {
  const navigate = useNavigate();
  const { connect } = useRoom();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
