"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "./ThemeContext";

const WONDER_LETTERS = ["w", "o", "n", "d", "e", "r", "f", "u", "l"];

function ArrowOutward() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M16.7268 5C17.2791 5.00003 17.7268 5.44774 17.7268 6C17.7268 6.05691 17.726 7.59629 17.7405 9.92969C17.814 11.1845 17.8706 11.8335 17.9622 12.3535L17.9739 12.417L17.9768 12.4805C17.9933 12.833 17.9925 13.4186 17.9925 13.9785C17.9925 14.5308 17.5447 14.9785 16.9925 14.9785C16.4403 14.9783 15.9925 14.5307 15.9925 13.9785C15.9925 13.4187 15.9918 12.9132 15.9798 12.6133C15.8741 11.9778 15.8139 11.2252 15.7434 10.0166L15.7415 9.99121V9.96484C15.7379 9.38362 15.7367 8.85114 15.7347 8.37793C15.6791 8.44627 15.6324 8.51066 15.5901 8.57715L15.5432 8.65137L15.4827 8.7168C15.1064 9.12683 14.8626 9.36112 14.6614 9.66113C14.4604 9.961 14.0705 10.5772 13.6624 10.9658C13.402 11.2137 13.0976 11.5379 12.7805 11.9785C12.5975 12.233 12.3968 12.4383 12.2376 12.5986C12.0671 12.7703 11.9436 12.8919 11.8225 13.0381C11.4426 13.4968 11.1055 13.8553 10.7034 14.251C9.75569 15.1834 9.05463 15.8334 8.75321 16.1699C8.54307 16.4046 8.33163 16.6191 8.14285 16.8096C7.94796 17.0062 7.78401 17.1705 7.63797 17.3301C7.43503 17.5517 7.20702 17.7514 7.00125 17.9062C6.82618 18.038 6.56808 18.2128 6.31473 18.2969C5.7908 18.4705 5.22512 18.1868 5.05106 17.6631C4.88313 17.1568 5.14286 16.6122 5.63309 16.4189C5.63714 16.4168 5.64484 16.4127 5.65555 16.4062C5.68889 16.3861 5.73811 16.3528 5.79813 16.3076C5.92025 16.2157 6.05493 16.098 6.16336 15.9795C6.34274 15.7836 6.54064 15.5853 6.72196 15.4023C6.90948 15.2131 7.08944 15.0287 7.26297 14.835C7.61929 14.4372 8.44053 13.6708 9.30008 12.8252C9.66254 12.4686 9.95269 12.1599 10.2825 11.7617C10.475 11.5293 10.6763 11.3328 10.8186 11.1895C10.9724 11.0347 11.0738 10.9256 11.1565 10.8105C11.5606 10.249 11.9528 9.83242 12.2835 9.51758C12.4884 9.32243 12.7254 8.9579 13.0003 8.54785C13.2964 8.10625 13.6878 7.7092 13.9622 7.41406C14.0225 7.32562 14.0868 7.23834 14.1546 7.15332C13.4553 7.16874 12.579 7.18531 11.5735 7.19141C10.7349 7.20572 10.731 7.23138 10.386 7.25C10.0728 7.26688 9.57066 7.2666 9.10281 7.2666C8.55067 7.2666 8.10305 6.81869 8.10281 6.2666C8.10281 5.71432 8.55053 5.2666 9.10281 5.2666C9.59925 5.2666 10.0333 5.26617 10.2786 5.25293C10.4918 5.24141 10.6646 5.20732 11.5403 5.19238H11.5511C13.979 5.17781 15.627 5.1159 15.8167 5.10547C16.0457 5.09285 16.2164 5.09056 16.3118 5.08984C16.4382 5.03212 16.5788 5 16.7268 5Z" />
    </svg>
  );
}

export default function FooterText() {
  const [waving, setWaving] = useState(false);
  const { theme } = useTheme();
  const accentColor = theme === "light" ? "#6A8CDA" : "#bdd1ff";
  const waveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = useCallback(() => {
    if (waveTimer.current) clearTimeout(waveTimer.current);
    setWaving(true);
  }, []);

  const onLeave = useCallback(() => {
    // Last letter starts at 8*0.05s = 0.4s, animation runs 0.65s → full cycle ends at ~1.05s
    waveTimer.current = setTimeout(() => setWaving(false), 800);
  }, []);

  return (
    <div
      className="flex flex-col gap-6 items-center laptop:items-start"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <p
        className="font-bold tracking-[0.04em] leading-snug text-center laptop:text-left
          text-2xl md:text-3xl laptop:text-[28px] xl:text-[36px]"
        style={{ color: "var(--text-primary)" }}
      >
        {"let's make something "}
        <span>
          {WONDER_LETTERS.map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: accentColor,
                animation: waving
                  ? `wonderWave 0.65s ease-in-out ${i * 0.05}s 1 both`
                  : "none",
              }}
            >
              {letter}
            </span>
          ))}
        </span>
        {" together <3"}
      </p>

      {/* Links row */}
      <div className="flex flex-col items-center gap-y-2 md:flex-row md:flex-wrap md:items-center md:gap-x-4 text-sm xl:text-[16px] tracking-[0.04em] font-normal">
        <a
          href="mailto:hello@nicole-mills.com"
          className="flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity whitespace-nowrap"
          style={{ color: "var(--text-primary)" }}
        >
          hello@nicole-mills.com
          <span style={{ color: accentColor, display: "inline-flex" }}>
            <ArrowOutward />
          </span>
        </a>
        <span className="hidden md:inline" style={{ color: "var(--text-primary)", opacity: 0.4 }}>·</span>
        <a
          href="https://www.linkedin.com/in/nicolemills-design"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity"
          style={{ color: "var(--text-primary)" }}
        >
          linkedin
          <span style={{ color: accentColor, display: "inline-flex" }}>
            <ArrowOutward />
          </span>
        </a>
        <span className="hidden md:inline" style={{ color: "var(--text-primary)", opacity: 0.4 }}>·</span>
        <a
          href="/resume.pdf"
          target="_blank"
          className="flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity"
          style={{ color: "var(--text-primary)" }}
        >
          resume
          <span style={{ color: accentColor, display: "inline-flex" }}>
            <ArrowOutward />
          </span>
        </a>
      </div>
    </div>
  );
}
