"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brix } from "./brix";
import { SpeechBubble } from "./speech-bubble";
import { useMascotStore } from "@/stores/mascot-store";

/* Messages that cycle when Brix is in idle state */
const IDLE_MESSAGES = [
  "Build. Deploy. Collect.",
  "No lorem ipsum here.",
  "Your data. Your rules.",
  "Zero fluff, max data.",
  "Forms that mean business.",
];

interface MascotSceneProps {
  /** px height of Brix character */
  size?: number;
  /** Whether to show speech bubble */
  withBubble?: boolean;
  className?: string;
}

export function MascotScene({ size = 210, withBubble = true, className }: MascotSceneProps) {
  const { brixState, message, locked, setState } = useMascotStore();
  const [idleIdx, setIdleIdx] = useState(0);

  /* ── Wave-in on mount, then go idle ─────────────────────────── */
  useEffect(() => {
    setState("waving");
    const t = setTimeout(() => setState("idle"), 2600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Cycle idle messages every 4 s ──────────────────────────── */
  useEffect(() => {
    if (locked) return;
    const t = setInterval(
      () => setIdleIdx((i) => (i + 1) % IDLE_MESSAGES.length),
      4000,
    );
    return () => clearInterval(t);
  }, [locked]);

  /* Decide which message to show */
  const displayMessage: string = (locked && message) ? message : (IDLE_MESSAGES[idleIdx] ?? IDLE_MESSAGES[0]!);

  return (
    <div className={`flex flex-col items-center gap-6 ${className ?? ""}`}>
      {/* ── Speech bubble ─────────────────────────────────────── */}
      {withBubble && (
        <AnimatePresence mode="wait">
          <SpeechBubble
            key={displayMessage}
            message={displayMessage}
            tail="bottom"
          />
        </AnimatePresence>
      )}

      {/* ── Character with idle bob ───────────────────────────── */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        /* extra bounce on state change */
        key={brixState}
      >
        <Brix state={brixState} size={size} />
      </motion.div>
    </div>
  );
}
