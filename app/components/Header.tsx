"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NavLinks from "./NavLinks";
import MobileNavLinks from "./MobileNavLinks";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const diff = current - lastScrollY.current;

      if (Math.abs(diff) < 4) return;

      setVisible(current < lastScrollY.current || current < 60);
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Top nav — tablet + above ─────────────────────────────── */}
      <header
        className="w-full sticky top-0 z-50
          px-6   pt-8  pb-4
          md:px-12
          laptop:px-16 laptop:pt-12 laptop:pb-6
          xl:px-24 xl:pt-6 xl:pb-6
          flex items-center justify-between shrink-0
          transition-transform duration-300 ease-in-out"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-110%)",
        }}
      >
        <Link href="/" className="hidden md:block hover:opacity-70 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Nicole Mills" width={100} height={39} />
        </Link>

        {/* Nav links — hidden on mobile, visible md+ */}
        <div className="hidden md:block">
          <NavLinks />
        </div>
      </header>

      {/* ── Bottom nav — mobile only ──────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-4 left-6 right-6 z-50
          flex items-center justify-center
          px-6 py-4
          rounded-3xl
          border-2
          backdrop-blur-sm
          transition-transform duration-300 ease-in-out"
        style={{
          background: "#1b0703",
          borderColor: "#2d0e08",
          transform: visible ? "translateY(0)" : "translateY(110%)",
        }}
      >
        <MobileNavLinks />
      </nav>
    </>
  );
}
