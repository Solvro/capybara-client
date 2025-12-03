import { useEffect } from "react";

import { useWordGuess } from "../../../minigames/word-guess/hooks/use-word-guess";
import type { WordGuessWord } from "../../../minigames/word-guess/types/word-guess-word";
import type { MinigameComponentProps } from "../../../types/minigames/minigame-components-props";
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
