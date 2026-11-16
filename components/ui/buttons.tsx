import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentType, ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

type Icon = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;
const ease = "ease-out-expo motion-reduce:transition-none";

/** An icon that rolls out and a copy rolls in on hover (the "arrow slide"). Parent needs `group/btn`. */
export function RollIcon({ icon: I = ArrowUpRight, dir = "up-right" }: { icon?: Icon; dir?: "up-right" | "down" }) {
  const out =
    dir === "down"
      ? "group-hover/btn:translate-y-[170%] group-focus-visible/btn:translate-y-[170%]"
      : "group-hover/btn:translate-x-[170%] group-hover/btn:-translate-y-[170%] group-focus-visible/btn:translate-x-[170%] group-focus-visible/btn:-translate-y-[170%]";
  const enter =
    dir === "down"
      ? "-translate-y-[170%] group-hover/btn:translate-y-0 group-focus-visible/btn:translate-y-0"
      : "-translate-x-[170%] translate-y-[170%] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0 group-focus-visible/btn:translate-x-0 group-focus-visible/btn:translate-y-0";
  return (
    <span aria-hidden="true" className="relative inline-grid size-4 place-items-center overflow-hidden">
      <I size={16} strokeWidth={1.5} className={`col-start-1 row-start-1 transition-transform duration-[var(--dur-slow)] ${ease} ${out}`} />
      <I size={16} strokeWidth={1.5} className={`col-start-1 row-start-1 transition-transform duration-[var(--dur-slow)] ${ease} ${enter}`} />
    </span>
  );
}

/** Text that rolls up to a second copy on hover/focus. Put it inside an element with `group` (or `group/btn` and on="btn"). */
export function RollText({ children, alt, on = "group" }: { children: string; alt?: string; on?: "group" | "btn" }) {
  const out = on === "btn" ? "group-hover/btn:-translate-y-full group-focus-visible/btn:-translate-y-full" : "group-hover:-translate-y-full group-focus-visible:-translate-y-full";
  const enter = on === "btn" ? "group-hover/btn:translate-y-0 group-focus-visible/btn:translate-y-0" : "group-hover:translate-y-0 group-focus-visible:translate-y-0";
  return (
    <span className="relative -mb-[0.12em] inline-grid overflow-hidden pb-[0.12em] align-bottom">
      <span className={`col-start-1 row-start-1 whitespace-nowrap transition-transform duration-[var(--dur-slow)] ${ease} ${out}`}>{children}</span>
      <span aria-hidden="true" className={`col-start-1 row-start-1 translate-y-full whitespace-nowrap transition-transform duration-[var(--dur-slow)] ${ease} ${enter}`}>
        {alt ?? children}
      </span>
    </span>
  );
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode; icon?: Icon; dir?: "up-right" | "down" };

