import type { Mark as MarkT } from "@/lib/icons";
import { symbolId } from "./icon-sprite";

/** A simple-icons glyph (from the shared sprite), or a text wordmark when the mark isn't available. */
export function MarkGlyph({ mark, size = 28, className = "" }: { mark: MarkT; size?: number; className?: string }) {
  if (!mark.path) {
    return (
      <span
        className={`inline-flex items-center font-semibold leading-none tracking-[-0.02em] wdth-heading ${className}`}
        style={{ fontSize: Math.round(size * 0.72), height: size }}
        aria-hidden="true"
      >
        {mark.name}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" focusable="false" fill="currentColor">
      <use href={`#${symbolId(mark.name)}`} />
    </svg>
  );
}
