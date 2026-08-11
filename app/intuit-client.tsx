"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown, Phone, Check, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingForm } from "@/components/booking-form";
import { CallBellIcon } from "@/components/icons/call-bell";
import { PhosphorIcon, type PhosphorIconName } from "@/components/icons/phosphor";

/* WhatsApp deep link, same number used across the AHC site */
const WHATSAPP_URL =
  "https://wa.me/16787022678?text=" +
  encodeURIComponent(
    "Hi! I'm an Intuit employee and I'd like to ask my Concierge about a service."
  );

/* The most requested concierge services for Intuit employees. Icons are
   the AHC brand family: Phosphor Icons, Regular weight, with the ahcGreen
   gradient. */
interface TopService {
  label: string;
  icon: PhosphorIconName;
  description: string;
}

const topServices: TopService[] = [
  {
    label: "House Cleaning",
    icon: "spray-bottle",
    description:
      "Regular or one-time cleaning by trusted professionals, scheduled around your routine.",
  },
  {
    label: "Home Organization",
    icon: "stack",
    description:
      "Closets, pantries, garages: professional organizers bring calm to every space.",
  },
  {
    label: "Handyman Services",
    icon: "wrench",
    description:
      "Repairs, installations, and all those little fixes that never make it off your list.",
  },
  {
    label: "Errands",
    icon: "list-checks",
    description:
      "Grocery runs, returns, pickups, and drop-offs, handled while you work.",
  },
  {
    label: "Laundry & Ironing",
    icon: "coat-hanger",
    description:
      "Wash, fold, and ironing done with care. Your wardrobe, ready for the week.",
  },
  {
    label: "Private Driver",
    icon: "car",
    description:
      "A trusted driver for appointments, airport runs, and busy days.",
  },
  {
    label: "Pet Services",
    icon: "paw-print",
    description:
      "Walks, sitting, grooming, and vet runs for your best friend.",
  },
  {
    label: "Childcare",
    icon: "baby",
    description:
      "Vetted, experienced sitters and nannies your family can rely on.",
  },
  {
    label: "Moving Assistance",
    icon: "truck",
    description:
      "Packing, unpacking, and move-in support from start to settled.",
  },
  {
    label: "Event Assistance",
    icon: "confetti",
    description:
      "Staffing and hands-on help for dinners, parties, and special occasions.",
  },
];

const privileges = [
  {
    title: "No Membership Fees for Intuit Employees",
    copy: "All privileges, no membership fees. A benefit created for you.",
  },
  {
    title: "Priority Scheduling",
    copy: "Be first in line for requests and availability.",
  },
  {
    title: "Family & Guest Privileges",
    copy: "Extend your benefits to those who matter most.",
  },
  {
    title: "Monthly Complimentary Perks",
    copy: "A small task taken care of, on us.",
  },
  {
    title: "Preferred Intuit Pricing",
    copy: "Enjoy exclusive preferred rates on most services.",
  },
];

const stats = [
  { value: "20+", label: "Years of Excellence" },
  { value: "90+", label: "Service Providers" },
  { value: "35+", label: "Services" },
];

const INSTAGRAM_URL = "https://www.instagram.com/atlantahomeconcierge/";

