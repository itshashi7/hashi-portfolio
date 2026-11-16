"use client";

import { useRef } from "react";
import { BriefcaseBusiness, FlaskConical, House, Layers, UserRound } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/motion";
import { dur, gsapEase } from "@/lib/tokens";
import { SECTIONS, setActiveSection, useActiveSection, type SectionId } from "@/lib/active-section";
import { mailto } from "@/lib/profile";
import { HireLink, RollText } from "@/components/ui/buttons";
import { Thumb, useThumb } from "@/components/ui/use-thumb";
import { ThemeToggle } from "./theme-toggle";

const ICONS: Record<SectionId, typeof House> = {
  home: House,
  work: BriefcaseBusiness,
  experiments: FlaskConical,
  about: UserRound,
  stack: Layers,
};

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const active = useActiveSection();
  const { box: thumbBox, thumb } = useThumb<HTMLElement>([active]);

  useGSAP(() => {
    // Scroll-spy: the last section whose top has passed the upper third of the viewport is active.
    // Section offsets are measured on every ScrollTrigger refresh (pins, Flip, resize), then compared
    // against the scroll position on each update, so the state can never go stale and never reads layout per frame.
    let tops: { id: SectionId; top: number }[] = [];
    const measure = () => {
      tops = SECTIONS.flatMap(({ id }) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top + window.scrollY }] : [];
      });
    };
    const pick = (y: number) => {
      let current: SectionId = "home";
      for (const t of tops) if (t.top <= y + window.innerHeight * 0.35) current = t.id;
      setActiveSection(current);
    };
    const onRefresh = () => {
      measure();
      pick(window.scrollY);
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => pick(self.scroll()) });
    onRefresh();

    // Hide on scroll-down, show on scroll-up (transform only).
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const show = gsap.quickTo(bar.current, "yPercent", { duration: dur.base, ease: gsapEase.outExpo });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          show(self.direction === 1 && y > 240 ? -160 : 0);
        },
      });
    });
    return () => ScrollTrigger.removeEventListener("refresh", onRefresh);
  });

  return (
    <header
      ref={bar}
      className="fixed inset-x-0 top-4 z-[var(--z-nav)] flex justify-center px-[var(--gutter)] sm:top-6"
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        <nav
          ref={thumbBox}
          data-thumb="off"
          aria-label="Primary"
          className="relative flex h-11 items-center gap-0.5 rounded-full bg-surface-1/80 p-1 shadow-float backdrop-blur-md"
        >
          <Thumb thumbRef={thumb} />
          {SECTIONS.map(({ id, label }) => {
            const Icon = ICONS[id];
            const on = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                data-active={on}
                aria-current={on ? "location" : undefined}
                className={`group relative flex h-9 items-center gap-2 rounded-full px-2.5 text-small sm:px-3 ${
                  on ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                <span className="sr-only md:not-sr-only">
                  <RollText>{label}</RollText>
                </span>
                {on && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent md:static md:translate-x-0"
                  />
                )}
              </a>
            );
          })}
        </nav>
        <HireLink href={mailto()} />
        <ThemeToggle />
      </div>
    </header>
  );
}
