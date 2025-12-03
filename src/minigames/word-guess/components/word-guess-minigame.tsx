import { useEffect } from "react";

import type { MinigameComponentProps } from "../../../types/minigames/minigame-components-props";
import { useWordGuess } from "../hooks/use-word-guess";
import type { WordGuessWord } from "../types/word-guess-word";
import { WordGuessTile } from "./word-guess_tile";

const mockWords: WordGuessWord[] = [
  {
    word: "SOLVRO",
    initial: "SOL__O",
  },
];

export function WordGuessMinigame({
  completeMinigame,
}: MinigameComponentProps) {
  const { letters, setGuess, isComplete } = useWordGuess(mockWords[0]);

  const handleKeyPress = (event: KeyboardEvent) => {
    setGuess(event.key);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    console.log(isComplete);
    if (isComplete) {
      completeMinigame();
    }
  }, [isComplete]);

  return (
    <div className="flex gap-4">
      {letters.map((letter, index) => (
        <WordGuessTile letter={letter} key={index} />
      ))}
    </div>
  );
}
