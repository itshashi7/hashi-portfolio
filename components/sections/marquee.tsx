"use client";

import { useEffect, useState } from "react";
import LogoLoop, { type LogoItem } from "@/components/reactbits/LogoLoop";
import { whenIdle } from "@/lib/idle";
import { MarkGlyph } from "@/components/ui/mark";
import { marks } from "@/lib/icons";
import { marqueeSpeed } from "@/lib/tokens";

const NAMES = ["AWS", "Azure", "GCP", "Docker", "PostgreSQL", "Redis"] as const;

const logos: LogoItem[] = [
  {
    // Text wordmark only: no Tata Communications logo file is used.
    node: <span className="text-[22px] font-semibold leading-none tracking-[-0.02em] wdth-heading">Tata Communications</span>,
    ariaLabel: "Tata Communications",
  },
  ...NAMES.map((n) => ({
    node: (
      <span className="inline-flex items-center gap-2.5">
        <MarkGlyph mark={marks[n]} size={24} />
        {marks[n].path && <span className="text-small">{n}</span>}
      </span>
    ),
    ariaLabel: marks[n].note ? `${n} (${marks[n].note})` : n,
  })),
];

export function Marquee() {
  // The Logo Loop engine measures and animates every frame; start it once the page is idle.
  // Until then the same row renders statically, so nothing shifts.
  const [live, setLive] = useState(false);
  useEffect(() => whenIdle(() => setLive(true)), []);
  return (
    <section aria-labelledby="shipped-title" className="container-site mt-24 sm:mt-32">
      <div className="flex flex-col gap-4 border-y border-hairline py-6 md:flex-row md:items-center md:gap-10">
        <h2 id="shipped-title" className="shrink-0 text-small text-ink-subtle">
          Shipped across
        </h2>
        <div className="min-w-0 flex-1 text-ink-muted">
          {live ? (
            <LogoLoop
              logos={logos}
              speed={marqueeSpeed}
              gap={48}
              logoHeight={24}
              pauseOnHover
              fadeOut
              fadeOutWidth={0.1}
              ariaLabel="Platforms and companies Hashim has shipped on"
            />
          ) : (
            <ul
              aria-label="Platforms and companies Hashim has shipped on"
              className="flex h-[24px] items-center gap-12 overflow-hidden py-0 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]"
            >
              {logos.map((l, i) => (
                <li key={i} className="shrink-0 text-[24px] leading-none" aria-label={"ariaLabel" in l ? l.ariaLabel : undefined}>
                  {"node" in l ? l.node : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
