"use client";

import { motion } from "framer-motion";

interface SpeechBubbleProps {
  message: string;
  /** Where the tail points. Defaults to "bottom" (character below bubble). */
  tail?: "bottom" | "bottom-right" | "bottom-left" | "right" | "left";
  className?: string;
}

const TAIL_CLASSES: Record<NonNullable<SpeechBubbleProps["tail"]>, string> = {
  "bottom":       "left-1/2 -translate-x-1/2 -bottom-[13px] border-b-[3px] border-r-[3px]",
  "bottom-right": "right-6 -bottom-[13px] border-b-[3px] border-r-[3px]",
  "bottom-left":  "left-6 -bottom-[13px] border-b-[3px] border-r-[3px]",
  "right":        "top-4 -right-[13px] border-t-[3px] border-r-[3px]",
  "left":         "top-4 -left-[13px] border-t-[3px] border-l-[3px]",
};

export function SpeechBubble({ message, tail = "bottom", className }: SpeechBubbleProps) {
  return (
    <motion.div
      className={`relative inline-block ${className ?? ""}`}
      initial={{ opacity: 0, y: 6, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit={{    opacity: 0, y: 4,  scale: 0.96  }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* bubble body */}
      <div
        className="border-[3px] border-[#0A0A0A] bg-white px-4 py-3"
        style={{ boxShadow: "4px 4px 0 #0A0A0A" }}
      >
        <p className="font-display text-xs font-extrabold uppercase tracking-widest text-[#0A0A0A] whitespace-nowrap">
          {message}
        </p>
      </div>

      {/* tail — rotated square creates a brutalist arrow */}
      <div
        className={`absolute h-5 w-5 rotate-45 bg-white border-[#0A0A0A] ${TAIL_CLASSES[tail]}`}
      />
    </motion.div>
  );
}
