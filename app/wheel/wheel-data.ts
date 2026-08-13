/**
 * Shared data for the AHC Prize Wheel: segment definitions, participant
 * records, and localStorage helpers. Records live on the event device
 * (the iPad) so the raffle draw at /wheel/draw works fully offline;
 * Web3Forms keeps an email copy of every spin as backup.
 */

export type SegmentType = "standard" | "blue" | "gold";

export interface Segment {
  bells: number;
  label: string;
  prize: string;
  claim: string;
  entries: number;
  type: SegmentType;
  /**
   * Relative odds of landing here. The wheel LOOKS like eight equal slices,
   * but the result is drawn by weight, so stock-limited prizes can be made
   * rarer without redrawing the artwork.
   *
   * Set a weight to 0 to take a prize out of circulation entirely: the slice
   * stays on the wheel and simply never wins.
   *
   * Current totals: 149*6 + 0 + 6 = 900.
   *   AHC Cup        0/900   = retired, cups ran out at the event
   *   Instant Prize  6/900   = exactly 1 in 150
   *   Each entry     149/900 each, about 16.6% per slice
   */
  weight: number;
}

/** Weight presets, named so the intent is obvious at the call site. */
const ENTRY_WEIGHT = 149;
const INSTANT_PRIZE_WEIGHT = 6; // exactly 1 in 150
/* Cups are gone, so the slice stays on the wheel and simply never wins. It
   keeps the wheel looking the same to a participant; the pointer just never
   stops there. Restock and set this above 0 to bring the prize back. */
const CUP_WEIGHT = 0;

export const SEGMENTS: Segment[] = [
  { bells: 1, label: "1 ENTRY", prize: "1 Raffle Entry", claim: "Your name is in the raffle. Good luck!", entries: 1, type: "standard", weight: ENTRY_WEIGHT },
  { bells: 1, label: "1 ENTRY", prize: "1 Raffle Entry", claim: "Your name is in the raffle. Good luck!", entries: 1, type: "standard", weight: ENTRY_WEIGHT },
  { bells: 2, label: "2 ENTRIES", prize: "2 Raffle Entries", claim: "Your name is in the raffle twice. Good luck!", entries: 2, type: "standard", weight: ENTRY_WEIGHT },
  { bells: 1, label: "1 ENTRY", prize: "1 Raffle Entry", claim: "Your name is in the raffle. Good luck!", entries: 1, type: "standard", weight: ENTRY_WEIGHT },
  { bells: 2, label: "2 ENTRIES", prize: "2 Raffle Entries", claim: "Your name is in the raffle twice. Good luck!", entries: 2, type: "standard", weight: ENTRY_WEIGHT },
  { bells: 1, label: "AHC CUP", prize: "You Won an AHC Cup!", claim: "The Blue Bell! Grab your cup at the concierge desk.", entries: 0, type: "blue", weight: CUP_WEIGHT },
  { bells: 3, label: "3 ENTRIES", prize: "3 Raffle Entries", claim: "Your name is in the raffle three times. Good luck!", entries: 3, type: "standard", weight: ENTRY_WEIGHT },
  { bells: 1, label: "INSTANT PRIZE", prize: "Instant Prize!", claim: "The Golden Bell! Pick your prize at the concierge desk.", entries: 0, type: "gold", weight: INSTANT_PRIZE_WEIGHT },
];

/**
 * Draws a segment index using the weights above. Falls back to the last
 * segment with a non-zero weight, which only matters for floating point
 * edge cases at the very top of the range.
 */
export function pickSegmentIndex(): number {
  const total = SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < SEGMENTS.length; i++) {
    roll -= SEGMENTS[i].weight;
    if (roll < 0) return i;
  }
  return SEGMENTS.findLastIndex((s) => s.weight > 0);
}

export interface Participant {
  name: string;
  phone: string;
  email: string;
}

export interface SpinRecord extends Participant {
  prize: string;
  entries: number;
  type: SegmentType;
  ts: number;
}

const STORAGE_KEY = "ahc-wheel-spins";

export function loadSpins(): SpinRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SpinRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveSpin(record: SpinRecord) {
  try {
    const all = loadSpins();
    all.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable; Web3Forms email is still the backup
  }
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hasAlreadySpun(participant: Participant): boolean {
  const email = normalizeEmail(participant.email);
  const phone = participant.phone.replace(/\D/g, "");
  return loadSpins().some(
    (spin) =>
      normalizeEmail(spin.email) === email ||
      (phone.length >= 7 && spin.phone.replace(/\D/g, "") === phone)
  );
}
