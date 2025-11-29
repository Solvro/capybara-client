import { Dialog, DialogPanel } from "@headlessui/react";
import type { ReactNode } from "react";

interface MinigameProps {
  isOpen: boolean;
  closeMinigame: () => void;
  finishMinigame: () => void;
  minigame: ReactNode;
}

export function Minigame({
  isOpen,
  closeMinigame,
  minigame,
  finishMinigame: finishGame,
}: MinigameProps) {
  return (
    <Dialog open={isOpen} onClose={closeMinigame} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-120 w-full rounded-xl bg-amber-500/95 p-8">
          <div className="flex flex-col items-center gap-4">
            <p>Hello</p>
            {minigame}
            <button onClick={finishGame}>Finish</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
