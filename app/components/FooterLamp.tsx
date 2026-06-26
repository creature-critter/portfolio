"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle, CSSProperties } from "react";
import { useTheme } from "./ThemeContext";

// ── Verlet chain physics ───────────────────────────────────────────────────────
// 14 points: index 0 = fixed pivot, indices 1-13 = 13 beads
const PIVOT_X   = 140.152;
const PIVOT_Y   = 155;
const N_PTS     = 14;
// Natural Y position for each point (pivot + 13 beads)
const NATURAL_Y = [155, 158.337, 161.963, 165.589, 169.216, 172.842, 176.468, 180.094, 183.72, 187.346, 190.972, 194.598, 198.224, 201.85];
// Segment rest lengths: pivot→bead0, then bead-to-bead
const SEG_LENS  = [3.337, 3.626, 3.626, 3.626, 3.626, 3.626, 3.626, 3.626, 3.626, 3.626, 3.626, 3.626, 3.626];
const GRAVITY   = 0.5;  // SVG units/frame²
const DAMP      = 0.96; // velocity decay per frame  → ~1-2 complete swings before settling
const ITERS     = 4;    // constraint iterations per frame

interface ChainState { x: number[]; y: number[]; px: number[]; py: number[] }

function initChain(): ChainState {
  const x = Array(N_PTS).fill(PIVOT_X);
  const y = [...NATURAL_Y];
  return { x, y, px: [...x], py: [...y] };
}

function stepChain(s: ChainState): ChainState {
  const nx = [...s.x];
  const ny = [...s.y];

  // Verlet integrate with damping + gravity (skip anchor)
  for (let i = 1; i < N_PTS; i++) {
    nx[i] = s.x[i] + (s.x[i] - s.px[i]) * DAMP;
    ny[i] = s.y[i] + (s.y[i] - s.py[i]) * DAMP + GRAVITY;
  }
  nx[0] = PIVOT_X; ny[0] = PIVOT_Y; // re-pin anchor

  // Satisfy distance constraints (Gauss–Seidel relaxation)
  for (let iter = 0; iter < ITERS; iter++) {
    for (let i = 0; i < N_PTS - 1; i++) {
      const dx = nx[i + 1] - nx[i];
      const dy = ny[i + 1] - ny[i];
      const d  = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const diff = (d - SEG_LENS[i]) / d;
      if (i === 0) {
        // Anchor is immovable — push only the next point
        nx[i + 1] -= dx * diff;
        ny[i + 1] -= dy * diff;
      } else {
        const h = diff * 0.5;
        nx[i]     += dx * h;
        ny[i]     += dy * h;
        nx[i + 1] -= dx * h;
        ny[i + 1] -= dy * h;
      }
    }
  }

  return { x: nx, y: ny, px: s.x, py: s.y };
}

// Chain is settled when all beads are back to hanging vertically (x ≈ pivot)
function isSettled(s: ChainState): boolean {
  for (let i = 1; i < N_PTS; i++) {
    if (Math.abs(s.x[i] - PIVOT_X) > 0.04) return false;
  }
  return true;
}

// ── Lamp SVG ──────────────────────────────────────────────────────────────────
interface LampSVGHandle { sway(): void }

