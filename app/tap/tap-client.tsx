"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { CallBellIcon } from "@/components/icons/call-bell";
import { PhosphorIcon, type PhosphorIconName } from "@/components/icons/phosphor";

/**
 * NFC tag landing. Everything an Intuit employee needs one tap away, sized
 * for a phone held in one hand: no scrolling required for the primary
 * actions. Kept deliberately separate from the full page at `/`.
 */

/* SMS deep link to the AHC line, prefilled. `?&body=` is the form both iOS
   and Android accept. */
const TEXT_URL =
  "sms:+16787022678?&body=" +
  encodeURIComponent(
    "Hi! I'm an Intuit employee and I'd like to ask my Concierge about a service."
  );

const INSTAGRAM_URL = "https://www.instagram.com/atlantahomeconcierge/";
const YOUTUBE_URL = "http://www.youtube.com/@AtlantaHomeConcierge";
const AHC_WORLD_URL = "https://www.atlantahomeconcierge.com/ahc-world";

type Action = {
  label: string;
  sub: string;
  icon: PhosphorIconName | "bell";
  href?: string;
  external?: boolean;
  primary?: boolean;
};

const actions: Action[] = [
  {
    label: "Book a Service",
    sub: "Tell us what you need",
    icon: "bell",
    primary: true,
  },
  {
    label: "Explore Your Benefits",
    sub: "35+ services, preferred rates",
    icon: "star",
    href: "/",
  },
  {
    label: "Questions & Answers",
    sub: "How the benefit works",
    icon: "question",
    href: "/#faq",
  },
  {
    label: "Text Us",
    sub: "Ask your Concierge anything",
    icon: "chat-circle-text",
    href: TEXT_URL,
    external: true,
  },
  {
    label: "AHC World",
    sub: "Explore everything we do",
    icon: "globe-hemisphere-west",
    href: AHC_WORLD_URL,
    external: true,
  },
];

export function TapClient() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <main className="relative flex min-h-svh flex-col items-center overflow-hidden bg-navy-900 px-5 py-10">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-intuit/[0.06] blur-[110px]" />
        <div className="absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-green/[0.05] blur-[110px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-1 flex-col">
        {/* Co-brand lockup */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-4">
            <Image
              src="/logo/AHC%20LOGO%202026%20FULL%20DARK.png"
              alt="Atlanta Home Concierge"
              width={2689}
              height={1016}
              className="h-14 w-auto"
              priority
            />
            <span className="h-9 w-px bg-white/15" aria-hidden />
            <Image
              src="/images/partners/intuit-logo-white.png"
              alt="Intuit"
              width={702}
              height={142}
              className="h-4 w-auto opacity-90"
              priority
            />
          </div>

          <h1 className="mt-7 font-baskerville text-3xl font-bold leading-tight text-white">
            Intuit Lifestyle{" "}
            <span className="bg-gradient-to-r from-intuit to-intuit-light bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Your benefits don&apos;t stop at the office. Tap below and your
            Concierge takes it from there.
          </p>
        </motion.div>

        {/* Actions */}
        <div className="mt-9 space-y-3">
          {actions.map((action, i) => {
            const iconEl =
              action.icon === "bell" ? (
                <CallBellIcon className="h-7 w-7 shrink-0" gradientId="tap-bell" />
              ) : (
                <PhosphorIcon
                  name={action.icon}
                  gradientId={`tap-${action.icon}`}
                  className="h-7 w-7 shrink-0"
                />
              );

            const inner = (
              <>
                {iconEl}
                <span className="flex-1 text-left">
                  <span className="block text-sm font-semibold text-white">
                    {action.label}
                  </span>
                  <span className="block text-xs text-slate-400">{action.sub}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-intuit transition-transform duration-300 group-hover:translate-x-1" />
              </>
            );

            const base =
              "group flex min-h-[68px] w-full items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-300 active:scale-[0.98]";
            const style = action.primary
              ? "border-intuit/40 bg-intuit/[0.10] hover:border-intuit/70 hover:bg-intuit/[0.16]"
              : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]";

            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.07 }}
              >
                {action.href ? (
                  action.external ? (
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${base} ${style}`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link href={action.href} className={`${base} ${style}`}>
                      {inner}
                    </Link>
                  )
                ) : (
                  <button
                    onClick={() => setBookingOpen(true)}
                    className={`${base} ${style}`}
                  >
                    {inner}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Call and text */}
        <motion.a
          href="tel:+16787022678"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          className="mt-6 flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-green px-6 py-4 text-base font-bold text-white shadow-xl shadow-green/25 transition-colors duration-300 hover:bg-green-light active:scale-[0.98]"
        >
          <Phone className="h-4 w-4" />
          (678) 702-2678
        </motion.a>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          {[
            { url: INSTAGRAM_URL, icon: "instagram-logo" as const, label: "Instagram" },
            { url: YOUTUBE_URL, icon: "youtube-logo" as const, label: "YouTube" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.09] active:scale-95"
            >
              <PhosphorIcon
                name={s.icon}
                gradientId={`tap-social-${s.icon}`}
                className="h-5 w-5"
              />
            </a>
          ))}
        </motion.div>

        <p className="mt-auto pt-10 text-center text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-500">
          Powered by Atlanta Home Concierge
        </p>
      </div>

      {/* Booking modal */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/85 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setBookingOpen(false);
            }}
          >
            <BookingForm onClose={() => setBookingOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
