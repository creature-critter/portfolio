"use client";

import { useEffect, useRef, useState } from "react";

type CursorType = "default" | "pointer" | "text" | "grab" | "grabbed";

// [width, height, hotspot-x, hotspot-y]
const CURSORS: Record<CursorType, [number, number, number, number]> = {
  default: [24, 24,  2,  2],
  pointer: [24, 24,  9,  1],
  text:    [24, 24, 12, 12],
  grab:    [24, 24, 12,  6],
  grabbed: [24, 24, 12,  6],
};

const TEXT_TAGS = new Set(["p","h1","h2","h3","h4","h5","h6","span","li","label","blockquote","strong","em","code","pre","time","address"]);
const POINTER_TAGS = new Set(["a","button","select","summary"]);

function getCursorType(el: Element): CursorType {
  // Grab
  if (el.closest("[data-cursor='grab']")) return "grab";

  // Walk up checking tag names (computed style won't work — we override it to none)
  let node: Element | null = el;
  while (node && node !== document.body) {
    const tag = node.tagName.toLowerCase();
    if (POINTER_TAGS.has(tag)) return "pointer";
    if (tag === "input" || tag === "textarea") return "text";
    if (TEXT_TAGS.has(tag)) return "text";
    node = node.parentElement;
  }
  return "default";
}

export default function CustomCursor() {
  const [pos, setPos]         = useState({ x: -200, y: -200 });
  const [type, setType]       = useState<CursorType>("default");
  const [visible, setVisible] = useState(false);
  const isMouseDevice = useRef(false);

  useEffect(() => {
    // Only activate on fine-pointer (mouse) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    isMouseDevice.current = true;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const el = e.target as Element;
      setType(prev => prev === "grabbed" ? "grabbed" : getCursorType(el));
    };

    const onDown = (e: MouseEvent) => {
      const el = e.target as Element;
      if (el.closest("[data-cursor='grab']")) setType("grabbed");
    };

    const onUp = (e: MouseEvent) => {
      const el = e.target as Element;
      setType(getCursorType(el));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (!visible) return null;

  const [w, h, ox, oy] = CURSORS[type];

  return (
    <div
      className="fixed pointer-events-none z-[99999]"
      style={{
        left: pos.x - ox,
        top: pos.y - oy,
        width: w,
        height: h,
        backgroundImage: `url('/cursors/${type}.svg')`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
      }}
    />
  );
}
