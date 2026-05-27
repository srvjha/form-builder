"use client";

/**
 * Rex — The Analyst
 * Tall, thin, square glasses, flat-top hair, green badge.
 * Shows up on analytics, responses, and data pages.
 */

import { motion, AnimatePresence } from "framer-motion";
import type { BrixState } from "@/stores/mascot-store";

interface RexProps {
  state?: BrixState;
  size?: number;
  className?: string;
}

const S   = "#0A0A0A";
const SW  = 3;
const BG  = "#F5F0E8";
const G   = "#00C853"; // green — Rex's colour
const W   = "white";

type FaceExpr = {
  eyeLY: number; eyeLH: number;
  eyeRY: number; eyeRH: number;
  mouth: string;
  mode:  "normal" | "x";
};

const FACE: Record<BrixState, FaceExpr> = {
  idle:     { eyeLY: 52, eyeLH: 10, eyeRY: 52, eyeRH: 10, mouth: "34,84 58,84 82,84",    mode: "normal" },
  waving:   { eyeLY: 55, eyeLH: 6,  eyeRY: 55, eyeRH: 6,  mouth: "34,82 58,76 82,82",    mode: "normal" },
  excited:  { eyeLY: 48, eyeLH: 16, eyeRY: 48, eyeRH: 16, mouth: "32,88 58,72 84,88",    mode: "normal" },
  thinking: { eyeLY: 54, eyeLH: 7,  eyeRY: 50, eyeRH: 12, mouth: "34,83 58,80 82,82",    mode: "normal" },
  success:  { eyeLY: 56, eyeLH: 5,  eyeRY: 56, eyeRH: 5,  mouth: "30,90 58,70 86,90",    mode: "normal" },
  error:    { eyeLY: 52, eyeLH: 10, eyeRY: 52, eyeRH: 10, mouth: "32,79 58,88 84,79",    mode: "x"      },
};

const ARMS: Record<BrixState, { left: number | number[]; right: number | number[] }> = {
  idle:     { left: -10, right: 10  },
  waving:   { left: -10, right: [-20, -155, -20] },
  excited:  { left: -140, right: 140 },
  thinking: { left: -50,  right: 10  },
  success:  { left: -155, right: 155 },
  error:    { left: 15,   right: -15 },
};

