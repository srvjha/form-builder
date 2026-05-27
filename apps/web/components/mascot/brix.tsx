"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BrixState } from "@/stores/mascot-store";

interface BrixProps {
  state?: BrixState;
  size?: number;
  className?: string;
}

/* ─── Design tokens ──────────────────────────────────────────── */
const S     = "#0A0A0A"; // stroke / fill black
const SW    = 3;         // stroke width
const BG    = "#F5F0E8"; // body fill
const HAT   = "#FFD600"; // hard hat yellow
const BADGE = "#FF3B00"; // chest badge red

/* ─── Face expression table ──────────────────────────────────── */
type FaceExpr = {
  eyeLY: number; eyeLH: number;
  eyeRY: number; eyeRH: number;
  mode:  "normal" | "x";
  mouth: string; // polyline points (always 3 pts for smooth morph)
};

const FACE: Record<BrixState, FaceExpr> = {
  idle: {
    eyeLY: 56, eyeLH: 16, eyeRY: 56, eyeRH: 16, mode: "normal",
    mouth: "38,97 60,97 82,97",
  },
  waving: {
    eyeLY: 60, eyeLH: 8,  eyeRY: 60, eyeRH: 8,  mode: "normal",
    mouth: "36,96 60,87 84,96",
  },
  excited: {
    eyeLY: 52, eyeLH: 20, eyeRY: 52, eyeRH: 20, mode: "normal",
    mouth: "33,101 60,85 87,101",
  },
  thinking: {
    eyeLY: 61, eyeLH: 7,  eyeRY: 56, eyeRH: 16, mode: "normal",
    mouth: "38,96 60,92 82,95",
  },
  success: {
    eyeLY: 62, eyeLH: 5,  eyeRY: 62, eyeRH: 5,  mode: "normal",
    mouth: "32,102 60,83 88,102",
  },
  error: {
    eyeLY: 56, eyeLH: 16, eyeRY: 56, eyeRH: 16, mode: "x",
    mouth: "36,89 60,97 84,89",
  },
};

/* ─── Arm angle table ────────────────────────────────────────── */
type ArmAngles = { left: number | number[]; right: number | number[] };

const ARMS: Record<BrixState, ArmAngles> = {
  idle:     { left: 8,    right: -8 },
  waving:   { left: 8,    right: [-20, -155, -20] },
  excited:  { left: -145, right: 145 },
  thinking: { left: -55,  right: -8 },
  success:  { left: -160, right: 160 },
  error:    { left: 15,   right: -15 },
};

/* ─── Sparkle positions for excited / success ────────────────── */
const SPARKLES = [
  { id: "t", x: 50, y: 4,  ex: 50,  ey: -22 },
  { id: "r", x: 110, y: 60, ex: 138, ey: 60 },
  { id: "l", x: -8, y: 60,  ex: -34, ey: 60 },
  { id: "tr", x: 98, y: 14,  ex: 118, ey: -4 },
  { id: "tl", x: 10, y: 14,  ex: -10, ey: -4 },
];

