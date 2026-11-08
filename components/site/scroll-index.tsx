"use client";

import { SECTIONS, useActiveSection } from "@/lib/active-section";

/** Left-edge section index (≥1024px): one tick per section, the active one longer. */
export function ScrollIndex() {
  const active = useActiveSection();
  return (
    <nav
      aria-label="Sections on this page"
      className="fixed left-4 top-1/2 z-[var(--z-sticky)] hidden -translate-y-1/2 flex-col gap-1 lg:flex"
    >
      {SECTIONS.map(({ id, label }) => {
        const on = active === id;
        return (
          <a key={id} href={`#${id}`} className="group flex h-6 items-center" aria-current={on ? "location" : undefined}>
            <span className="sr-only">{label}</span>
            <span
              aria-hidden="true"
              className={`block h-px w-10 origin-left transition-transform duration-[var(--dur-base)] ease-out-expo ${
                on ? "scale-x-100 bg-ink" : "scale-x-[0.4] bg-ink-subtle group-hover:scale-x-[0.7]"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
