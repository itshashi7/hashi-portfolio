"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { ScrollTrigger } from "@/lib/motion";

/**
 * Detail kept behind a click. The panel opens by animating grid rows 0fr → 1fr (no height measuring),
 * is `inert` while closed so hidden links can't take focus, and refreshes ScrollTrigger once the
 * layout below has moved.
 */
export function Disclosure({
  label,
  openLabel = "Close",
  children,
  className = "",
}: {
  label: string;
  openLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 select-none items-center gap-2 rounded-full border border-hairline-strong px-4 text-small text-ink transition-colors duration-[var(--dur-fast)] hover:border-ink motion-reduce:transition-none"
      >
        <Plus
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`transition-transform duration-[var(--dur-base)] ease-out-expo motion-reduce:transition-none ${open ? "rotate-45" : ""}`}
        />
        {open ? openLabel : label}
      </button>
      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-[var(--dur-slow)] ease-out-expo motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
