"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, Users, Ticket } from "lucide-react";
import { CallBellIcon } from "@/components/icons/call-bell";
import { loadSpins, type SpinRecord } from "../wheel-data";

/**
 * Raffle draw screen — runs on the same device (iPad) used for the wheel.
 * Reads the spins recorded on this device, builds a pool weighted by
 * raffle entries, and picks a winner with a name-cycling animation.
 */

const CONFETTI_COLORS = ["#26C4D8", "#6FC94D", "#C9A84C", "#E2E6EC", "#3B82F6"];

function ConfettiRain() {
  const pieces = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      rotation: Math.random() * 720 - 360,
      size: 7 + Math.random() * 9,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    }))
  ).current;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((piece, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0.8], rotate: piece.rotation }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: "easeIn" }}
          className="absolute rounded-[2px]"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size * 0.55,
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
}

export function DrawClient() {
  const [spins, setSpins] = useState<SpinRecord[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [cyclingName, setCyclingName] = useState<string | null>(null);
  const [winner, setWinner] = useState<SpinRecord | null>(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setSpins(loadSpins());
  }, []);

  /* One row per person (by email), entries summed. */
  const people = (() => {
    const byEmail = new Map<string, { record: SpinRecord; entries: number }>();
    for (const spin of spins) {
      const key = spin.email.trim().toLowerCase();
      const existing = byEmail.get(key);
      if (existing) existing.entries += spin.entries;
      else byEmail.set(key, { record: spin, entries: spin.entries });
    }
    return [...byEmail.values()];
  })();

  const eligible = people.filter((p) => p.entries > 0);
  const totalEntries = eligible.reduce((sum, p) => sum + p.entries, 0);

  function draw() {
    if (drawing || eligible.length === 0) return;
    setDrawing(true);
    setWinner(null);

    /* Weighted pool: each entry is one ticket. */
    const pool: SpinRecord[] = [];
    for (const p of eligible) {
      for (let i = 0; i < p.entries; i++) pool.push(p.record);
    }
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    /* Name-cycling suspense, slowing down before the reveal. */
    let tick = 0;
    const totalTicks = 24;
    const step = () => {
      tick += 1;
      setCyclingName(eligible[Math.floor(Math.random() * eligible.length)].record.name);
      if (tick < totalTicks) {
        setTimeout(step, 60 + tick * 12);
      } else {
        setCyclingName(null);
        setWinner(chosen);
        setDrawing(false);
      }
    };
    step();
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center overflow-hidden bg-navy-900 px-4 py-8 sm:py-10">
      {winner && <ConfettiRain />}

      {/* Back link */}
      <Link
        href="/wheel"
        className="absolute left-4 top-4 z-20 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Wheel
      </Link>

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
          className="h-14 w-auto sm:h-16"
          priority
        />
        <h1 className="mt-4 font-poppins text-4xl font-bold text-white sm:text-5xl">
          Raffle{" "}
          <span className="bg-gradient-to-r from-[#26C4D8] to-[#6FC94D] bg-clip-text text-transparent">
            Draw
          </span>
        </h1>

        {/* Stats */}
        <div className="mt-5 flex items-center gap-6 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-lux/70" />
            {eligible.length} participants
          </span>
          <span className="inline-flex items-center gap-2">
            <Ticket className="h-4 w-4 text-lux/70" />
            {totalEntries} entries
          </span>
        </div>
      </motion.div>

      {/* Draw stage */}
      <div className="relative z-10 mt-10 flex w-full max-w-md flex-1 flex-col items-center">
        <div className="flex min-h-[180px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {winner ? (
              <motion.div
                key="winner"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center"
              >
                <Trophy className="mb-3 h-10 w-10 text-lux" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lux">
                  Winner
                </p>
                <p className="mt-1 font-poppins text-4xl font-bold text-white">
                  {winner.name}
                </p>
                <p className="mt-2 text-sm text-slate-400">{winner.phone}</p>
              </motion.div>
            ) : cyclingName ? (
              <motion.p
                key={cyclingName}
                initial={{ opacity: 0.4, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.06 }}
                className="font-poppins text-3xl font-bold text-slate-200"
              >
                {cyclingName}
              </motion.p>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-slate-400"
              >
                <CallBellIcon className="mb-3 h-10 w-10" gradientId="draw-bell" />
                <p className="text-sm">
                  {eligible.length === 0
                    ? "No raffle entries on this device yet."
                    : "Ready to pick a winner."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={draw}
          disabled={drawing || eligible.length === 0}
          className="group relative mt-8 inline-flex min-h-14 w-full max-w-xs items-center justify-center gap-3 overflow-hidden rounded-xl bg-green px-12 py-4 text-lg font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-green/25 transition-all duration-300 enabled:hover:shadow-2xl enabled:hover:shadow-green/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10">
            {drawing ? "Drawing..." : winner ? "Draw Again" : "Draw Winner"}
          </span>
          {!drawing && (
            <div className="absolute inset-0 -translate-x-full bg-green-light transition-transform duration-500 group-hover:translate-x-0" />
          )}
        </button>

        {/* Participants list toggle */}
        {eligible.length > 0 && (
          <button
            onClick={() => setShowList(!showList)}
            className="mt-6 min-h-11 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 transition-colors hover:text-slate-300"
          >
            {showList ? "Hide participants" : "View participants"}
          </button>
        )}
        <AnimatePresence>
          {showList && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              {eligible
                .sort((a, b) => b.entries - a.entries)
                .map((p) => (
                  <li
                    key={p.record.email}
                    className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 text-sm last:border-0"
                  >
                    <span className="text-slate-300">{p.record.name}</span>
                    <span className="font-semibold text-lux">
                      {p.entries} {p.entries === 1 ? "entry" : "entries"}
                    </span>
                  </li>
                ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <p className="relative z-10 mt-8 pb-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-500">
        Powered by Atlanta Home Concierge &middot; Since 2005
      </p>
    </main>
  );
}