const faqs: { question: string; answer: string; highlight?: string }[] = [
  {
    question: "What is Intuit Lifestyle Services?",
    answer:
      "Intuit Lifestyle Services, powered by Atlanta Home Concierge, gives Intuit employees access to a trusted network of lifestyle and household services designed to make everyday life easier. Think of us as your personal concierge for life outside of work. AHC has served families and businesses since 2005.",
  },
  {
    question: "What does having a Concierge actually mean?",
    answer:
      "It means you don't have to start every personal task from zero. Instead of searching for providers, making multiple calls, and coordinating everything yourself, you start with one simple question:",
    highlight: "“Can AHC help me with this?”",
  },
  {
    question: "What can AHC help me with?",
    answer:
      "More than you might think. You can request support with 35+ services, including housekeeping, home maintenance, errands, organization, pet care, moving assistance, babysitting and nanny services, private chefs, event support, handyman services, vehicle care, grocery sourcing, and much more.",
  },
  {
    question: "I don't see the service I need. Can I still ask?",
    answer:
      "Absolutely. Start with us. One of the biggest advantages of having a lifestyle concierge is that you don't need to figure out who to call first. Tell us what you need and we'll help determine how AHC can assist.",
    highlight: "Not sure if we can help? Just ask.",
  },
  {
    question: "Why is Intuit offering this service?",
    answer:
      "Because your time matters. Everyday responsibilities like errands, home projects, scheduling, maintenance, and family logistics consume time and attention. Intuit Lifestyle Services is designed to remove some of that everyday friction so you can spend more time on what matters to you.",
  },
  {
    question: "Can my spouse, partner, or family use the benefit?",
    answer:
      "Yes. Our Intuit Plus One benefit allows eligible employees to extend selected Atlanta Home Concierge perks to family members and friends. Specific offers may vary by service.",
  },
  {
    question: "Can AHC help while I'm working at the Intuit campus?",
    answer:
      "Yes, and it's one of the biggest conveniences of the service. Imagine arriving home after work with your house cleaned, laundry done, groceries picked up, or a repair already handled. AHC can coordinate and supervise home services so life keeps moving while you work.",
  },
  {
    question: "Do I need to contact different companies for different services?",
    answer:
      "No, and that's the whole idea. AHC acts as your single point of contact, coordinating many types of lifestyle and household needs in one place.",
  },
  {
    question: "Who will be coming into my home?",
    answer:
      "AHC works with a network of selected service professionals matched to the type of request. Safety, reliability, and professionalism are central to our model, with background checks, training, and ongoing service monitoring. You receive the relevant details before your appointment.",
  },
  {
    question: "Can I use AHC for recurring services?",
    answer:
      "Yes. Many services can be scheduled weekly, biweekly, monthly, seasonally, or customized around your household. AHC handles both one-time needs and ongoing support.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "As early as possible for childcare, events, deep cleaning, organizing, and larger projects. Depending on availability, we can often accommodate same-day and last-minute requests too.",
  },
  {
    question: "Are services available only in Atlanta?",
    answer:
      "No. Atlanta Home Concierge has a growing network in multiple markets. If you need assistance outside the Atlanta area, contact your Concierge and we'll let you know what options are available in your location.",
  },
  {
    question: "What if my regular service provider is unavailable?",
    answer:
      "AHC's model includes backup support designed to maintain continuity when a regular provider is unavailable, so you're never left without help.",
  },
  {
    question: "Is Atlanta Home Concierge part of Intuit?",
    answer:
      "AHC is an independent lifestyle management company partnering with Intuit to provide Lifestyle Services to Intuit employees.",
  },
  {
    question: "What if I have a question or an issue with a service?",
    answer:
      "Contact your AHC Concierge. You don't have to resolve service issues alone. AHC provides ongoing support and service monitoring, and uses your feedback to maintain service quality.",
  },
];


