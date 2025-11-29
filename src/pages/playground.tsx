import { useEffect } from "react";

import { Minigame } from "../components/minigame";
import { BinMinigame } from "../components/minigames/bin/bin-minigame";
import { useMinigames } from "../hooks/useMinigames";

export function Playground() {
  let {
    currentMinigame,
    isOpen,
    isCompleted,
    isClosed,
    openMinigame,
    closeMinigame,
    completeMinigame,
    resetMinigame,
  } = useMinigames();

  useEffect(() => {
    if (isCompleted) {
      resetMinigame();
      alert("completed");
    } else if (isClosed) {
      resetMinigame();
      alert("closed");
    }
  }, [isCompleted, isClosed]);

  return (
    <div className="flex flex-col items-center">
      <h1>Welcome in playground</h1>
      <h2>It's place where you can test dev features</h2>

      <div className="mt-12 flex flex-col gap-4">
        <button
          onClick={() =>
            openMinigame(<BinMinigame completeMinigame={completeMinigame} />)
          }
        >
          Open bin minigame
        </button>
        <button onClick={() => openMinigame(<>Minigame 1</>)}>
          Open minigame 1
        </button>
        <button onClick={() => openMinigame(<>Minigame 2</>)}>
          Open minigame 2
        </button>
        <button onClick={() => openMinigame(<>Minigame 3</>)}>
          Open minigame 3
        </button>
      </div>

      <Minigame
        isOpen={isOpen}
        minigame={currentMinigame}
        closeMinigame={closeMinigame}
      />
    </div>
  );
}
