import type { Metadata } from "next";
import { TapClient } from "./tap-client";

export const metadata: Metadata = {
  title: "Intuit Lifestyle Services",
  description:
    "Tap into Atlanta Home Concierge. Book a service, read the FAQ, or reach your Concierge.",
};

export default function TapPage() {
  return <TapClient />;
}
