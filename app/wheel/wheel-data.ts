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
}

export const SEGMENTS: Segment[] = [
  { bells: 1, label: "1 ENTRY", prize: "1 Raffle Entry", claim: "Your name is in the raffle. Good luck!", entries: 1, type: "standard" },
  { bells: 1, label: "1 ENTRY", prize: "1 Raffle Entry", claim: "Your name is in the raffle. Good luck!", entries: 1, type: "standard" },
  { bells: 2, label: "2 ENTRIES", prize: "2 Raffle Entries", claim: "Your name is in the raffle twice. Good luck!", entries: 2, type: "standard" },
  { bells: 1, label: "1 ENTRY", prize: "1 Raffle Entry", claim: "Your name is in the raffle. Good luck!", entries: 1, type: "standard" },
  { bells: 2, label: "2 ENTRIES", prize: "2 Raffle Entries", claim: "Your name is in the raffle twice. Good luck!", entries: 2, type: "standard" },
  { bells: 1, label: "AHC CUP", prize: "You Won an AHC Cup!", claim: "The Blue Bell! Grab your cup at the concierge desk.", entries: 0, type: "blue" },
  { bells: 3, label: "3 ENTRIES", prize: "3 Raffle Entries", claim: "Your name is in the raffle three times. Good luck!", entries: 3, type: "standard" },
  { bells: 1, label: "INSTANT PRIZE", prize: "Instant Prize!", claim: "The Golden Bell! Pick your prize at the concierge desk.", entries: 0, type: "gold" },
];

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
