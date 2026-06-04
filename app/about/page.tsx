import PhotoStack from "@/app/components/PhotoStack";

const industries = [
  { label: "space technology",     bg: "#bdd1ff", border: "#576ea4" },
  { label: "non-profit support",   bg: "#fff7bd", border: "#a48057" },
  { label: "women's health",       bg: "#daffbd", border: "#57a457" },
  { label: "financial fluency",    bg: "#f4bdff", border: "#9157a4" },
  { label: "affordable healthcare",bg: "#ffbdbd", border: "#a45757" },
];

const photos = [
  {
    src: "/about-photo-zion.webp",
    rotate: "-2.91deg",
    title: "checkerboard mesa @ zion, utah",
    caption: "my favorite rock",
    zIndex: 1,
  },
  {
    src: "/about-photo-canal.webp",
    rotate: "3.09deg",
    title: "somewhere @ erie canal",
    caption: "my most peaceful moment",
    zIndex: 2,
  },
  {
    src: "/about-photo-cafe.webp",
    rotate: "-1.19deg",
    title: "sixby @ savannah, ga",
    caption: "my favorite cafe",
    zIndex: 3,
  },
];

export default function About() {
  return (
    <div className="flex flex-col px-6 md:px-12 xl:px-24
      gap-16 md:gap-20 laptop:gap-[140px] xl:gap-[200px]"
    >

      {/* ── Section 1 — Who I am ─────────────────────────────────── */}
      <section className="flex flex-col gap-10 xl:gap-12 w-full max-w-[860px] mx-auto
        pt-16 md:pt-20 laptop:pt-[140px] xl:pt-[200px]"
      >
        {/* Photo + name + tagline */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">

          {/* Profile photo — square, sized to match text block height at each breakpoint */}
          <div className="shrink-0" style={{ transform: "rotate(-2.02deg)" }}>
            <div
              className="rounded-lg border-4 overflow-hidden
                w-[140px] md:w-[180px] laptop:w-[210px] xl:w-[240px]
                aspect-square"
              style={{ borderColor: "#2f1c18", background: "linear-gradient(-24.49deg, #1b0703 8.97%, rgba(27,7,3,0.31) 108.56%)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about-profile.webp"
                alt="Nicole Mills"
                className="block w-full h-full"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Name SVG + tagline */}
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about-name.svg"
              alt="nicole mills"
              className="w-[200px] md:w-[280px] xl:w-[385px]"
            />
            <h1
              className="font-bold tracking-[0.04em] leading-snug
                text-xl md:text-2xl laptop:text-[28px] xl:text-[36px]"
              style={{ color: "var(--text-primary)" }}
            >
              is a digital designer who designs for the parts of life worth getting right.
            </h1>
          </div>
        </div>

        {/* Bio */}
        <p
          className="font-light tracking-[0.04em] leading-snug
            text-base md:text-lg laptop:text-[18px] xl:text-[24px]"
          style={{ color: "var(--text-light)" }}
        >
          They have crafted solutions covering a broad number of industries including healthcare, education, finance and sexual wellness.
        </p>
      </section>

      {/* ── Section 2 — Opportunities ───────────────────────────── */}
      <section className="flex flex-col gap-10 xl:gap-12 w-full max-w-[860px] mx-auto">
        {/* Looking for */}
        <p
          className="font-light tracking-[0.04em] leading-snug
            text-base md:text-lg laptop:text-[18px] xl:text-[24px]"
          style={{ color: "var(--text-light)" }}
        >
          Actively open and looking for their next opportunity, whether it's full-time or contract. They are currently interested the most in the following industries...
        </p>

        {/* Industry tags */}
        <div className="flex flex-wrap gap-3 xl:gap-6">
          {industries.map((ind) => (
            <span
              key={ind.label}
              className="px-2 py-1 xl:px-2 xl:py-2 rounded-lg border-2 font-medium uppercase tracking-[0.04em]
                text-sm md:text-base xl:text-[20px] whitespace-nowrap"
              style={{ background: ind.bg, borderColor: ind.border, color: "#1b0703" }}
            >
              {ind.label}
            </span>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="flex flex-col gap-4 xl:gap-6">
          <p
            className="font-light tracking-[0.04em] leading-snug
              text-base md:text-lg laptop:text-[18px] xl:text-[24px]"
            style={{ color: "var(--text-light)" }}
          >
            Don&apos;t operate in any of these industries, but have a mission-focused team thoughtfully creating a better world? Nicole would love to hear from you :)
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="font-light tracking-[0.04em]
                text-base md:text-lg laptop:text-[18px] xl:text-[24px] whitespace-nowrap"
              style={{ color: "var(--text-light)" }}
            >
              Reach out @
            </span>
            <a
              href="mailto:hello@nicole-mills.com"
              className="flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity font-light tracking-[0.04em] whitespace-nowrap
                text-base md:text-lg laptop:text-[18px] xl:text-[24px]"
              style={{ color: "var(--text-primary)" }}
            >
              hello@nicole-mills.com
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/arrow-outward.svg" alt="" width={28} height={28} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Section 3 — When not designing ──────────────────────── */}
      <section className="flex flex-col items-center gap-10 xl:gap-12 w-full max-w-[860px] mx-auto
        pb-16 md:pb-20 laptop:pb-[140px] xl:pb-[200px]"
      >
        {/* Section heading */}
        <p
          className="font-light tracking-[0.04em] leading-snug text-center
            text-base md:text-lg laptop:text-[18px] xl:text-[24px]"
          style={{ color: "var(--text-light)" }}
        >
          When they aren&apos;t designing, you can find Nicole...
        </p>

        {/* Interactive photo stack — click to cycle */}
        <PhotoStack />

      </section>

    </div>
  );
}
