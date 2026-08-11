import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  DM_Serif_Display,
  Poppins,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-src",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-numeric-serif",
  display: "swap",
  weight: ["400"],
});

// Poppins, the warm friendly sans the main AHC site uses for long body copy
// where Playfair felt too heavy. Exposed via the `font-poppins` utility.
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
      className={`${inter.variable} ${playfair.variable} ${dmSerif.variable} ${poppins.variable}`}
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
