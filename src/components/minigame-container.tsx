import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

import type { Minigame } from "../types/minigames/minigame";

interface MinigameProps {
  minigame: Minigame | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MinigameContainer({
  minigame,
  isOpen,
  onClose,
}: MinigameProps) {
  if (!minigame) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-450"
            enterFrom="opacity-0 translate-y-5 scale-90"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-550"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-8 scale-90"
          >
            <DialogPanel className="mx-120 w-full rounded-xl bg-linear-to-br from-cyan-400/95 via-teal-500/95 to-emerald-600/95 p-8 shadow-xl">
              <div className="flex flex-col items-center gap-4 text-white">
                {minigame.content}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
