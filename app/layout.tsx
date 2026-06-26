import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "./components/Header";
import CustomCursor from "./components/CustomCursor";
import FooterClient from "./components/FooterClient";
import { ThemeProvider } from "./components/ThemeContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Nicole Mills — Product Designer",
  description: "Product designer crafting solutions across healthcare, education, finance, and sexual wellness.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body
        className="min-h-screen flex flex-col"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist-mono), monospace" }}
      >
        <ThemeProvider>
          <CustomCursor />
          <Header />

          <main className="flex-1 w-full">{children}</main>
          <Analytics />
          <SpeedInsights />

          {/* ── Footer ──────────────────────────────────────────────── */}
          <footer className="w-full
            px-6   pt-8 pb-16
            md:px-12
            laptop:px-16 laptop:pb-14
            xl:px-24 xl:pb-20"
          >
            <FooterClient />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
