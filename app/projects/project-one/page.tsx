import Link from "next/link";

export default function ProjectOne() {
  return (
    <article className="px-6 md:px-12 xl:px-24 max-w-4xl space-y-10">
      <div>
        <Link
          href="/"
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ color: "var(--text-secondary)" }}
        >
          ← Back
        </Link>
      </div>

      <header className="space-y-4">
        <h1
          className="text-2xl md:text-3xl xl:text-[36px] font-bold tracking-[0.04em]"
          style={{ color: "var(--text-primary)" }}
        >
          Project One
        </h1>
        <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--text-light)" }}>
          A one-sentence summary of the project and its purpose.
        </p>
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "Node.js"].map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded border"
              style={{ color: "var(--text-secondary)", borderColor: "#2d0e08", background: "rgba(255,255,255,0.04)" }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4 pt-2">
          <a
            href="https://github.com/yourusername/project-one"
            className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-primary)" }}
          >
            GitHub
          </a>
          <a
            href="https://project-one.example.com"
            className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-primary)" }}
          >
            Live site
          </a>
        </div>
      </header>

      <section className="space-y-4 leading-relaxed" style={{ color: "var(--text-light)" }}>
        <h2 className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
          Overview
        </h2>
        <p>Describe what the project does, what problem it solves, and who it&apos;s for.</p>
      </section>

      <section className="space-y-4 leading-relaxed" style={{ color: "var(--text-light)" }}>
        <h2 className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
          What I built
        </h2>
        <p>
          Walk through the key features and technical decisions. What were the interesting
          challenges? What did you learn?
        </p>
      </section>
    </article>
  );
}
