"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReduced } from "@/lib/motion";
import { typingSpeed } from "@/lib/tokens";

/** A terminal/prompt line that types itself once it scrolls into view (Anime.js). */
export function PromptLine({ text, note }: { text: string; note?: string }) {
  const out = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = out.current;
    if (!el) return;
    if (prefersReduced()) {
      el.textContent = text;
      return;
    }
    el.textContent = "";
    let anim: ReturnType<typeof animate> | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const s = { n: 0 };
        anim = animate(s, {
          n: text.length,
          duration: text.length * typingSpeed,
          ease: "linear",
          modifier: (v: number) => Math.round(v),
          onUpdate: () => {
            el.textContent = text.slice(0, s.n);
          },
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      anim?.pause();
    };
  }, [text]);

  return (
    <div className="flex h-9 items-center gap-2 overflow-hidden rounded-sm bg-surface-3 px-3 font-mono text-mono text-ink-muted" title={note}>
      <span aria-hidden="true" className="text-ink-subtle">
        $
      </span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="min-w-0 truncate">
        <span ref={out}>{text}</span>
        <span className="caret" />
      </span>
    </div>
  );
}