export function IntuitClient() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-navy-900">
      <IntuitHeader onBook={() => setBookingOpen(true)} />
      <Hero onBook={() => setBookingOpen(true)} />
      <QuickActions onBook={() => setBookingOpen(true)} />
      <YourConcierge />
      <Services onBook={() => setBookingOpen(true)} />
      <Privileges onBook={() => setBookingOpen(true)} />
      <OnSitePresence />
      <GoogleReviews />
      <Faq />
      <FinalCta onBook={() => setBookingOpen(true)} />
      <IntuitFooter />

      {/* Booking modal, same lead form used across the AHC site */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/80 p-4 backdrop-blur-sm"
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

/* ---------------------------------- Header --------------------------------- */

function IntuitHeader({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-navy-900/95 backdrop-blur-xl border-b border-lux/10 shadow-2xl shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Co-brand lockup */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/logo/AHC%20LOGO%202026%20FULL%20DARK.png"
              alt="Atlanta Home Concierge"
              width={2689}
              height={1016}
              className="h-11 w-auto sm:h-14"
              priority
            />
            <span className="h-6 w-px bg-white/15 sm:h-8" aria-hidden />
            <Image
              src="/images/partners/intuit-logo-white.png"
              alt="Intuit"
              width={702}
              height={142}
              className="h-3.5 w-auto opacity-90 sm:h-4"
              priority
            />
          </Link>

          <button
            onClick={onBook}
            className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-lg border border-lux/30 bg-lux/10 px-3.5 py-2.5 text-xs font-semibold text-lux transition-all duration-300 hover:border-lux/60 hover:bg-lux/20 hover:shadow-lg hover:shadow-lux/10 sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Book Now</span>
            <span className="hidden sm:inline">Book a Service</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/* ----------------------------------- Hero ---------------------------------- */

function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-navy-900 pt-24 pb-16 sm:pt-28">
      {/* Atlanta at night. Slow drift keeps it alive without pulling focus. */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0"
      >
        <Image
          src="/images/atlanta-night.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Fade. Solid navy at both edges so the photo melts into the sections
          above and below; the middle stays dark enough for white text. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/75 to-navy-900" />
      <div className="pointer-events-none absolute inset-0 bg-navy-900/45" />

      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-lux/[0.05] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 bottom-1/4 h-[600px] w-[600px] rounded-full bg-green/[0.04] blur-[120px]"
        />
      </div>

      {/* Fine grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(197,203,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,203,212,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Exclusivity badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-lux/25 bg-lux/[0.06] px-5 py-2"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lux" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lux">
            Intuit Life Admin Concierge
          </span>
        </motion.div>

        {/* You ask */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-slate-400"
        >
          You ask...
        </motion.p>

        {/* Headline */}
        <h1 className="mb-8 font-baskerville text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            &ldquo;Can you take
          </motion.span>
          {/* Forced break so the second line reads "care of this?" */}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            care
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block bg-gradient-to-r from-lux via-lux-light to-lux bg-clip-text text-transparent"
          >
            of this?&rdquo;
          </motion.span>
        </h1>

        {/* Answer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mb-10 flex items-center justify-center gap-3"
        >
          <CallBellIcon className="h-8 w-8 sm:h-10 sm:w-10" gradientId="bell-hero" />
          <p className="font-baskerville text-2xl font-bold text-white sm:text-3xl">
            Your Concierge.
          </p>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl"
        >
          An exclusive benefit for Intuit employees. One trusted point of
          contact for the everyday tasks that compete for your time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <button
            onClick={onBook}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-green px-8 py-4 text-base font-bold text-white shadow-xl shadow-green/25 transition-all duration-300 hover:shadow-2xl hover:shadow-green/35"
          >
            <span className="relative z-10">Book a Service</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-green-light transition-transform duration-500 group-hover:translate-x-0" />
          </button>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-lux/30 hover:bg-white/10 hover:text-white"
          >
            Explore Services
          </a>
        </motion.div>

        {/* Value strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-[0.15em] text-slate-400"
        >
          <span>35+ Services</span>
          <span className="hidden text-lux/50 sm:inline">&#9670;</span>
          <span>One Point of Contact</span>
          <span className="hidden text-lux/50 sm:inline">&#9670;</span>
          <span>More Time for What Matters</span>
        </motion.div>

        {/* Powered by */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-8 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-500"
        >
          Powered by Atlanta Home Concierge &middot; Since 2005
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 text-lux/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------ Quick Actions ------------------------------- */

function QuickActions({ onBook }: { onBook: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const actions: {
    label: string;
    icon: PhosphorIconName | "bell";
    onClick?: () => void;
    href?: string;
    external?: boolean;
  }[] = [
    { label: "Book a Service", icon: "bell", onClick: onBook },
    { label: "Explore Your Benefits", icon: "star", href: "#benefits" },
    { label: "Frequently Asked Questions", icon: "question", href: "#faq" },
    { label: "Follow AHC", icon: "instagram-logo", href: INSTAGRAM_URL, external: true },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-surface px-6 py-14 lg:py-16">
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-8 text-center"
        >
          <h2 className="font-baskerville text-2xl font-bold text-navy-900 sm:text-3xl">
            Your Intuit benefits don&apos;t stop at{" "}
            <span className="bg-gradient-to-r from-[#26C4D8] to-[#6FC94D] bg-clip-text text-transparent">
              the office.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Tap into Atlanta Home Concierge for exclusive employee benefits,
            preferred services, and everyday support designed to give you more
            time for what matters.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {actions.map((action, i) => {
            const iconClass =
              "h-8 w-8 shrink-0 transition-transform duration-300 group-hover:scale-110";
            const content = (
              <>
                {action.icon === "bell" ? (
                  <CallBellIcon className={iconClass} gradientId="qa-bell" />
                ) : (
                  <PhosphorIcon
                    name={action.icon}
                    gradientId={`qa-${action.icon}`}
                    className={iconClass}
                  />
                )}
                <span className="text-[11px] font-semibold uppercase leading-tight tracking-wider text-navy-900 sm:text-xs">
                  {action.label}
                </span>
              </>
            );
            const className =
              "group flex min-h-[104px] flex-col items-center justify-center gap-3 rounded-xl border border-navy-900/[0.08] bg-white p-4 text-center shadow-sm shadow-navy-900/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#6FC94D]/40 hover:shadow-lg hover:shadow-navy-900/[0.08] sm:p-5";

            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                {action.onClick ? (
                  <button onClick={action.onClick} className={`${className} w-full`}>
                    {content}
                  </button>
                ) : (
                  <a
                    href={action.href}
                    {...(action.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={className}
                  >
                    {content}
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Your Concierge (About) --------------------------- */

function YourConcierge() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-white px-6 py-20 lg:py-28">
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-green-emerald">
            Powered by Atlanta Home Concierge
          </span>
          <h2 className="font-baskerville text-4xl font-bold text-navy-900 sm:text-5xl">
            Your{" "}
            <span className="bg-gradient-to-r from-[#26C4D8] to-[#6FC94D] bg-clip-text text-transparent">
              Concierge
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Atlanta Home Concierge is a private lifestyle management company
            with over 20 years of experience, supporting families and
            businesses across metro Atlanta and beyond. Our team of 90+
            service providers manages the details of your home and daily life
            with discretion, reliability, and trusted hands. Now available to
            Intuit employees as a dedicated workplace benefit.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="bg-gradient-to-r from-[#26C4D8] to-[#6FC94D] bg-clip-text font-numeric text-4xl font-bold text-transparent">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Services -------------------------------- */

function Services({ onBook }: { onBook: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<TopService | null>(null);

  return (
    <section
      ref={ref}
      id="services"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/[0.04] bg-navy-900 px-6 py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,203,212,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-lux">
            Just Tell Us What You Need
          </span>
          <h2 className="font-baskerville text-3xl font-bold text-white sm:text-5xl">
            Most Requested{" "}
            <span className="bg-gradient-to-r from-lux via-lux-light to-lux bg-clip-text text-transparent">
              Concierge Services
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            A few of the ways we can make your day easier. Tap any service and
            your Concierge takes it from there.
          </p>
        </motion.div>

        {/* Service grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {topServices.map((service, i) => (
            <motion.button
              key={service.label}
              onClick={() => setSelected(service)}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              className="group flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-lux/20 hover:bg-white/5 sm:p-6"
            >
              <PhosphorIcon
                name={service.icon}
                gradientId={`svc-${service.icon}`}
                className="h-12 w-12 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 transition-colors duration-300 group-hover:text-lux sm:text-xs">
                {service.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Service detail card */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[55] flex items-center justify-center bg-navy-900/80 p-4 backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelected(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-navy-800 p-8 text-center shadow-2xl"
              >
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                <PhosphorIcon
                  name={selected.icon}
                  gradientId="svc-detail"
                  className="mx-auto mb-4 h-16 w-16"
                />
                <h3 className="font-baskerville text-2xl font-bold text-white">
                  {selected.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {selected.description}
                </p>

                <button
                  onClick={() => {
                    setSelected(null);
                    onBook();
                  }}
                  className="group relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-green px-8 py-4 text-base font-bold text-white shadow-xl shadow-green/25 transition-all duration-300 hover:shadow-2xl hover:shadow-green/35"
                >
                  <span className="relative z-10">Book This Service</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  <div className="absolute inset-0 -translate-x-full bg-green-light transition-transform duration-500 group-hover:translate-x-0" />
                </button>
                <p className="mt-3 text-[0.65rem] uppercase tracking-[0.15em] text-slate-500">
                  Included in your Intuit benefit
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ask your Concierge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-sm text-slate-400">
            These are just the most requested. With 35+ services, chances are
            we already do it.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-lux/25 bg-lux/[0.06] px-6 py-3.5 text-sm font-semibold text-lux transition-all duration-300 hover:border-lux/50 hover:bg-lux/[0.12] hover:shadow-lg hover:shadow-lux/10"
          >
            <CallBellIcon
              className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
              gradientId="bell-ask"
            />
            Ask Your Concierge
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- Privileges -------------------------------- */

function Privileges({ onBook }: { onBook: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="benefits"
      className="relative scroll-mt-20 overflow-hidden bg-surface px-6 py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-green-emerald">
            Exclusive for Intuit Employees
          </span>
          <h2 className="font-baskerville text-4xl font-bold text-navy-900 sm:text-5xl">
            Your{" "}
            <span className="bg-gradient-to-r from-[#26C4D8] to-[#6FC94D] bg-clip-text text-transparent">
              Privileges
            </span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {privileges.map((privilege, i) => (
            <motion.div
              key={privilege.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              className="flex items-start gap-4 rounded-xl border border-navy-900/[0.06] bg-white p-5 shadow-sm shadow-navy-900/[0.04] transition-shadow duration-300 hover:shadow-md hover:shadow-navy-900/[0.08] sm:items-center sm:p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#26C4D8]/15 to-[#6FC94D]/20 text-green-dark">
                <Check className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  {privilege.title}
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">{privilege.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <button
            onClick={onBook}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-green px-10 py-5 text-base font-bold uppercase tracking-[0.1em] text-white shadow-xl shadow-green/25 transition-all duration-300 hover:shadow-2xl hover:shadow-green/35"
          >
            <span className="relative z-10">Book Your Experience Now</span>
            <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-green-light transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------- On-Site Presence ------------------------------ */

function OnSitePresence() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy-900 px-6 py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lux/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(1,168,82,0.05)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.08] bg-white/5 backdrop-blur-sm">
          <MapPin className="h-7 w-7 text-lux" />
        </div>
        <h2 className="font-baskerville text-3xl font-bold text-white sm:text-4xl">
          On-Site{" "}
          <span className="bg-gradient-to-r from-lux via-lux-light to-lux bg-clip-text text-transparent">
            Concierge Presence
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300">
          Atlanta Home Concierge will be available on-site at Intuit for
          employee requests, bookings, recommendations, and personalized
          assistance.
        </p>
      </motion.div>
    </section>
  );
}

/* ------------------------------ Google Reviews ------------------------------ */

function GoogleReviews() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-green-emerald">
            Our Reviews
          </span>
          <h2 className="font-baskerville text-4xl font-bold text-navy-900 sm:text-5xl">
            What Clients{" "}
            <span className="bg-gradient-to-r from-[#26C4D8] to-[#6FC94D] bg-clip-text text-transparent">
              Say
            </span>
          </h2>
        </div>
        {/* Elfsight Google Reviews | AHC REVIEWS */}
        <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
        <div
          className="ahc-reviews elfsight-app-b8027d55-2831-405c-8b79-49bfd1a692f3"
          data-elfsight-app-lazy
        />

        {/* Shown only while the widget container is still empty, so the
            section never renders as a blank band if Elfsight fails to load
            or the plan's view quota runs out. Pure CSS, see globals.css. */}
        <div className="ahc-reviews-fallback text-center">
          <div className="mb-4 flex items-center justify-center gap-1.5">
            {Array.from({ length: 5 }, (_, i) => (
              <PhosphorIcon
                key={i}
                name="star"
                gradientId={`rev-star-${i}`}
                className="h-6 w-6"
              />
            ))}
          </div>
          <p className="text-base text-slate-600">
            Two decades of five-star service across metro Atlanta.
          </p>
          <a
            href="https://www.atlantahomeconcierge.com/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-navy-900/15 bg-white px-6 py-3.5 text-sm font-semibold text-navy-900 shadow-sm transition-all duration-300 hover:border-[#6FC94D]/50 hover:shadow-md"
          >
            Read Our Reviews
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------ FAQ ----------------------------------- */

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left transition-colors"
      >
        <span
          className={cn(
            "font-poppins text-base font-semibold transition-colors duration-300 sm:text-lg",
            isOpen ? "text-lux" : "text-white group-hover:text-lux"
          )}
        >
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 text-lux"
        >
          <PhosphorIcon
            name="caret-down"
            variant="current"
            className="h-5 w-5"
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-8">
              <p className="font-poppins text-sm leading-relaxed text-slate-300 sm:text-base">
                {faq.answer}
              </p>
              {faq.highlight && (
                <p className="mt-4 border-l-2 border-[#6FC94D] bg-white/[0.03] py-3 pl-4 font-poppins text-base font-semibold text-white sm:text-lg">
                  {faq.highlight}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={ref}
      id="faq"
      className="relative scroll-mt-20 overflow-hidden bg-navy-900 px-6 py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lux/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,203,212,0.05)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-lux">
            Good to Know
          </span>
          <h2 className="font-baskerville text-4xl font-bold text-white sm:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-lux via-lux-light to-lux bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 backdrop-blur-sm sm:px-8"
        >
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* Still have a question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="mb-4 text-sm text-slate-400">
            Still have a question? Your Concierge is one message away.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-lux/25 bg-lux/[0.06] px-6 py-3.5 text-sm font-semibold text-lux transition-all duration-300 hover:border-lux/50 hover:bg-lux/[0.12] hover:shadow-lg hover:shadow-lux/10"
          >
            <CallBellIcon
              className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
              gradientId="bell-faq"
            />
            Ask Your Concierge
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------- Final CTA -------------------------------- */

function FinalCta({ onBook }: { onBook: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy-900 px-6 py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(197,203,212,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lux/15 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-lux">
          Intuit Life Admin Concierge
        </span>
        <h2 className="font-baskerville text-4xl font-bold text-white sm:text-5xl">
          What can we take
          {/* Forced break: left to wrap, "today?" orphans onto its own line */}
          <br />
          <span className="bg-gradient-to-r from-lux via-lux-light to-lux bg-clip-text text-transparent">
            off your list today?
          </span>
        </h2>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={onBook}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-green px-8 py-4 text-base font-bold text-white shadow-xl shadow-green/25 transition-all duration-300 hover:shadow-2xl hover:shadow-green/35"
          >
            <span className="relative z-10">Book a Service</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-green-light transition-transform duration-500 group-hover:translate-x-0" />
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-lux/30 hover:bg-white/10 hover:text-white"
          >
            <CallBellIcon className="h-4 w-4" gradientId="bell-cta" />
            Ask Your Concierge
          </a>
        </div>

        {/* Phone */}
        <a
          href="tel:+16787022678"
          className="group mt-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <Phone className="h-3.5 w-3.5 text-lux/60" />
          Call or text anytime: {" "}
          <span className="font-semibold text-slate-300 group-hover:text-white">
            (678) 702-2678
          </span>
        </a>

        <p className="mt-10 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-500">
          Powered by Atlanta Home Concierge
        </p>
      </motion.div>
    </section>
  );
}

/* ---------------------------------- Footer ---------------------------------- */

function IntuitFooter() {
  return (
    <footer className="border-t border-navy-700/40 bg-navy-900 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-4">
          <Image
            src="/logo/AHC%20LOGO%202026%20FULL%20DARK.png"
            alt="Atlanta Home Concierge"
            width={2689}
            height={1016}
            className="h-12 w-auto"
          />
          <span className="h-8 w-px bg-white/10" aria-hidden />
          <Image
            src="/images/partners/intuit-logo-white.png"
            alt="Intuit"
            width={702}
            height={142}
            className="h-3.5 w-auto opacity-70"
          />
        </div>
        <div className="text-xs leading-relaxed text-slate-500">
          <p>
            An exclusive benefit for Intuit employees &middot; Powered by
            Atlanta Home Concierge
          </p>
          <p className="mt-1">
            2626 Peachtree Rd NW, Atlanta, GA 30305 &middot;{" "}
            <a href="tel:+16787022678" className="transition-colors hover:text-slate-300">
              (678) 702-2678
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
