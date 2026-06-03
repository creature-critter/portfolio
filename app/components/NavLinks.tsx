"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const onAbout = pathname === "/about";

  return (
    <nav className="flex gap-6 md:gap-8 xl:gap-12 text-sm md:text-base xl:text-[20px] tracking-[0.04em]">
      <Link
        href="/#projects"
        className={`transition-opacity ${!onAbout ? "font-bold underline underline-offset-4" : "font-light hover:opacity-80"}`}
        style={{ color: !onAbout ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        work
      </Link>
      <Link
        href="/about"
        className={`transition-opacity ${onAbout ? "font-bold underline underline-offset-4" : "font-light hover:opacity-80"}`}
        style={{ color: onAbout ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        about
      </Link>
    </nav>
  );
}
