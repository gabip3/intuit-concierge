import type { Metadata } from "next";
import { DrawClient } from "./draw-client";

export const metadata: Metadata = {
  title: "AHC Raffle Draw",
  description: "Draw the raffle winner from the AHC Prize Wheel entries.",
};

export default function DrawPage() {
  return <DrawClient />;
}
