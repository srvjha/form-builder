"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Brix } from "./brix";
import { SpeechBubble } from "./speech-bubble";
import { useMascotStore } from "@/stores/mascot-store";

/**
 * Small floating Brix that lives in the bottom-right corner of the app.
 * Reacts to global mascot-store state changes triggered by app actions.
 */
export function FloatingMascot() {
  const { brixState, message } = useMascotStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {message && (
          <div className="pointer-events-auto">
            <SpeechBubble key={message} message={message} tail="bottom-right" />
          </div>
        )}
      </AnimatePresence>

      {/* Character */}
      <motion.div
        className="pointer-events-auto relative"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -left-2 z-10 flex h-5 w-5 items-center justify-center border-2 border-[#0A0A0A] bg-white opacity-0 hover:opacity-100 transition-opacity"
          aria-label="Hide Brix"
        >
          <X className="h-2.5 w-2.5" />
        </button>

        <Brix state={brixState} size={72} />
      </motion.div>
    </div>
  );
}
