"use client";

import { useState } from "react";

const photos = [
  {
    src: "/about-photo-cafe.webp",
    title: "sixby @ savannah, ga",
    subtitle: "my favorite cafe",
    activity: "Drinking an espresso tonic",
  },
  {
    src: "/about-photo-canal.webp",
    title: "somewhere @ erie canal",
    subtitle: "my most peaceful moment",
    activity: "On the water",
  },
  {
    src: "/about-photo-zion.webp",
    title: "checkerboard mesa @ zion, utah",
    subtitle: "my favorite rock",
    activity: "Bouldering (inside or out) or hiking",
  },
];

// Slot positions for the 3 depth layers
// front → mid → back, cycling on each click
const slots = [
  { x: 30,  y: 44,  rotate: -1.19, z: 30 }, // front
  { x: -50, y: -10, rotate: 4.5,   z: 20 }, // mid-back
  { x: 80,  y: -8,  rotate: -3.8,  z: 10 }, // far-back
];

export default function PhotoStack() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const activePhoto = photos[activeIndex];

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* Stack */}
      <button
        onClick={handleClick}
        className="relative cursor-pointer focus:outline-none"
        style={{ width: "520px", height: "460px" }}
        aria-label="Click to see next photo"
        data-cursor="grab"
      >
        {photos.map((photo, photoIndex) => {
          // Which slot does this photo occupy?
          const slotIndex = (photoIndex - activeIndex + photos.length) % photos.length;
          const slot = slots[slotIndex];

          return (
            <div
              key={photo.src}
              className="absolute rounded-lg border overflow-hidden shadow-[0px_0px_13.8px_0px_rgba(12,3,1,0.76)]"
              style={{
                borderColor: "#2f1c18",
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
                alt={photo.title}
                style={{ display: "block", width: "100%", aspectRatio: "532/353", objectFit: "cover" }}
              />
              <div
                className="py-3 flex flex-col gap-1 items-center"
                style={{ background: "#1b0703" }}
              >
                <p
                  className="font-bold text-[13px] tracking-[0.04em] text-center whitespace-nowrap"
                  style={{ color: "var(--text-light)" }}
                >
                  {photo.title}
                </p>
                <p
                  className="font-normal text-[12px] tracking-[0.04em] text-center"
                  style={{ color: "var(--text-light)" }}
                >
                  {photo.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </button>

      {/* Activity caption — changes with active photo */}
      <p
        className="font-light tracking-[0.04em] text-center transition-opacity duration-300
          text-base md:text-lg laptop:text-[18px] xl:text-[24px]"
        style={{ color: "var(--text-light)" }}
        key={activePhoto.activity} // re-triggers fade if you add animation
      >
        {activePhoto.activity}
      </p>

    </div>
  );
}