export function Rex({ state = "idle", size = 200, className }: RexProps) {
  const face = FACE[state];
  const arms = ARMS[state];
  const h = (size / 106) * 236;

  return (
    <svg
      viewBox="0 0 106 236"
      width={size}
      height={h}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      {/* ── Flat-top hair block ─────────────────────────────── */}
      <rect x="18" y="2"  width="70" height="24" fill={S}   stroke={S} strokeWidth={2} />
      {/* hair sides */}
      <rect x="14" y="14" width="8"  height="12" fill={S} />
      <rect x="84" y="14" width="8"  height="12" fill={S} />

      {/* ── Head (taller, thinner than Brix) ───────────────── */}
      <rect x="14" y="22" width="78" height="74" fill={BG} stroke={S} strokeWidth={SW} />

      {/* ── Glasses ────────────────────────────────────────── */}
      {/* left lens */}
      <rect x="18" y="42" width="28" height="20" fill={W}  stroke={S} strokeWidth={4}  />
      {/* right lens */}
      <rect x="60" y="42" width="28" height="20" fill={W}  stroke={S} strokeWidth={4}  />
      {/* bridge */}
      <line x1="46" y1="52" x2="60" y2="52" stroke={S} strokeWidth={SW} />
      {/* temples */}
      <line x1="18"  y1="52" x2="10"  y2="48" stroke={S} strokeWidth={SW} />
      <line x1="88"  y1="52" x2="96"  y2="48" stroke={S} strokeWidth={SW} />

      {/* ── Eyes (inside lenses) ────────────────────────────── */}
      <AnimatePresence mode="wait">
        {face.mode === "normal" ? (
          <motion.g key={`eyes-${state}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            <motion.rect x="24" width="16" fill={S} animate={{ y: face.eyeLY, height: face.eyeLH }} transition={{ duration: 0.18 }} />
            <motion.rect x="66" width="16" fill={S} animate={{ y: face.eyeRY, height: face.eyeRH }} transition={{ duration: 0.18 }} />
            {face.eyeLH >= 8 && <motion.rect x="26" width="4" height="4" fill={W} animate={{ y: face.eyeLY + 2 }} transition={{ duration: 0.18 }} />}
            {face.eyeRH >= 8 && <motion.rect x="68" width="4" height="4" fill={W} animate={{ y: face.eyeRY + 2 }} transition={{ duration: 0.18 }} />}
          </motion.g>
        ) : (
          <motion.g key="eyes-x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            <line x1="20" y1="44" x2="44" y2="60" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="44" y1="44" x2="20" y2="60" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="62" y1="44" x2="86" y2="60" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="86" y1="44" x2="62" y2="60" stroke={S} strokeWidth={SW} strokeLinecap="square" />
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
      <rect x="40" y="96"  width="26" height="12" fill={BG} stroke={S} strokeWidth={SW} />

      {/* ── Body (narrower) ─────────────────────────────────── */}
      <rect x="12" y="108" width="82" height="72" fill={BG} stroke={S} strokeWidth={SW} />

      {/* green analyst badge */}
      <rect x="22" y="120" width="62" height="34" fill={G} stroke={S} strokeWidth={2} />
      <text x="53" y="135" textAnchor="middle" fill={W} fontFamily="monospace" fontWeight="700" fontSize="8" letterSpacing="2">ANALY</text>
      <text x="53" y="148" textAnchor="middle" fill={W} fontFamily="monospace" fontWeight="700" fontSize="8" letterSpacing="2">TICS</text>

      {/* clipboard on right side of body */}
      <rect x="94" y="116" width="22" height="30" fill={W}  stroke={S} strokeWidth={2} />
      <rect x="98" y="112" width="14" height="6"  fill={S} />
      <line x1="97" y1="124" x2="113" y2="124" stroke={S} strokeWidth={1.5} />
      <line x1="97" y1="129" x2="113" y2="129" stroke={S} strokeWidth={1.5} />
      <line x1="97" y1="134" x2="108" y2="134" stroke={S} strokeWidth={1.5} />

      {/* ── Left arm ─────────────────────────────────────────── */}
      <motion.rect x="-2" y="112" width="16" height="50" fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.left }} transition={{ duration: 0.45, ease: "easeOut" }}
      />
      <motion.rect x="-6" y="156" width="24" height="12" fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.left }} transition={{ duration: 0.45, ease: "easeOut" }}
      />

      {/* ── Right arm ────────────────────────────────────────── */}
      <motion.rect x="92" y="112" width="16" height="50" fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.right }}
        transition={{ duration: state === "waving" ? 0.55 : 0.45, ease: "easeInOut", repeat: state === "waving" ? Infinity : 0, repeatType: "loop" }}
      />
      <motion.rect x="88" y="156" width="24" height="12" fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.right }}
        transition={{ duration: state === "waving" ? 0.55 : 0.45, ease: "easeInOut", repeat: state === "waving" ? Infinity : 0, repeatType: "loop" }}
      />

      {/* ── Legs (thinner) ──────────────────────────────────── */}
      <rect x="22" y="180" width="24" height="28" fill={BG} stroke={S} strokeWidth={SW} />
      <rect x="60" y="180" width="24" height="28" fill={BG} stroke={S} strokeWidth={SW} />
      <rect x="14" y="204" width="36" height="10" fill={BG} stroke={S} strokeWidth={SW} />
      <rect x="56" y="204" width="36" height="10" fill={BG} stroke={S} strokeWidth={SW} />
    </svg>
  );
}