const LampSVG = forwardRef<LampSVGHandle, {
  className?: string;
  style?: CSSProperties;
  isOn: boolean;
  chainPts: { x: number[]; y: number[] };
  chainDragY: number;
}>(function LampSVG({ className, style, isOn, chainPts, chainDragY }, ref) {
  const shadeGroupRef = useRef<SVGGElement>(null);
  const swayToggleRef = useRef(false);

  useImperativeHandle(ref, () => ({
    sway() {
      const el = shadeGroupRef.current;
      if (!el) return;
      // Toggling between two identical keyframe names forces the browser to
      // treat it as a new animation and restart from 0 every hover entry.
      swayToggleRef.current = !swayToggleRef.current;
      el.style.animation = swayToggleRef.current
        ? "lampSway 2.4s ease-in-out"
        : "lampSwayB 2.4s ease-in-out";
    },
  }));

  const shadeColor    = isOn ? "#EDE8DD" : "#DBD0B7";
  const shadeTopColor = isOn ? "#FFFEFB" : "#D8CCAF";

  // End cap — translate + rotate to follow the last chain segment
  const lx = chainPts.x[13], ly = chainPts.y[13] + chainDragY;
  const px = chainPts.x[12], py = chainPts.y[12] + chainDragY;
  const ddx = lx - px, ddy = ly - py;
  const dd  = Math.sqrt(ddx * ddx + ddy * ddy) || 3.626;
  // Cap top sits 3.791 units beyond the last bead
  const capX    = lx + (ddx / dd) * 3.791;
  const capY    = ly + (ddy / dd) * 3.791;
  const capAngle = Math.atan2(ddx, ddy) * 180 / Math.PI;

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 280 288"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Base */}
      <ellipse cx="186.374" cy="280.82" rx="39" ry="6.5" fill="#CD9187" />
      <rect x="147.374" y="273.32" width="78" height="8" fill="#CD9187" />
      <ellipse cx="186.374" cy="273.82" rx="39" ry="6.5" fill="#9F685E" />

      {/* Stem */}
      <path
        d="M183.874 272.13C183.874 273.511 184.994 274.63 186.374 274.63C187.755 274.63 188.874 273.511 188.874 272.13H186.374H183.874ZM139.374 65.9288H141.874V55.7389H139.374H136.874V65.9288H139.374ZM186.374 55.7389H183.874V272.13H186.374H188.874V55.7389H186.374ZM162.874 32.2389V34.7389C174.472 34.7389 183.874 44.1409 183.874 55.7389H186.374H188.874C188.874 41.3795 177.234 29.7389 162.874 29.7389V32.2389ZM139.374 55.7389H141.874C141.874 44.1409 151.276 34.7389 162.874 34.7389V32.2389V29.7389C148.515 29.7389 136.874 41.3795 136.874 55.7389H139.374Z"
        fill="#CD9187"
      />

      {/*
        Shade + cord group — pivots at (140, 66), the joint where the arm meets the shade.
        Base and stem stay fixed. The `sway()` method on the forwarded ref restarts
        the CSS animation here on each hover entry.
      */}
      <g
        ref={shadeGroupRef}
        style={{ transformBox: "view-box", transformOrigin: "140px 66px" }}
      >
        {/* Shade outer */}
        <path
          d="M139.678 60.445C139.792 60.4342 139.906 60.4342 140.02 60.445L164.226 62.7336C164.347 62.7451 164.466 62.7687 164.583 62.8041L186.351 69.4252C186.492 69.468 186.627 69.5277 186.753 69.6031L203.889 79.8327C204.059 79.9339 204.211 80.0622 204.339 80.2124L215.166 92.8975C215.342 93.104 215.47 93.3473 215.539 93.6097L219.2 107.407C219.281 107.712 219.281 108.032 219.2 108.337L215.539 122.134C215.47 122.396 215.342 122.64 215.166 122.846L204.339 135.531C204.211 135.682 204.059 135.81 203.889 135.911L186.753 146.141C186.627 146.216 186.492 146.276 186.351 146.318L164.583 152.94C164.466 152.975 164.347 152.999 164.226 153.01L140.02 155.299C139.906 155.309 139.792 155.309 139.678 155.299L115.472 153.01C115.351 152.999 115.231 152.975 115.115 152.94L93.3466 146.318C93.206 146.276 93.0711 146.216 92.9449 146.141L75.8087 135.911C75.6391 135.81 75.4872 135.682 75.3589 135.531L64.5317 122.846C64.3555 122.64 64.2279 122.396 64.1583 122.134L60.4976 108.337C60.4168 108.032 60.4168 107.712 60.4976 107.407L64.1583 93.6097C64.2279 93.3473 64.3555 93.104 64.5317 92.8975L75.3589 80.2124C75.4872 80.0622 75.6391 79.9339 75.8087 79.8327L92.9449 69.6031C93.0711 69.5277 93.206 69.468 93.3466 69.4252L115.115 62.8041C115.231 62.7687 115.351 62.7451 115.472 62.7336L139.678 60.445Z"
          fill={shadeColor}
          style={{ transition: "fill 0.5s ease" }}
        />

        {/* Shade glow layer — fades out when lamp is off */}
        <g
          filter="url(#lampGlow)"
          style={{ opacity: isOn ? 1 : 0, transition: "opacity 0.5s ease" }}
        >
          <path
            d="M139.678 60.445C139.792 60.4342 139.906 60.4342 140.02 60.445L164.226 62.7336C164.347 62.7451 164.466 62.7687 164.583 62.8041L186.351 69.4252C186.492 69.468 186.627 69.5277 186.753 69.6031L203.889 79.8327C204.059 79.9339 204.211 80.0622 204.339 80.2124L215.166 92.8975C215.342 93.104 215.47 93.3473 215.539 93.6097L219.2 107.407C219.281 107.712 219.281 108.032 219.2 108.337L215.539 122.134C215.47 122.396 215.342 122.64 215.166 122.846L204.339 135.531C204.211 135.682 204.059 135.81 203.889 135.911L186.753 146.141C186.627 146.216 186.492 146.276 186.351 146.318L164.583 152.94C164.466 152.975 164.347 152.999 164.226 153.01L140.02 155.299C139.906 155.309 139.792 155.309 139.678 155.299L115.472 153.01C115.351 152.999 115.231 152.975 115.115 152.94L93.3466 146.318C93.206 146.276 93.0711 146.216 92.9449 146.141L75.8087 135.911C75.6391 135.81 75.4872 135.682 75.3589 135.531L64.5317 122.846C64.3555 122.64 64.2279 122.396 64.1583 122.134L60.4976 108.337C60.4168 108.032 60.4168 107.712 60.4976 107.407L64.1583 93.6097C64.2279 93.3473 64.3555 93.104 64.5317 92.8975L75.3589 80.2124C75.4872 80.0622 75.6391 79.9339 75.8087 79.8327L92.9449 69.6031C93.0711 69.5277 93.206 69.468 93.3466 69.4252L115.115 62.8041C115.231 62.7687 115.351 62.7451 115.472 62.7336L139.678 60.445Z"
            fill="#FFFAED"
            fillOpacity="0.3"
          />
        </g>

        {/* Shade top opening */}
        <path
          d="M140.151 64.0547C146.351 64.0547 151.982 64.5302 156.075 65.3047C158.117 65.691 159.808 66.1572 161.002 66.6914C161.597 66.9576 162.103 67.2556 162.469 67.5938C162.834 67.9311 163.117 68.3652 163.117 68.8896C163.117 69.4143 162.834 69.8491 162.469 70.1865C162.103 70.5247 161.597 70.8217 161.002 71.0879C159.808 71.6221 158.117 72.0883 156.075 72.4746C151.982 73.2491 146.351 73.7246 140.151 73.7246C133.95 73.7246 128.32 73.2491 124.227 72.4746C122.185 72.0883 120.494 71.6221 119.3 71.0879C118.705 70.8217 118.199 70.5247 117.833 70.1865C117.468 69.8491 117.185 69.4143 117.185 68.8896C117.185 68.3651 117.468 67.9312 117.833 67.5938C118.199 67.2556 118.705 66.9576 119.3 66.6914C120.494 66.1572 122.185 65.691 124.227 65.3047C128.32 64.5302 133.95 64.0547 140.151 64.0547Z"
          fill={shadeTopColor}
          stroke="#F4F4F4"
          strokeWidth="1.20874"
          style={{ transition: "fill 0.5s ease" }}
        />

        {/* Pull-cord chain — each bead at its individually computed Verlet position */}
        {Array.from({ length: 13 }, (_, j) => (
          <circle
            key={j}
            cx={chainPts.x[j + 1]}
            cy={chainPts.y[j + 1] + chainDragY}
            r="1.20913"
            fill="#D9D9D9"
          />
        ))}

        {/* End cap — follows the direction of the last segment */}
        <path
          d="M138.719 205.641C139.196 203.81 141.71 203.81 142.188 205.641L143.11 209.18C143.418 210.36 142.558 211.52 141.376 211.52H139.531C138.349 211.52 137.489 210.36 137.796 209.18L138.719 205.641Z"
          fill="#D9D9D9"
          transform={`translate(${capX - 140.152}, ${capY - 205.641}) rotate(${capAngle}, 140.152, 205.641)`}
        />

        {/* Shade stripes */}
        <path d="M60.3743 107.002C64.3573 109.067 69.2239 110.972 74.8325 112.664C91.4476 117.675 114.435 120.784 139.849 120.784C165.263 120.784 188.25 117.675 204.865 112.664C210.474 110.972 215.34 109.067 219.323 107.002V107.756C203.301 115.963 173.707 121.47 139.849 121.47C105.991 121.47 76.3965 115.963 60.3743 107.756V107.002Z" fill="#CCBC7F" />
        <path d="M64.458 92.7954C65.1698 93.3494 65.9913 93.9012 66.925 94.4468C70.8752 96.7549 76.6316 98.8541 83.7972 100.625C98.1194 104.165 117.937 106.361 139.849 106.361C161.761 106.361 181.579 104.165 195.901 100.625C203.066 98.8541 208.823 96.7549 212.773 94.4468C213.63 93.9458 214.393 93.4399 215.063 92.9317L215.494 93.3626C205.184 101.255 175.215 106.965 139.849 106.965C104.425 106.965 74.4148 101.236 64.1528 93.3236L64.458 92.7954Z" fill="#CCBC7F" />
        <path d="M64.458 122.679C65.1698 123.233 65.9913 123.784 66.925 124.33C70.8752 126.638 76.6316 128.737 83.7972 130.508C98.1194 134.048 117.937 136.244 139.849 136.244C161.761 136.244 181.579 134.048 195.901 130.508C203.066 128.737 208.823 126.638 212.773 124.33C213.63 123.829 214.393 123.323 215.063 122.815L215.494 123.246C205.184 131.138 175.215 136.848 139.849 136.848C104.425 136.848 74.4148 131.12 64.1528 123.207L64.458 122.679Z" fill="#CCBC7F" />
        <path d="M75.6424 79.5784C76.4575 80.4272 77.6322 81.2725 79.1582 82.0962C82.4378 83.8664 87.2233 85.4796 93.188 86.8414C105.108 89.5629 121.606 91.2514 139.849 91.2514C158.092 91.2514 174.59 89.5629 186.51 86.8414C192.475 85.4796 197.26 83.8664 200.54 82.0962C201.981 81.3184 203.108 80.5211 203.916 79.72L204.343 80.1473C197.585 86.8539 171.275 91.8558 139.849 91.8558C108.201 91.8558 81.7429 86.7834 75.2151 80.0057L75.6424 79.5784Z" fill="#CCBC7F" />
        <path d="M75.6424 134.766C76.4575 135.615 77.6322 136.46 79.1582 137.284C82.4378 139.054 87.2233 140.667 93.188 142.029C105.108 144.751 121.606 146.439 139.849 146.439C158.092 146.439 174.59 144.751 186.51 142.029C192.475 140.667 197.26 139.054 200.54 137.284C201.981 136.506 203.108 135.709 203.916 134.908L204.343 135.335C197.585 142.042 171.275 147.044 139.849 147.044C108.201 147.044 81.7429 141.971 75.2151 135.193L75.6424 134.766Z" fill="#CCBC7F" />
        <path d="M186.581 69.5267C186.651 69.7158 186.688 69.9063 186.688 70.0986C186.688 74.7716 165.717 78.5598 139.849 78.5598C113.981 78.5598 93.0103 74.7716 93.0103 70.0986C93.0103 69.9688 93.0266 69.8398 93.0587 69.7114L93.7864 69.5161C93.6638 69.7303 93.6146 69.9248 93.6146 70.0986C93.6146 70.439 93.8036 70.8582 94.3618 71.351C94.9172 71.8413 95.7718 72.3425 96.9286 72.8366C99.2377 73.8227 102.616 74.7242 106.836 75.4866C115.267 77.0096 126.939 77.9554 139.849 77.9554C152.758 77.9554 164.43 77.0096 172.861 75.4866C177.082 74.7242 180.46 73.8227 182.769 72.8366C183.926 72.3425 184.781 71.8413 185.336 71.351C185.894 70.8582 186.083 70.439 186.083 70.0986C186.083 69.8707 185.998 69.6077 185.775 69.3107L186.581 69.5267Z" fill="#CCBC7F" />
      </g>

      <defs>
        <filter id="lampGlow" x="0" y="0" width="280" height="216" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="30.2185" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
});

