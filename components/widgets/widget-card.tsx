"use client";

import { RotateCcw } from "lucide-react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export function WidgetCard({
  title,
  description,
  onReset,
  children,
  footer,
}: {
  title: string;
  description: string;
  onReset?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <SpotlightCard
      data-reveal
      spotlightColor="var(--ink)"
      intensity={0.06}
      borderGlow={0.35}
      flare={false}
      spotlightSize={220}
      className="mb-4 break-inside-avoid border-0 p-5 sm:p-6"
      style={
        {
          "--spotlight-card-surface": "var(--surface-1)",
          "--spotlight-card-border": "var(--hairline)",
          "--spotlight-card-shadow": "none",
        } as React.CSSProperties
      }
    >
      <article aria-label={title}>
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[1rem] font-[550] leading-snug tracking-[-0.01em] text-ink">{title}</h3>
            <p className="mt-0.5 text-caption text-ink-subtle">{description} · Illustrative demo</p>
          </div>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label={`Reset ${title}`}
              className="grid size-8 shrink-0 place-items-center rounded-full border border-hairline text-ink-subtle hover:border-hairline-strong hover:text-ink"
            >
              <RotateCcw size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
          )}
        </header>
        <div className="rounded-md bg-surface-3 p-4">{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </article>
    </SpotlightCard>
  );
}

export function WidgetButton({
  children,
  onClick,
  pressed,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      disabled={disabled}
      className={`h-8 rounded-full border px-3 text-caption disabled:opacity-50 ${
        pressed ? "border-accent bg-surface-2 text-ink" : "border-hairline-strong text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
