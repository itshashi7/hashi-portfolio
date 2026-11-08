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
      className="grid size-10 place-items-center rounded-full bg-surface-1/80 sm:size-11 text-ink-muted shadow-float backdrop-blur-md hover:text-ink"
    >
      {isDark ? <Sun size={17} strokeWidth={1.5} aria-hidden="true" /> : <Moon size={17} strokeWidth={1.5} aria-hidden="true" />}
    </button>
  );
}