// ── Analog clock face ─────────────────────────────────────────────────────────
function ClockFace({ now, isLight }: { now: Date | null; isLight: boolean }) {
  let hourAngle = 0;
  let minuteAngle = 0;
  let hasTime = false;

  if (now) {
    const cstStr = now.toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const [hStr, mStr, sStr] = cstStr.split(":");
    const h = parseInt(hStr), m = parseInt(mStr), s = parseInt(sStr);
    hourAngle = ((h % 12) * 60 + m) / 720 * 360;
    minuteAngle = (m * 60 + s) / 3600 * 360;
    hasTime = true;
  }

  const cx = 50, cy = 50, dotR = 35;
  const markPos = (deg: number) => {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: cx + dotR * Math.cos(rad), y: cy + dotR * Math.sin(rad) };
  };

  const faceFill     = isLight ? "#f9ede0"   : "rgb(34,8,8)";
  const faceStroke   = isLight ? "#e2cfbb"   : "rgb(78,36,28)";
  const cardinalFill = isLight ? "#9f685e"   : "#F4E8DB";
  const minuteFill   = isLight ? "#9f685e"   : "#F4E8DB";

  return (
    <svg viewBox="0 0 100 100" width="90" height="90" aria-hidden="true">
      <circle cx={cx} cy={cy} r="48" fill={faceFill} stroke={faceStroke} strokeWidth="4" />
      {[30, 60, 120, 150, 210, 240, 300, 330].map(deg => {
        const p = markPos(deg);
        return <circle key={deg} cx={p.x} cy={p.y} r="1" fill="#8BAFFF" />;
      })}
      {[0, 90, 180, 270].map(deg => {
        const p = markPos(deg);
        return <circle key={deg} cx={p.x} cy={p.y} r="3" fill={cardinalFill} />;
      })}
      {hasTime && (
        <>
          <rect x="49" y="31" width="2" height="19" rx="9" ry="9" fill="#8BAFFF" transform={`rotate(${hourAngle}, ${cx}, ${cy})`} />
          <rect x="49" y="22" width="2" height="28" rx="4" ry="4" fill={minuteFill} transform={`rotate(${minuteAngle}, ${cx}, ${cy})`} />
        </>
      )}
    </svg>
  );
}

