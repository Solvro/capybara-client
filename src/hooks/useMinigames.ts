import { type ReactNode, useState } from "react";

type MinigameStatus = "idle" | "running" | "completed" | "closed";

export function useMinigames() {
  const [status, setStatus] = useState<MinigameStatus>("idle");
  const [currentMinigame, setCurrentMinigame] = useState<ReactNode>("");

  const openMinigame = (content: ReactNode) => {
    setCurrentMinigame(content);
    setStatus("running");
  };

  const finishMinigame = () => {
    setStatus("completed");
  };

  const closeMinigame = () => {
    setStatus("closed");
  };

  const resetMinigame = () => {};

  return {
    isOpen: status === "running",
    isCompleted: status === "completed",
    isClosed: status === "closed",
    currentMinigame,
    openMinigame,
    finishMinigame,
    closeMinigame,
    resetMinigame,
  };
}
