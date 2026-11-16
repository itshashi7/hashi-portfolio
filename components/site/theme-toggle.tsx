"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { prefersReduced } from "@/lib/motion";

const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

/** Light/dark switch. New theme is revealed radially from the button (View Transitions, 600ms). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = !mounted || resolvedTheme !== "light";
  const next = isDark ? "light" : "dark";

  const apply = () => {
    const html = document.documentElement;
    html.classList.toggle("dark", next === "dark");
    html.style.colorScheme = next;
    setTheme(next);
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (!doc.startViewTransition || prefersReduced()) {
      apply();
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const html = document.documentElement;
    html.style.setProperty("--reveal-x", `${x}px`);
    html.style.setProperty("--reveal-y", `${y}px`);
    html.style.setProperty(
      "--reveal-end",
      `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) * 1.45}px`,
    );
    html.classList.add("theme-reveal");
    doc.startViewTransition(apply).finished.finally(() => html.classList.remove("theme-reveal"));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Switch to ${next} theme`}
      className="group relative grid size-10 place-items-center overflow-hidden rounded-full bg-surface-1/80 text-ink-muted shadow-float backdrop-blur-md transition-transform duration-[var(--dur-fast)] ease-out-quart hover:text-ink active:scale-90 motion-reduce:transition-none sm:size-11"
    >
      <Sun
        size={17}
        strokeWidth={1.5}
        aria-hidden="true"
        className={`col-start-1 row-start-1 transition-[transform,opacity] duration-[var(--dur-slow)] ease-out-expo motion-reduce:transition-none ${isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"}`}
      />
      <Moon
        size={17}
        strokeWidth={1.5}
        aria-hidden="true"
        className={`col-start-1 row-start-1 transition-[transform,opacity] duration-[var(--dur-slow)] ease-out-expo motion-reduce:transition-none ${isDark ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      />
    </button>
  );
}