// ── Clock badge + tooltip ─────────────────────────────────────────────────────
function NicoleTimeBadge() {
  const { theme } = useTheme();
  const [now, setNow] = useState<Date | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const show = () => { if (hideTimer.current) clearTimeout(hideTimer.current); setShowTooltip(true); };
  const hide = () => { hideTimer.current = setTimeout(() => setShowTooltip(false), 150); };

  const time = now
    ? now.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "2-digit", minute: "2-digit", hour12: false })
    : "--:--";

  const isLight = theme === "light";

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <ClockFace now={now} isLight={isLight} />
      <div
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          background: "var(--tooltip-bg)",
          borderRadius: 8,
          padding: "8px 12px",
          whiteSpace: "nowrap",
          zIndex: 20,
          opacity: showTooltip ? 1 : 0,
          pointerEvents: showTooltip ? "auto" : "none",
          transition: "opacity 0.15s ease",
          boxShadow: "var(--tooltip-shadow)",
        }}
      >
        <p className="tracking-[0.04em]" style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 400 }}>
          {"Nicole's time is "}<span style={{ fontWeight: 500 }}>{time}</span>
        </p>
      </div>
    </div>
  );
}

// ── Books ─────────────────────────────────────────────────────────────────────
const BOOKS = [
  { color: "#D4A171", w: 7,  h: 56, left: 6,  hoverLeft: -42, hoverRotation: 45, delay: "0.12s" },
  { color: "#7BA883", w: 18, h: 70, left: 12, hoverLeft: -2,  hoverRotation: 12, delay: "0.06s" },
  { color: "#BDD1FF", w: 12, h: 70, left: 30, hoverLeft: 30,  hoverRotation: 0,  delay: "0s"    },
] as const;