export function Brix({ state = "idle", size = 200, className }: BrixProps) {
  const face = FACE[state];
  const arms = ARMS[state];
  const showSparkles = state === "excited" || state === "success";

  return (
    <svg
      viewBox="0 0 120 234"
      width={size}
      height={(size / 120) * 234}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      {/* ── Sparkles (excited / success) ──────────────────────── */}
      <AnimatePresence>
        {showSparkles && SPARKLES.map((sp) => (
          <motion.rect
            key={sp.id}
            x={sp.x} y={sp.y} width={8} height={8}
            fill={sp.id.includes("t") ? HAT : BADGE}
            stroke={S} strokeWidth={1.5}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: sp.ex - sp.x,
              y: sp.ey - sp.y,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", repeat: Infinity, repeatDelay: 0.8 }}
          />
        ))}
      </AnimatePresence>

      {/* ── Hard hat ─────────────────────────────────────────────── */}
      {/* dome */}
      <rect x="24" y="4"  width="72" height="28" fill={HAT} stroke={S} strokeWidth={SW} />
      {/* band stripe */}
      <rect x="24" y="22" width="72" height="8"  fill={BADGE} stroke={S} strokeWidth={1.5} />
      {/* brim */}
      <rect x="8"  y="28" width="104" height="12" fill={HAT} stroke={S} strokeWidth={SW} />

      {/* ── Head ─────────────────────────────────────────────────── */}
      <rect x="16" y="38" width="88" height="74" fill={BG} stroke={S} strokeWidth={SW} />

      {/* ── Eyes ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {face.mode === "normal" ? (
          <motion.g key={`eyes-${state}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            {/* left eye */}
            <motion.rect
              x="30" width="16"
              fill={S}
              animate={{ y: face.eyeLY, height: face.eyeLH }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
            {/* left eye shine */}
            {face.eyeLH >= 10 && (
              <motion.rect x="32" width="5" height="5" fill="white"
                animate={{ y: face.eyeLY + 2 }}
                transition={{ duration: 0.18 }}
              />
            )}
            {/* right eye */}
            <motion.rect
              x="74" width="16"
              fill={S}
              animate={{ y: face.eyeRY, height: face.eyeRH }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
            {/* right eye shine */}
            {face.eyeRH >= 10 && (
              <motion.rect x="76" width="5" height="5" fill="white"
                animate={{ y: face.eyeRY + 2 }}
                transition={{ duration: 0.18 }}
              />
            )}
          </motion.g>
        ) : (
          /* X eyes — error state */
          <motion.g key="eyes-x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            <line x1="30" y1="56" x2="46" y2="72" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="46" y1="56" x2="30" y2="72" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="74" y1="56" x2="90" y2="72" stroke={S} strokeWidth={SW} strokeLinecap="square" />
            <line x1="90" y1="56" x2="74" y2="72" stroke={S} strokeWidth={SW} strokeLinecap="square" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* ── Mouth ────────────────────────────────────────────────── */}
      <motion.polyline
        stroke={S} strokeWidth={SW} strokeLinecap="square" strokeLinejoin="miter" fill="none"
        animate={{ points: face.mouth } as any}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* ── Neck ─────────────────────────────────────────────────── */}
      <rect x="46" y="112" width="28" height="14" fill={BG} stroke={S} strokeWidth={SW} />

      {/* ── Body ─────────────────────────────────────────────────── */}
      <rect x="8" y="124" width="104" height="76" fill={BG} stroke={S} strokeWidth={SW} />

      {/* chest badge */}
      <rect x="26" y="138" width="68" height="38" fill={BADGE} stroke={S} strokeWidth={2} />
      <text x="60" y="154" textAnchor="middle" fill="white" fontFamily="monospace" fontWeight="700" fontSize="8" letterSpacing="2">FORM</text>
      <text x="60" y="168" textAnchor="middle" fill="white" fontFamily="monospace" fontWeight="700" fontSize="8" letterSpacing="1">CRAFT</text>

      {/* ── Left arm ─────────────────────────────────────────────── */}
      <motion.rect
        x="-4" y="126" width="18" height="56"
        fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.left }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      {/* left hand */}
      <motion.rect
        x="-8" y="174" width="26" height="14"
        fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.left }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      {/* ── Right arm ────────────────────────────────────────────── */}
      <motion.rect
        x="106" y="126" width="18" height="56"
        fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.right }}
        transition={{
          duration: state === "waving" ? 0.55 : 0.45,
          ease: "easeInOut",
          repeat: state === "waving" ? Infinity : 0,
          repeatType: "loop",
        }}
      />
      {/* right hand */}
      <motion.rect
        x="102" y="174" width="26" height="14"
        fill={BG} stroke={S} strokeWidth={SW}
        style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        animate={{ rotate: arms.right }}
        transition={{
          duration: state === "waving" ? 0.55 : 0.45,
          ease: "easeInOut",
          repeat: state === "waving" ? Infinity : 0,
          repeatType: "loop",
        }}
      />

      {/* ── Legs ─────────────────────────────────────────────────── */}
      <rect x="20" y="200" width="28" height="26" fill={BG} stroke={S} strokeWidth={SW} />
      <rect x="72" y="200" width="28" height="26" fill={BG} stroke={S} strokeWidth={SW} />
      {/* feet */}
      <rect x="12" y="222" width="40" height="12" fill={BG} stroke={S} strokeWidth={SW} />
      <rect x="68" y="222" width="40" height="12" fill={BG} stroke={S} strokeWidth={SW} />
    </svg>
  );
}
