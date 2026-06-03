import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "./components/Header";
import CustomCursor from "./components/CustomCursor";
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
        <CustomCursor />
        <Header />

        <main className="flex-1 w-full">{children}</main>
        <Analytics />

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="w-full flex
          px-6   pt-8 pb-12
          flex-col items-center gap-6 text-center
          md:flex-row md:items-center md:justify-between md:text-left md:gap-4 md:px-12
          laptop:px-16
          xl:px-24 xl:pb-16"
        >
          <p
            className="text-base md:text-lg laptop:text-xl xl:text-[24px] font-bold tracking-[0.04em]"
            style={{ color: "var(--text-primary)" }}
          >
            {`let's make something `}
            <span style={{ color: "#bdd1ff" }}>wonderful</span>
            {` together <3`}
          </p>
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-6 text-sm xl:text-[16px] tracking-[0.04em] font-normal">
            <a
              href="mailto:hello@nicole-mills.com"
              className="flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: "var(--text-primary)" }}
            >
              hello@nicole-mills.com
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/arrow-outward.svg" alt="" width={20} height={20} />
            </a>
            <a
              href="https://linkedin.com/in/nicolemills"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: "var(--text-primary)" }}
            >
              linkedin
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/arrow-outward.svg" alt="" width={20} height={20} />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              className="flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: "var(--text-primary)" }}
            >
              resume
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/arrow-outward.svg" alt="" width={20} height={20} />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
