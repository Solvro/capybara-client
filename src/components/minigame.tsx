import { Dialog, DialogPanel } from "@headlessui/react";
import type { ReactNode } from "react";

interface MinigameProps {
  isOpen: boolean;
  closeMinigame: () => void;
  minigame: ReactNode;
}

export function Minigame({ isOpen, closeMinigame, minigame }: MinigameProps) {
  return (
    <Dialog open={isOpen} onClose={closeMinigame} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-120 w-full rounded-xl bg-linear-to-br from-amber-500/96 via-orange-500/95 to-rose-500/95 p-8">
          <div className="flex flex-col items-center gap-4 text-white">
            {minigame}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
