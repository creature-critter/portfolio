"use client";

import { useState } from "react";
import { useTheme } from "./ThemeContext";

const photos = [
  {
    src: "/about-photo-cafe.webp",
    title: "@ sixby",
    subtitle: "in savannah, ga",
    activeTitle: "@ sixby",
    activeSubtitle: "in savannah, ga",
  },
  {
    src: "/about-photo-canal.webp",
    title: "somewhere @ erie canal",
    subtitle: "my most peaceful moment",
    activeTitle: "traveling the locks",
    activeSubtitle: "in the erie canal",
  },
  {
    src: "/about-photo-zion.webp",
    title: "checkerboard mesa @ zion, utah",
    subtitle: "my favorite rock",
    activeTitle: "exploring and hiking",
    activeSubtitle: "in zion natl. park",
  },
  {
    src: "/about-photo-sailing.png",
    title: "sailing on a boat!",
    subtitle: "somewhere tropical",
    activeTitle: "sailing on a boat!",
    activeSubtitle: "somewhere in the caribbean",
  },
];

// Slot positions for the 4 depth layers, front → back
const slots = [
  { x: 30,  y: 55, rotate: -1.19, z: 40 }, // front
  { x: 0,   y: 18, rotate:  3.09, z: 30 }, // 2nd
  { x: 58,  y: 16, rotate: -2.91, z: 20 }, // 3rd
  { x: 35,  y: 0,  rotate:  7.82, z: 10 }, // back
];

export default function PhotoStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cardBorder  = isLight ? "#f0ddc9"                      : "#2f1c18";
  const cardBg      = isLight ? "#f9ede0"                      : "#1b0703";
  const cardShadow  = isLight ? "0px 0px 13.8px 0px rgba(128,108,74,0.12)" : "0px 0px 13.8px 0px rgba(12,3,1,0.76)";

  const handleClick = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className="flex flex-col items-center w-full">

      {/* Stack */}
      <button
        onClick={handleClick}
        className="relative cursor-pointer focus:outline-none"
        style={{ width: "520px", height: "460px" }}
        aria-label="Click to see next photo"
        data-cursor="grab"
      >
        {photos.map((photo, photoIndex) => {
          const slotIndex = (photoIndex - activeIndex + photos.length) % photos.length;
          const slot = slots[slotIndex];
          const isActive = slotIndex === 0;
          const displayTitle = isActive ? photo.activeTitle : photo.title;
          const displaySubtitle = isActive ? photo.activeSubtitle : photo.subtitle;

          return (
            <div
              key={photo.src}
              className="absolute rounded-lg border overflow-hidden"
              style={{
                boxShadow: cardShadow,
                borderColor: cardBorder,
                width: "460px",
                zIndex: slot.z,
                transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.rotate}deg)`,
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s",
                willChange: "transform",
                left: 0,
                top: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={displayTitle}
                style={{ display: "block", width: "100%", aspectRatio: "532/353", objectFit: "cover" }}
              />
              <div
                className="py-3 flex flex-col gap-1 items-center"
                style={{ background: cardBg }}
              >
                <p
                  className="font-bold text-[13px] tracking-[0.04em] text-center whitespace-nowrap"
                  style={{ color: "var(--text-light)" }}
                >
                  {displayTitle}
                </p>
                <p
                  className="font-normal text-[12px] tracking-[0.04em] text-center"
                  style={{ color: "var(--text-light)" }}
                >
                  {displaySubtitle}
                </p>
              </div>
            </div>
          );
        })}
      </button>

    </div>
  );
}