/** Primary pill: a light sheen sweeps across on hover while the arrow rolls through. Press squeezes it. */
export function ShineLink({ children, icon = ArrowDown, dir = "down", className = "", ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      className={`group/btn relative isolate inline-flex h-11 select-none items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-5 text-small font-[550] text-canvas shadow-[inset_0_1px_0_rgb(255_255_255/0.22),inset_0_-1px_0_rgb(0_0_0/0.18)] transition-transform duration-[var(--dur-fast)] ease-out-quart active:scale-[0.97] motion-reduce:transition-none ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-[55%] z-[1] w-[45%] -skew-x-12 bg-canvas/35 transition-transform duration-0 group-hover/btn:translate-x-[430%] group-hover/btn:duration-[var(--dur-max)] group-hover/btn:ease-out-quart group-focus-visible/btn:translate-x-[430%] group-focus-visible/btn:duration-[var(--dur-max)] motion-reduce:hidden"
      />
      <span className="relative z-[2] inline-flex items-center gap-2">
        {children}
        <RollIcon icon={icon} dir={dir} />
      </span>
    </a>
  );
}

const waveD = "M0 12C20 2 40 2 60 12s40 10 60 0 40-10 60 0 40 10 60 0v12H0Z";

function LiquidFace({ children, icon: I }: { children: ReactNode; icon?: Icon }) {
  const body = (
    <span className="inline-flex items-center gap-2 px-5 text-small font-[550]">
      {I && <I size={16} strokeWidth={1.5} aria-hidden="true" />}
      {children}
    </span>
  );
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className={`absolute inset-0 translate-y-[calc(100%+24px)] text-ink transition-transform duration-[var(--dur-max)] ${ease} group-hover/btn:translate-y-0 group-focus-visible/btn:translate-y-0`}>
          <svg viewBox="0 0 240 24" preserveAspectRatio="none" className="motion-safe-anim absolute -top-5 left-0 h-6 w-[200%] animate-[wave-drift_2.4s_linear_infinite] fill-current [animation-play-state:paused] group-hover/btn:[animation-play-state:running]">
            <path d={waveD} />
          </svg>
          <span className="absolute inset-0 bg-ink" />
          <span className="absolute inset-0 overflow-hidden text-canvas">
            <span className={`absolute inset-0 grid -translate-y-[calc(100%+24px)] place-items-center transition-transform duration-[var(--dur-max)] ${ease} group-hover/btn:translate-y-0 group-focus-visible/btn:translate-y-0`}>{body}</span>
          </span>
        </span>
      </span>
      <span className="relative">{body}</span>
    </>
  );
}

const liquidBase =
  "group/btn relative isolate inline-flex h-11 select-none items-center justify-center overflow-hidden rounded-full border border-hairline-strong bg-surface-1 text-ink transition-transform duration-[var(--dur-fast)] ease-out-quart active:scale-[0.97] motion-reduce:transition-none";

/** Secondary pill: a wave of ink rises through it on hover, and the label inverts exactly where the fill passes. */
export function LiquidLink({ children, icon, className = "", ...rest }: LinkProps) {
  return (
    <a {...rest} className={`${liquidBase} ${className}`}>
      <LiquidFace icon={icon}>{children}</LiquidFace>
    </a>
  );
}

export function LiquidButton({ children, icon, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: Icon }) {
  return (
    <button type="button" {...rest} className={`${liquidBase} ${className}`}>
      <LiquidFace icon={icon}>{children}</LiquidFace>
    </button>
  );
}

/** Nav CTA: a breathing status dot (you're available) with an echo trail on hover, and a label that rolls. */
export function HireLink({ href, label = "Hire me", alt = "Say hello" }: { href: string; label?: string; alt?: string }) {
  return (
    <a
      href={href}
      className="group/btn relative inline-flex h-11 select-none items-center gap-2.5 overflow-hidden rounded-full bg-ink px-3.5 text-small font-[550] text-canvas shadow-float transition-transform duration-[var(--dur-fast)] ease-out-quart active:scale-[0.97] motion-reduce:transition-none sm:pl-1.5 sm:pr-4"
    >
      <span aria-hidden="true" className="relative hidden size-8 place-items-center sm:grid">
        <span className={`absolute inset-0 rounded-full bg-canvas/20 opacity-0 transition-[transform,opacity] duration-[var(--dur-slow)] ${ease} group-hover/btn:-translate-x-3 group-hover/btn:opacity-100`} />
        <span className={`absolute inset-0 rounded-full bg-canvas/10 opacity-0 transition-[transform,opacity] duration-[var(--dur-slow)] delay-[40ms] ${ease} group-hover/btn:-translate-x-6 group-hover/btn:opacity-100`} />
        <span className={`relative grid size-8 place-items-center rounded-full bg-canvas transition-transform duration-[var(--dur-slow)] ${ease} group-hover/btn:scale-110`}>
          <span className="motion-safe-anim size-2 animate-[dot-breathe_2.2s_ease-in-out_infinite] rounded-full bg-accent" />
        </span>
      </span>
      <RollText on="btn" alt={alt}>
        {label}
      </RollText>
    </a>
  );
}
