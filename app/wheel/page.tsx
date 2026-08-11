import type { Metadata } from "next";
import { WheelClient } from "./wheel-client";

export const metadata: Metadata = {
  title: "AHC Prize Wheel",
  description:
    "Spin the bell. Win raffle entries, an AHC cup, or an instant prize.",
};

export default function WheelPage() {
  return <WheelClient />;
}
