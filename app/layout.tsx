import type { Metadata } from "next";
import {
  Libre_Baskerville,
  DM_Serif_Display,
  Poppins,
} from "next/font/google";
import "./globals.css";

// Libre Baskerville carries the headings. Only 400 and 700 exist, so display
// headings render at font-bold rather than an in-between weight.
const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-baskerville-src",
  display: "swap",
  weight: ["400", "700"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-numeric-serif",
  display: "swap",
  weight: ["400"],
});

// Poppins is the body face for everything that is not a heading.
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins-src",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://intuit.atlantahomeconcierge.com"),
  title: {
    default: "Intuit Lifestyle Services | Atlanta Home Concierge",
    template: "%s | Atlanta Home Concierge",
  },
  description:
    "Life admin, handled. Atlanta Home Concierge gives Intuit employees one trusted point of contact for the everyday tasks that compete for their time.",
  robots: { index: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Intuit Lifestyle Services",
    title: "Intuit Lifestyle Services | Powered by Atlanta Home Concierge",
    description:
      "Your time is valuable. Atlanta Home Concierge helps Intuit employees take care of the everyday tasks that compete for it.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${baskerville.variable} ${dmSerif.variable} ${poppins.variable}`}
    >
      <head>
        <meta name="theme-color" content="#222B4A" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
