"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2, X } from "lucide-react";

/**
 * Service request form for the Intuit benefit page.
 *
 * The main AHC site posts this to /api/leads/public, which writes the lead
 * into Firestore. This site is a static export with no server, so requests
 * are emailed through Web3Forms instead. The concierge team receives every
 * submission by email and enters it into the CRM.
 */

const WEB3FORMS_ACCESS_KEY = "1ead8cae-957f-4bf7-ae38-9db6c0e213a9";

const services = [
  "House Cleaning",
  "Home Organization",
  "Handyman Services",
  "Errands",
  "Laundry & Ironing",
  "Private Driver",
  "Pet Services",
  "Childcare",
  "Moving Assistance",
  "Event Assistance",
  "Something else",
];

const contactMethods = ["Phone", "Email", "WhatsApp"] as const;

interface BookingFormProps {
  onClose?: () => void;
  /** Preselects the dropdown when opened from a service card. */
  initialService?: string;
}

export function BookingForm({ onClose, initialService }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState<(typeof contactMethods)[number]>("Phone");
  const honeypot = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot.current?.value) return; // bot filled the hidden field

    const data = new FormData(e.currentTarget);
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (firstName.length < 2) return setError("Please enter your first name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid phone number.");

    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Intuit Lifestyle Services request from ${firstName} ${lastName}`.trim(),
          from_name: "Intuit Lifestyle Services",
          name: `${firstName} ${lastName}`.trim(),
          email,
          /* Hitting Reply on the notification answers the person who filled
             the form, not the Web3Forms address. */
          replyto: email,
          phone,
          service: data.get("service") || "Not specified",
          message: data.get("message") || "",
          preferred_contact: contact,
          source: "intuit.atlantahomeconcierge.com",
        }),
      });
      if (!res.ok) throw new Error(`Web3Forms responded ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error("Service request failed", err);
      setError(
        "Something went wrong. Please try again or call us at (678) 702-2678."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 outline-none transition-colors focus:border-intuit/50 focus:bg-white/[0.08]";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-300";

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-navy-800 p-10 text-center shadow-2xl"
      >
        <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-light" />
        <h2 className="font-baskerville text-2xl font-bold text-white">
          Request received
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Your Concierge will reach out shortly to confirm the details. For
          anything urgent, call or text (678) 702-2678.
        </p>
        <button
          onClick={onClose}
          className="mt-7 w-full rounded-xl bg-green px-8 py-4 text-base font-bold text-white transition-colors hover:bg-green-light"
        >
          Done
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-navy-800 p-6 shadow-2xl sm:p-8"
    >
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <h2 className="font-baskerville text-2xl font-bold text-white">
        Book a Service
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Tell us what you need and your Concierge takes it from there.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        {/* Honeypot, hidden from people and screen readers */}
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              First name
            </label>
            <input id="firstName" name="firstName" autoComplete="given-name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Last name
            </label>
            <input id="lastName" name="lastName" autoComplete="family-name" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={inputClass} />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>

        <div>
          <label htmlFor="service" className={labelClass}>
            Service needed
          </label>
          <select
            id="service"
            name="service"
            defaultValue={initialService ?? ""}
            className={inputClass}
          >
            <option value="">Select a service...</option>
            {services.map((s) => (
              <option key={s} value={s} className="bg-navy-800">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            Anything else we should know?
          </label>
          <textarea id="message" name="message" rows={3} className={inputClass} />
        </div>

        <div>
          <span className={labelClass}>Preferred contact method</span>
          <div className="flex gap-2">
            {contactMethods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setContact(m)}
                className={`min-h-11 flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  contact === m
                    ? "border-intuit/50 bg-intuit/15 text-intuit"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-green px-8 py-4 text-base font-bold text-white shadow-xl shadow-green/25 transition-all duration-300 enabled:hover:bg-green-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Request
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
