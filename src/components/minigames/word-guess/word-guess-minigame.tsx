import { useEffect } from "react";

import { useWordGuess } from "../../../hooks/minigames/word-guess/use-word-guess";
import type { MinigameComponentProps } from "../../../types/minigames/minigame-components-props";
import type { WordGuessWord } from "../../../types/minigames/word-guess/word-guess-word";
import { WordGuessTile } from "./word-guess_tile";

const mockWords: WordGuessWord[] = [
  {
    word: "SOLVRO",
    initial: "SOL__O",
    hintMessage: "Jak nazywa się nasze koło naukowe?",
  },
];

export function WordGuessMinigame({
  completeMinigame,
}: MinigameComponentProps) {
  const { letters, mistakes, setGuess, isComplete } = useWordGuess(
    mockWords[0],
  );

  const handleKeyPress = (event: KeyboardEvent) => {
    setGuess(event.key);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (isComplete) {
      completeMinigame();
    }
  }, [isComplete]);

  return (
    <div className="relative h-full w-full">
      <h3 className="absolute top-1 right-1">Mistakes: {mistakes}/5</h3>
      <div className="flex h-full flex-col items-center justify-center gap-8">
        <h2 className="text-xl">Guess hidden letters</h2>
        <div className="flex gap-8">
          {letters.map((letter, index) => (
            <WordGuessTile letter={letter} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
