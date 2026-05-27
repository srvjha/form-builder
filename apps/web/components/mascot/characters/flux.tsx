"use client";

/**
 * Flux — The Messenger
 * Short, squat, red block cap, paper-airplane motif.
 * Shows up on publish, share, and deployment pages.
 */

import { motion, AnimatePresence } from "framer-motion";
import type { BrixState } from "@/stores/mascot-store";

interface FluxProps {
  state?: BrixState;
  size?: number;
  className?: string;
}

const S   = "#0A0A0A";
const SW  = 3;
const BG  = "#F5F0E8";
const R   = "#FF3B00"; // red — Flux's colour
const W   = "white";
const Y   = "#FFD600";

type FaceExpr = {
  eyeLY: number; eyeLH: number;
  eyeRY: number; eyeRH: number;
  mouth: string;
  mode:  "normal" | "x";
};

const FACE: Record<BrixState, FaceExpr> = {
  idle:     { eyeLY: 48, eyeLH: 14, eyeRY: 48, eyeRH: 14, mouth: "34,78 56,78 78,78",   mode: "normal" },
  waving:   { eyeLY: 52, eyeLH: 8,  eyeRY: 52, eyeRH: 8,  mouth: "32,76 56,68 80,76",   mode: "normal" },
  excited:  { eyeLY: 44, eyeLH: 18, eyeRY: 44, eyeRH: 18, mouth: "30,82 56,66 82,82",   mode: "normal" },
  thinking: { eyeLY: 52, eyeLH: 8,  eyeRY: 48, eyeRH: 14, mouth: "34,76 56,73 78,75",   mode: "normal" },
  success:  { eyeLY: 54, eyeLH: 5,  eyeRY: 54, eyeRH: 5,  mouth: "28,84 56,64 84,84",   mode: "normal" },
  error:    { eyeLY: 48, eyeLH: 14, eyeRY: 48, eyeRH: 14, mouth: "32,72 56,82 80,72",   mode: "x"      },
};

const ARMS: Record<BrixState, { left: number | number[]; right: number | number[] }> = {
  idle:     { left: 8,    right: -8    },
  waving:   { left: 8,    right: [-20, -155, -20] },
  excited:  { left: -145, right: 145  },
  thinking: { left: -45,  right: -8   },
  success:  { left: -160, right: 160  },
  error:    { left: 15,   right: -15  },
};

export function Flux({ state = "idle", size = 180, className }: FluxProps) {
  const face = FACE[state];
  const arms = ARMS[state];
  const h    = (size / 112) * 220;
  const showPlane = state === "excited" || state === "success" || state === "waving";

  return (
    <svg
      viewBox="0 0 112 220"
      width={size}
      height={h}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      {/* ── Paper airplane (animated on excited/success) ─────── */}
      <AnimatePresence>
        {showPlane && (
          <motion.g
            key="plane"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: 40, y: -35, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", repeat: Infinity, repeatDelay: 1.2 }}
          >
            {/* simple triangular paper plane */}
            <polygon points="110,20 88,28 95,22" fill={W} stroke={S} strokeWidth={2} />
            <polygon points="110,20 88,28 94,34" fill={Y} stroke={S} strokeWidth={2} />
            <line x1="95" y1="22" x2="94" y2="34" stroke={S} strokeWidth={1.5} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* ── Block cap (red) ─────────────────────────────────── */}
      {/* bill / brim */}
      <rect x="6"  y="22" width="100" height="10" fill={R} stroke={S} strokeWidth={SW} />
      {/* dome */}
      <rect x="20" y="4"  width="72"  height="22" fill={R} stroke={S} strokeWidth={SW} />
      {/* cap button on top */}
      <rect x="50" y="2"  width="12"  height="6"  fill={Y} stroke={S} strokeWidth={2}  />

      {/* ── Head (shorter, wider — stocky) ──────────────────── */}
      <rect x="14" y="30" width="84"  height="64" fill={BG} stroke={S} strokeWidth={SW} />

      {/* ── Eyes ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {face.mode === "normal" ? (
          <motion.g key={`eyes-${state}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            <motion.rect x="26" width="18" fill={S} animate={{ y: face.eyeLY, height: face.eyeLH }} transition={{ duration: 0.18 }} />
            <motion.rect x="68" width="18" fill={S} animate={{ y: face.eyeRY, height: face.eyeRH }} transition={{ duration: 0.18 }} />
            {face.eyeLH >= 10 && <motion.rect x="28" width="5" height="5" fill={W} animate={{ y: face.eyeLY + 2 }} transition={{ duration: 0.18 }} />}
            {face.eyeRH >= 10 && <motion.rect x="70" width="5" height="5" fill={W} animate={{ y: face.eyeRY + 2 }} transition={{ duration: 0.18 }} />}
          </motion.g>
        ) : (
          <motion.g key="eyes-x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            <line x1="26" y1="48" x2="44" y2="64" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="44" y1="48" x2="26" y2="64" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="68" y1="48" x2="86" y2="64" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="86" y1="48" x2="68" y2="64" stroke={S} strokeWidth={SW} strokeLinecap="square" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* ── Mouth ───────────────────────────────────────────── */}
      <motion.polyline
        stroke={S} strokeWidth={SW} strokeLinecap="square" strokeLinejoin="miter" fill="none"
        animate={{ points: face.mouth } as any}
        transition={{ duration: 0.2 }}
      />

      {/* ── Neck ────────────────────────────────────────────── */}
      <rect x="42" y="94"  width="28" height="12" fill={BG} stroke={S} strokeWidth={SW} />

      {/* ── Body (wide, squat) ──────────────────────────────── */}
      <rect x="8"  y="106" width="96" height="70" fill={BG} stroke={S} strokeWidth={SW} />

      {/* red badge */}
      <rect x="20" y="118" width="72" height="34" fill={R} stroke={S} strokeWidth={2} />
      <text x="56" y="133" textAnchor="middle" fill={W} fontFamily="monospace" fontWeight="700" fontSize="8" letterSpacing="2">SEND</text>
      <text x="56" y="146" textAnchor="middle" fill={W} fontFamily="monospace" fontWeight="700" fontSize="8" letterSpacing="1">&amp; SHIP</text>

      {/* ── Left arm ─────────────────────────────────────────── */}
      <motion.rect x="-4" y="110" width="16" height="48" fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.left }} transition={{ duration: 0.45, ease: "easeOut" }}
      />
      <motion.rect x="-8" y="152" width="24" height="12" fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.left }} transition={{ duration: 0.45, ease: "easeOut" }}
      />

      {/* ── Right arm ────────────────────────────────────────── */}
      <motion.rect x="100" y="110" width="16" height="48" fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.right }}
        transition={{ duration: state === "waving" ? 0.55 : 0.45, ease: "easeInOut", repeat: state === "waving" ? Infinity : 0, repeatType: "loop" }}
      />
      <motion.rect x="96" y="152" width="24" height="12" fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.right }}
        transition={{ duration: state === "waving" ? 0.55 : 0.45, ease: "easeInOut", repeat: state === "waving" ? Infinity : 0, repeatType: "loop" }}
      />

      {/* ── Legs (stubby) ───────────────────────────────────── */}
      <rect x="20" y="176" width="30" height="24" fill={BG} stroke={S} strokeWidth={SW} />
      <rect x="62" y="176" width="30" height="24" fill={BG} stroke={S} strokeWidth={SW} />
      <rect x="12" y="196" width="42" height="10" fill={BG} stroke={S} strokeWidth={SW} />
      <rect x="58" y="196" width="42" height="10" fill={BG} stroke={S} strokeWidth={SW} />
    </svg>
  );
}
