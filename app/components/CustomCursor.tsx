"use client";

import { useEffect, useRef } from "react";

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
  const elRef   = useRef<HTMLDivElement>(null);
  const typeRef = useRef<CursorType>("default");

  useEffect(() => {
    // Only activate on fine-pointer (mouse) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = elRef.current;
    if (!el) return;

    function applyType(t: CursorType) {
      if (!el) return;
      typeRef.current = t;
      const [w, h, ox, oy] = CURSORS[t];
      el.style.width           = `${w}px`;
      el.style.height          = `${h}px`;
      el.style.backgroundImage = `url('/cursors/${t}.svg')`;
      // keep hotspot offset in sync
      el.dataset.ox = String(ox);
      el.dataset.oy = String(oy);
    }

    applyType("default");

    const onMove = (e: MouseEvent) => {
      const [,, ox, oy] = CURSORS[typeRef.current];
      el.style.transform  = `translate(${e.clientX - ox}px, ${e.clientY - oy}px)`;
      el.style.visibility = "visible";
      const target = e.target as Element;
      if (typeRef.current !== "grabbed") applyType(getCursorType(target));
    };

    const onDown = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("[data-cursor='grab']")) applyType("grabbed");
    };

    const onUp   = (e: MouseEvent) => applyType(getCursorType(e.target as Element));
    const onLeave = () => { el.style.visibility = "hidden"; };
    const onEnter = () => { el.style.visibility = "visible"; };

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

  return (
    <div
      ref={elRef}
      className="fixed pointer-events-none z-[99999]"
      style={{
        top: 0,
        left: 0,
        visibility: "hidden",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
        willChange: "transform",
      }}
    />
  );
}
