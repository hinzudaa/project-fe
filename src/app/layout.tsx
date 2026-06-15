import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { AuthProvider } from "@/store/AuthProvider";
import { NotificationProvider } from "@/store/NotificationProvider";
import AuthLoadingGate from "@/components/AuthLoadingGate";

// Self-hosted via next/font — no render-blocking cross-origin request, metric-based
// fallback to cut layout shift. (DM Sans / Instrument Serif have no Cyrillic cut, so
// Mongolian text falls back to system fonts exactly as before.)
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Huslen",
  description: "Насанд хүрэгчдийн Монголын Нийгэмлэг",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="mn"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${playfair.variable} ${instrument.variable}`}
    >
      <body>
        <AuthProvider>
          <NotificationProvider>
            <AuthLoadingGate>
              <Header />
              {children}
            </AuthLoadingGate>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
