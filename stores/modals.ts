import { create } from "zustand";
import type { ModalName } from "@/lib/search";

// NAVIGATION §7.1 — only one modal open at a time; opening B closes A.
interface ModalState {
  active: ModalName | null;
  open: (name: ModalName) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  active: null,
  open: (name) => set({ active: name }),
  close: () => set({ active: null }),
}));
