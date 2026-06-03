"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNavLinks() {
  const pathname = usePathname();
  const onAbout = pathname === "/about";

  return (
    <div className="flex gap-[72px] items-center text-[20px] tracking-[0.04em]">
      <Link
        href="/#projects"
        className={`transition-opacity ${!onAbout ? "font-bold underline underline-offset-4" : "font-normal hover:opacity-80"}`}
        style={{ color: !onAbout ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        work
      </Link>
      <Link
        href="/about"
        className={`transition-opacity ${onAbout ? "font-bold underline underline-offset-4" : "font-normal hover:opacity-80"}`}
        style={{ color: onAbout ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        about
      </Link>
    </div>
  );
}