function Books() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      style={{ width: 56, height: 80 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {BOOKS.map((book, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 0,
            left: hovered ? book.hoverLeft : book.left,
            width: book.w,
            height: book.h,
            transition: `left 0.5s cubic-bezier(0.34, 1.1, 0.64, 1) ${book.delay}`,
            zIndex: (hovered && book.hoverRotation > 30) ? 1 : undefined,
          }}
        >
          <div
            style={{
              width: book.w,
              height: book.h,
              background: book.color,
              borderRadius: 2,
              transformOrigin: "center bottom",
              transition: `transform 0.5s cubic-bezier(0.34, 1.1, 0.64, 1) ${book.delay}`,
              transform: hovered ? `rotate(${book.hoverRotation}deg)` : "rotate(0deg)",
            }}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          right: "calc(100% + 16px)",
          bottom: 0,
          background: "var(--tooltip-bg)",
          borderRadius: 8,
          padding: "8px 12px",
          width: 277,
          zIndex: 20,
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
          transition: "opacity 0.2s ease",
          boxShadow: "var(--tooltip-shadow)",
        }}
      >
        <p className="tracking-[0.04em]" style={{ color: "var(--tooltip-label)", fontSize: 16, fontWeight: 400, lineHeight: 1.4 }}>
          Currently reading -
        </p>
        <p className="tracking-[0.04em]" style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 500, lineHeight: 1.4 }}>
          The Brothers Karamazov by Fyodor Dostoevsky
        </p>
      </div>
    </div>
  );
}

