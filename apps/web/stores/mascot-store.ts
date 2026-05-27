import { create } from "zustand";

export type BrixState = "idle" | "waving" | "excited" | "thinking" | "success" | "error";

interface MascotStore {
  brixState: BrixState;
  message: string | null;
  /** Prevents idle cycling from overwriting hover-triggered messages */
  locked: boolean;
  setState: (state: BrixState, message?: string | null, lock?: boolean) => void;
  reset: () => void;
  clearLock: () => void;
}

export const useMascotStore = create<MascotStore>((set) => ({
  brixState: "idle",
  message: null,
  locked: false,
  setState: (brixState, message = null, lock = false) =>
    set({ brixState, message, locked: lock }),
  reset: () => set({ brixState: "idle", message: null, locked: false }),
  clearLock: () => set({ locked: false }),
}));
