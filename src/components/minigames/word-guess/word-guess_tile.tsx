import type { WordGuessLetter } from "../../../minigames/word-guess/types/word-guess-letter";

interface WordGuessTileProps {
  letter: WordGuessLetter;
}

export function WordGuessTile({ letter }: WordGuessTileProps) {
  console.log(`${letter.letter} ${letter.guess}`);
  return (
    <div className="h-16 w-12 text-center text-6xl">
      {letter.isCovered ? (
        letter.guess ? (
          <h2
            className={
              letter.letter === letter.guess ? "text-green-600" : "text-red-600"
            }
          >
            {letter.guess}
          </h2>
        ) : (
          <h2>_</h2>
        )
      ) : (
        letter.letter
      )}
    </div>
  );
}
