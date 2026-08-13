"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  useReducedMotion,
} from "framer-motion";
import { X, User, Phone, Mail } from "lucide-react";
import { PHOSPHOR_CALL_BELL_PATH, CallBellIcon } from "@/components/icons/call-bell";
import { PhosphorIcon } from "@/components/icons/phosphor";
import {
  SEGMENTS,
  pickSegmentIndex,
  type Segment,
  type Participant,
  saveSpin,
  hasAlreadySpun,
} from "./wheel-data";

/**
 * AHC Prize Wheel — event activation page.
 * Flow: participant fills name + phone + email → one spin per person →
 * the result is stored on this device (for the /wheel/draw raffle) and
 * emailed via Web3Forms as backup. No backend needed.
 */

/* Web3Forms access key. Public by design: it only permits posting to the
   Web3Forms endpoint, which emails the AHC inbox. Every spin is stored on
   the device regardless; this is the email backup. */
const WEB3FORMS_ACCESS_KEY = "1ead8cae-957f-4bf7-ae38-9db6c0e213a9";

const SEG_ANGLE = 360 / SEGMENTS.length;
const CX = 300;
const CY = 300;
const R = 278;

/** Logical angle (0 = top, clockwise) to SVG point at radius r. */
function pt(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function segmentPath(i: number) {
  const a0 = i * SEG_ANGLE - SEG_ANGLE / 2;
  const a1 = i * SEG_ANGLE + SEG_ANGLE / 2;
  const p0 = pt(a0, R);
  const p1 = pt(a1, R);
  return `M ${CX} ${CY} L ${p0.x} ${p0.y} A ${R} ${R} 0 0 1 ${p1.x} ${p1.y} Z`;
}

function segmentFill(segment: Segment, i: number) {
  if (segment.type === "blue") return "url(#seg-blue)";
  if (segment.type === "gold") return "url(#seg-gold)";
  return i % 2 === 0 ? "#2C3A5E" : "#232D50";
}

function bellFill(segment: Segment) {
  if (segment.type === "blue") return "#FFFFFF";
  if (segment.type === "gold") return "#222B4A";
  return "url(#bell-grad)";
}

const BELL_OFFSETS: Record<number, number[]> = {
  1: [0],
  2: [-11, 11],
  3: [-15.5, 0, 15.5],
};

function BellGroup({ segment, index }: { segment: Segment; index: number }) {
  const offsets = BELL_OFFSETS[segment.bells] ?? [0];
  const scale = segment.bells === 1 ? 0.24 : segment.bells === 2 ? 0.18 : 0.15;
  return (
    <>
      {offsets.map((offset) => {
        const angle = index * SEG_ANGLE + offset;
        const p = pt(angle, 198);
        return (
          <g
            key={offset}
            transform={`translate(${p.x} ${p.y}) rotate(${angle}) scale(${scale}) translate(-128 -128)`}
          >
            <path d={PHOSPHOR_CALL_BELL_PATH} fill={bellFill(segment)} />
          </g>
        );
      })}
      {segment.type === "gold" && (
        <g
          transform={`translate(${pt(index * SEG_ANGLE - 13, 225).x} ${pt(index * SEG_ANGLE - 13, 225).y}) rotate(${index * SEG_ANGLE}) scale(0.09) translate(-128 -128)`}
        >
          <path
            d="M128 20 L152 96 L232 96 L168 144 L192 224 L128 176 L64 224 L88 144 L24 96 L104 96 Z"
            fill="#F4E5B8"
          />
        </g>
      )}
    </>
  );
}

function labelColor(segment: Segment) {
  if (segment.type === "blue") return "#FFFFFF";
  if (segment.type === "gold") return "#222B4A";
  return "#C5CBD4";
}

function WheelSvg() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full drop-shadow-2xl">
      <defs>
        <linearGradient id="bell-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#26C4D8" />
          <stop offset="100%" stopColor="#6FC94D" />
        </linearGradient>
        <linearGradient id="seg-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="seg-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2C87B" />
          <stop offset="100%" stopColor="#B8973F" />
        </linearGradient>
        <linearGradient id="rim-silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E6EC" />
          <stop offset="50%" stopColor="#8F96A1" />
          <stop offset="100%" stopColor="#E2E6EC" />
        </linearGradient>
      </defs>

      {SEGMENTS.map((segment, i) => (
        <path
          key={i}
          d={segmentPath(i)}
          fill={segmentFill(segment, i)}
          stroke="#1A2340"
          strokeWidth="2"
        />
      ))}

      {SEGMENTS.map((segment, i) => {
        const labelPoint = pt(i * SEG_ANGLE, 140);
        const [first, ...rest] = segment.label.split(" ");
        const word = rest.join(" ");
        const numeric = /^\d+$/.test(first);
        return (
          <g key={i}>
            <BellGroup segment={segment} index={i} />
            {/* Stacked label: number (or first word) on one line, word below */}
            <text
              x={labelPoint.x}
              y={labelPoint.y}
              transform={`rotate(${i * SEG_ANGLE} ${labelPoint.x} ${labelPoint.y})`}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={labelColor(segment)}
              fontWeight="700"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <tspan
                x={labelPoint.x}
                dy={numeric ? "-4" : "-7"}
                fontSize={numeric ? "34" : "14"}
                letterSpacing={numeric ? "0" : "1.5"}
              >
                {first}
              </tspan>
              <tspan x={labelPoint.x} dy={numeric ? "24" : "17"} fontSize="12" letterSpacing="2">
                {word}
              </tspan>
            </text>
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={R + 8} fill="none" stroke="url(#rim-silver)" strokeWidth="12" />
      <circle cx={CX} cy={CY} r={R - 2} fill="none" stroke="#1A2340" strokeWidth="3" />

      {Array.from({ length: 16 }, (_, i) => {
        const p = pt(i * 22.5, R + 8);
        return <circle key={i} cx={p.x} cy={p.y} r="5" fill="#E2E6EC" stroke="#8F96A1" strokeWidth="1.5" />;
      })}

    </svg>
  );
}

/* ------------------------------- Confetti ---------------------------------- */

const CONFETTI_COLORS = ["#26C4D8", "#6FC94D", "#C9A84C", "#E2E6EC", "#3B82F6"];

function ConfettiBurst() {
  const pieces = useRef(
    Array.from({ length: 36 }, (_, i) => ({
      angle: (i / 36) * 360 + Math.random() * 20,
      distance: 140 + Math.random() * 220,
      rotation: Math.random() * 540 - 270,
      size: 6 + Math.random() * 8,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.15,
    }))
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {pieces.map((piece, i) => {
        const rad = (piece.angle * Math.PI) / 180;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{
              x: Math.cos(rad) * piece.distance,
              y: Math.sin(rad) * piece.distance + 80,
              opacity: 0,
              rotate: piece.rotation,
              scale: 0.6,
            }}
            transition={{ duration: 1.4, delay: piece.delay, ease: [0.15, 0.6, 0.4, 1] }}
            className="absolute rounded-[2px]"
            style={{ width: piece.size, height: piece.size * 0.55, backgroundColor: piece.color }}
          />
        );
      })}
    </div>
  );
}

/* ---------------------------- Participant form ------------------------------ */

function ParticipantForm({ onReady }: { onReady: (p: Participant) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const participant: Participant = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };
    if (participant.name.length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (participant.phone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(participant.email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (hasAlreadySpun(participant)) {
      setError("Looks like you already had your spin. One spin per person!");
      return;
    }
    setError(null);
    onReady(participant);
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-base text-white placeholder:text-slate-500 outline-none transition-colors focus:border-lux/50 focus:bg-white/[0.08]";

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      onSubmit={submit}
      className="relative z-10 mt-8 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.15em] text-lux">
        Enter to Spin
      </p>
      <div className="space-y-3">
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-center text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="group relative mt-4 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-green px-8 py-4 text-base font-bold text-white shadow-xl shadow-green/25 transition-all duration-300 hover:shadow-2xl hover:shadow-green/35"
      >
        <span className="relative z-10">I&apos;m Ready</span>
        <div className="absolute inset-0 -translate-x-full bg-green-light transition-transform duration-500 group-hover:translate-x-0" />
      </button>
      <p className="mt-3 text-center text-[0.65rem] uppercase tracking-[0.15em] text-slate-500">
        One spin per person
      </p>
    </motion.form>
  );
}

/* --------------------------------- Page ------------------------------------ */

export function WheelClient() {
  const rotation = useMotionValue(0);
  const totalRotation = useRef(0);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [result, setResult] = useState<Segment | null>(null);
  const reducedMotion = useReducedMotion();

  async function submitToWeb3Forms(segment: Segment, p: Participant) {
    if (!WEB3FORMS_ACCESS_KEY) return;
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `AHC Prize Wheel: ${p.name} won ${segment.prize}`,
          from_name: "AHC Prize Wheel",
          name: p.name,
          phone: p.phone,
          email: p.email,
          /* Hitting Reply on the notification answers the participant. */
          replyto: p.email,
          prize: segment.prize,
          raffle_entries: String(segment.entries),
        }),
      });
    } catch {
      // offline or blocked; the local record still counts for the draw
    }
  }

  function spin() {
    if (spinning || !participant || hasSpun) return;
    setSpinning(true);
    setResult(null);

    const target = pickSegmentIndex();
    const jitter = Math.random() * 26 - 13;
    const current = totalRotation.current;
    const needed = ((-target * SEG_ANGLE - current) % 360 + 360) % 360;
    const final = current + (reducedMotion ? 360 : 5 * 360) + needed + jitter;

    animate(rotation, final, {
      duration: reducedMotion ? 0.9 : 5.4,
      ease: [0.12, 0.4, 0.08, 1],
      onComplete: () => {
        totalRotation.current = final;
        const segment = SEGMENTS[target];
        saveSpin({ ...participant, prize: segment.prize, entries: segment.entries, type: segment.type, ts: Date.now() });
        void submitToWeb3Forms(segment, participant);
        setSpinning(false);
        setHasSpun(true);
        setResult(segment);
      },
    });
  }

  function nextParticipant() {
    setResult(null);
    setParticipant(null);
    setHasSpun(false);
  }

  const firstName = participant?.name.split(" ")[0];

  return (
    <main className="relative flex min-h-svh flex-col items-center overflow-hidden bg-navy-900 px-4 py-8 sm:py-10">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-32 top-1/4 h-[480px] w-[480px] rounded-full bg-lux/[0.05] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 bottom-1/4 h-[520px] w-[520px] rounded-full bg-green/[0.04] blur-[120px]"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <Image
          src="/logo/AHC%20LOGO%202026%20FULL%20DARK.png"
          alt="Atlanta Home Concierge"
          width={2689}
          height={1016}
          className="h-16 w-auto sm:h-20"
          priority
        />
        <h1 className="mt-4 font-baskerville text-4xl font-bold text-white sm:text-5xl">
          Spin the{" "}
          <span className="bg-gradient-to-r from-[#26C4D8] to-[#6FC94D] bg-clip-text text-transparent">
            Bell
          </span>
        </h1>
        <p className="mt-3 max-w-md text-sm text-slate-400 sm:text-base">
          Every spin wins: raffle entries, an AHC cup, or an instant prize.
        </p>
      </motion.div>

      {/* Participant form gate */}
      <AnimatePresence mode="wait">
        {!participant && <ParticipantForm key="form" onReady={setParticipant} />}
      </AnimatePresence>

      {/* Wheel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-8 w-[min(88vw,540px)]"
      >
        <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
          <svg width="44" height="52" viewBox="0 0 44 52" className="drop-shadow-lg">
            <defs>
              <linearGradient id="pointer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2E6EC" />
                <stop offset="100%" stopColor="#8F96A1" />
              </linearGradient>
            </defs>
            <path d="M2 2 H42 L22 50 Z" fill="url(#pointer-grad)" stroke="#222B4A" strokeWidth="3" />
          </svg>
        </div>

        <motion.div style={{ rotate: rotation }} className="aspect-square w-full">
          <WheelSvg />
        </motion.div>

        {/* Static hub (does not rotate with the wheel) */}
        <div className="absolute left-1/2 top-1/2 z-10 flex h-[21%] w-[21%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-lux-light bg-navy-900 shadow-xl shadow-black/40">
          <CallBellIcon className="h-[55%] w-[55%]" gradientId="bell-hub" />
        </div>
      </motion.div>

      {/* Spin button */}
      {participant && !hasSpun && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 mt-6 text-sm text-slate-300"
          >
            Good luck, <span className="font-semibold text-white">{firstName}</span>!
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={spin}
            disabled={spinning}
            className="group relative z-10 mt-3 inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-xl bg-green px-12 py-4 text-lg font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-green/25 transition-all duration-300 enabled:hover:shadow-2xl enabled:hover:shadow-green/35 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10">{spinning ? "Spinning..." : "Spin"}</span>
            {!spinning && (
              <div className="absolute inset-0 -translate-x-full bg-green-light transition-transform duration-500 group-hover:translate-x-0" />
            )}
          </motion.button>
        </>
      )}

      {/* Footer */}
      <div className="relative z-10 mt-8 flex items-center gap-4 pb-2">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-500">
          Powered by Atlanta Home Concierge &middot; Since 2005
        </p>
        <Link
          href="/wheel/draw"
          className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-600 transition-colors hover:text-slate-400"
        >
          Raffle Draw
        </Link>
      </div>

      <div aria-live="polite" className="sr-only">
        {result ? `Result: ${result.prize}` : ""}
      </div>

      {/* Result overlay */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 p-4 backdrop-blur-sm"
          >
            {(result.type === "blue" || result.type === "gold") && <ConfettiBurst />}

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-navy-800 p-8 text-center shadow-2xl"
            >
              <button
                onClick={nextParticipant}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-5 flex items-center justify-center gap-2">
                {result.type === "gold" ? (
                  <PhosphorIcon name="gift" className="h-14 w-14" gradientId="prize-gift" />
                ) : (
                  Array.from({ length: result.bells }, (_, i) => (
                    <CallBellIcon
                      key={i}
                      className={result.bells === 1 ? "h-14 w-14" : "h-10 w-10"}
                      gradientId={`prize-bell-${i}`}
                    />
                  ))
                )}
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-lux">
                {result.type === "standard" ? `You Won, ${firstName}` : `Congratulations, ${firstName}!`}
              </p>
              <h2 className="font-baskerville text-3xl font-bold text-white">
                {result.prize}
              </h2>
              <p className="mt-3 text-sm text-slate-400">{result.claim}</p>

              <button
                onClick={nextParticipant}
                className="group relative mt-7 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-green px-8 py-4 text-base font-bold text-white shadow-xl shadow-green/25 transition-all duration-300 hover:shadow-2xl hover:shadow-green/35"
              >
                <span className="relative z-10">Next Participant</span>
                <div className="absolute inset-0 -translate-x-full bg-green-light transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
