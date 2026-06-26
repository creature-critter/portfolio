"use client";

import FooterText from "./FooterText";
import FooterLamp from "./FooterLamp";

export default function FooterClient() {
  return (
    <div className="w-full flex flex-col items-center gap-8
      laptop:flex-row laptop:items-end laptop:justify-between"
    >
      <FooterText />
      <FooterLamp />
    </div>
  );
}
