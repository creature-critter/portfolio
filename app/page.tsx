export default function Home() {
  return (
    <div className="flex flex-col
      gap-16 md:gap-20 laptop:gap-[140px] xl:gap-[200px]"
    >

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="
        px-6   pt-16
        md:px-12 md:pt-20
        laptop:pt-[140px]
        xl:px-24 xl:pt-[200px]"
      >
        <div className="w-full max-w-[860px] mx-auto flex flex-col gap-4 xl:gap-6">
          <h1
            className="font-bold tracking-[0.04em] leading-snug
              text-2xl md:text-3xl laptop:text-[28px] xl:text-[36px]"
            style={{ color: "var(--text-primary)" }}
          >
            Nicole Mills designs for the parts of life worth getting right.
          </h1>
          <p
            className="font-light tracking-[0.04em] leading-snug
              text-base md:text-lg laptop:text-[18px] xl:text-[24px]"
            style={{ color: "var(--text-light)" }}
          >
            Crafting solutions across healthcare, education, finance, and sexual wellness.
          </p>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────── */}
      <section id="projects" className="
        px-6   pb-12
        md:px-12
        laptop:px-16 laptop:pb-16
        xl:px-24 xl:pb-24"
      >
        <div className="flex flex-col laptop:flex-row xl:flex-row gap-6">

          {/* ── Project 1 — two half-cards ───────────────────────── */}
          <a href="/projects/project-one" className="group laptop:flex-1 xl:flex-1">

            {/*
              Wrapper strategy (md+):
              - aspect-ratio holds a stable total height
              - overflow-clip hides the label when it's translated below
              - Cards container is absolutely inset, bottom retreats on hover
              - Label is absolutely at bottom, translates up from outside on hover

              Mobile: wrapper has no aspect-ratio, children are in normal flow,
              label always visible.
            */}
            <div className="relative w-full
              md:overflow-clip md:aspect-[756/428]"
            >
              {/* Cards — stacked mobile, side-by-side md+ */}
              <div className="
                flex flex-col gap-3
                md:absolute md:inset-x-0 md:top-0 md:bottom-0
                md:flex-row md:gap-6
                md:group-hover:bottom-[30px]
                md:transition-[bottom] md:duration-300 md:ease-in-out"
              >
                {/* Left — green → blue */}
                <div
                  className="overflow-clip relative rounded-lg w-full
                    aspect-[366/428]
                    md:aspect-auto md:flex-1"
                  style={{ background: "linear-gradient(146.29deg, #68BA6C 18.55%, #5498D0 148.41%)" }}
                >
                  <div
                    className="absolute -translate-y-1/2 top-[calc(50%+0.5px)] left-[28.14%] right-[28.42%]
                               overflow-clip drop-shadow-[0px_0px_13.5px_rgba(17,20,78,0.35)]"
                    style={{ aspectRatio: "159 / 341" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/patient-home.webp" alt="Patient Home screen"
                      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                </div>

                {/* Right — warm orange */}
                <div
                  className="overflow-clip relative rounded-lg w-full
                    aspect-[366/428]
                    md:aspect-auto md:flex-1"
                  style={{ background: "linear-gradient(-18.78deg, #E38233 63.79%, #E9B285 147.04%)" }}
                >
                  <div
                    className="absolute -translate-y-1/2 top-[calc(50%+0.5px)] left-[28.42%] right-[28.14%]
                               overflow-clip drop-shadow-[0px_0px_13.5px_rgba(78,41,17,0.2)]"
                    style={{ aspectRatio: "201 / 434" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/patient-device.webp" alt="Patient Device screen"
                      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="
                mt-3 flex items-center justify-between whitespace-nowrap
                text-xs tracking-[0.04em] font-normal
                md:mt-0 md:absolute md:inset-x-0 md:bottom-0 md:h-[30px]
                md:text-sm md:opacity-0
                md:translate-y-full md:group-hover:opacity-100 md:group-hover:translate-y-0
                md:transition-all md:duration-300 md:ease-in-out
                xl:text-[16px]"
              >
                <span style={{ color: "var(--text-label)" }}>COPD symptom management made easy</span>
                <span style={{ color: "var(--text-company)" }}>Vapotherm</span>
              </div>
            </div>
          </a>

          {/* ── Project 2 — clinical dashboard ───────────────────── */}
          <a href="/projects/project-two" className="group laptop:flex-1 xl:flex-1">

            <div className="relative w-full
              md:overflow-clip md:aspect-[756/428]"
            >
              {/* Card */}
              <div
                className="overflow-clip relative rounded-lg w-full
                  aspect-[756/428]
                  md:aspect-auto md:absolute md:inset-x-0 md:top-0 md:bottom-0
                  md:group-hover:bottom-[30px]
                  md:transition-[bottom] md:duration-300 md:ease-in-out"
                style={{ background: "linear-gradient(167.88deg, #2A1955 32.30%, #472D89 95.50%)" }}
              >
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                  style={{ width: "66.67%", height: "69.16%" }}
                >
                  <div className="absolute" style={{ left: "-5px", top: "-5px", right: "-5px", bottom: "-5px" }}>
                    <div className="absolute inset-[-2.61%_-2.14%_-4.58%_-2.14%]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" style={{ display: "block", width: "100%", height: "100%" }} src="/p2-frame-stroke.svg" />
                    </div>
                  </div>
                  <div className="absolute inset-0 overflow-clip rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/clinician.webp" alt="Vapotherm clinical dashboard"
                      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="
                mt-3 flex items-center justify-between whitespace-nowrap
                text-xs tracking-[0.04em] font-normal
                md:mt-0 md:absolute md:inset-x-0 md:bottom-0 md:h-[30px]
                md:text-sm md:opacity-0
                md:translate-y-full md:group-hover:opacity-100 md:group-hover:translate-y-0
                md:transition-all md:duration-300 md:ease-in-out
                xl:text-[16px]"
              >
                <span style={{ color: "var(--text-label)" }}>At-a-glance COPD patient management</span>
                <span style={{ color: "var(--text-company)" }}>Vapotherm</span>
              </div>
            </div>
          </a>

        </div>
      </section>
    </div>
  );
}