// ── FooterLamp ────────────────────────────────────────────────────────────────
export default function FooterLamp() {
  const { theme, toggle } = useTheme();
  const isOn = theme === "dark";

  // Lamp sway — calls sway() on the LampSVG's internal shade group via imperative handle
  const lampRef = useRef<LampSVGHandle>(null);

  const onLampEnter = useCallback(() => {
    lampRef.current?.sway();
  }, []);

  // Verlet chain state
  const chainRef = useRef<ChainState>(initChain());
  const rafRef   = useRef<number | null>(null);
  const [chainPts, setChainPts] = useState<{ x: number[]; y: number[] }>(() => ({
    x: chainRef.current.x,
    y: chainRef.current.y,
  }));

  // Drag state
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const [chainDragY, setChainDragY] = useState(0);

  const startPhysics = useCallback(() => {
    if (rafRef.current !== null) return;
    const tick = () => {
      chainRef.current = stepChain(chainRef.current);
      setChainPts({ x: chainRef.current.x, y: chainRef.current.y });
      if (!isSettled(chainRef.current)) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        chainRef.current = initChain();
        setChainPts({ x: chainRef.current.x, y: chainRef.current.y });
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  const onChainEnter = useCallback(() => {
    if (isDraggingRef.current) return;
    // Horizontal impulse: velocity_x = x[i] - px[i], so px[i] -= v gives +x velocity
    for (let i = 1; i < N_PTS; i++) {
      chainRef.current.px[i] -= 2.5;
    }
    startPhysics();
  }, [startPhysics]);

  const onChainPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    chainRef.current = initChain();
    setChainPts({ x: chainRef.current.x, y: chainRef.current.y });
    setChainDragY(0);
  }, []);

  const onChainPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const delta = Math.max(0, e.clientY - dragStartYRef.current);
    setChainDragY(Math.min(delta * (288 / 230), 28));
  }, []);

  const onChainPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const delta = e.clientY - dragStartYRef.current;
    setChainDragY(0);
    const isClick = Math.abs(delta) < 5;
    const isPull  = delta >= 30;
    if (isClick || isPull) {
      toggle();
      // Crack-the-whip: lower beads get proportionally more swing
      for (let i = 1; i < N_PTS; i++) {
        chainRef.current.px[i] -= (isPull ? 4.0 : 3.0) * (1 + i * 0.05);
      }
    } else {
      for (let i = 1; i < N_PTS; i++) {
        chainRef.current.px[i] -= 1.5;
      }
    }
    startPhysics();
  }, [toggle, startPhysics]);

  return (
    <div className="block shrink-0" onMouseEnter={onLampEnter}>
      <div className="relative" style={{ width: 245, height: 258 }}>

        {/* Clock — behind lamp */}
        <div style={{ position: "absolute", top: 50, right: 0 }}>
          <NicoleTimeBadge />
        </div>

        {/* Lamp SVG — pointer-events none so bounding box doesn't block clock */}
        <div style={{ position: "absolute", bottom: 0, right: 24, pointerEvents: "none" }}>
          <LampSVG
            ref={lampRef}
            style={{ height: 230, width: "auto" }}
            isOn={isOn}
            chainPts={chainPts}
            chainDragY={chainDragY}
          />
        </div>

        {/* Shade interaction overlay — ellipse matching the shade shape */}
        <div
          style={{
            position: "absolute",
            left: 45,
            top: 76,
            width: 128,
            height: 76,
            borderRadius: "50%",
            zIndex: 10,
            cursor: "pointer",
          }}
          onClick={() => { toggle(); lampRef.current?.sway(); }}
        />

        {/*
          Chain interaction overlay — absolutely positioned over the chain in SVG space.
          SVG is ~224×230px at bottom:0, right:24. Chain center x ≈ 112px from SVG left.
        */}
        <div
          style={{
            position: "absolute",
            left: 94,
            top: 150,
            width: 32,
            height: 56,
            zIndex: 10,
          }}
          onMouseEnter={onChainEnter}
          onPointerDown={onChainPointerDown}
          onPointerMove={onChainPointerMove}
          onPointerUp={onChainPointerUp}
        />

        {/* Books */}
        <div style={{ position: "absolute", bottom: 0, left: 197, zIndex: 5 }}>
          <Books />
        </div>
      </div>
    </div>
  );
}
