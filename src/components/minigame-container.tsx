import { Dialog, DialogPanel } from "@headlessui/react";

import type { Minigame } from "../types/minigames/minigame";

interface MinigameProps {
  minigame: Minigame;
  isOpen: boolean;
  onClose: () => void;
}

export function MinigameContainer({
  minigame,
  isOpen,
  onClose,
}: MinigameProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-120 w-full rounded-xl bg-linear-to-br from-amber-500/96 via-orange-500/95 to-rose-500/95 p-8">
          <div className="flex flex-col items-center gap-4 text-white">
            {minigame.content}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
