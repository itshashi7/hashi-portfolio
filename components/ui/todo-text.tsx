import { isTodo } from "@/lib/profile";

/** Renders text; any "TODO:" part shows as a visible placeholder (tracked in TODO.md). */
export function TodoText({ text, className = "" }: { text: string; className?: string }) {
  const i = text.indexOf("TODO");
  if (i === -1) return <span className={className}>{text}</span>;
  const before = text.slice(0, i);
  const todo = text.slice(i);
  return (
    <span className={className}>
      {before}
      <Todo>{todo}</Todo>
    </span>
  );
}

export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-xs border border-dashed border-hairline-strong px-1.5 py-0.5 font-mono text-mono-sm text-ink-subtle">
      {children}
    </span>
  );
}

/** A link that falls back to a visible TODO when the URL isn't known yet. */
export function TodoLink({ href, children, className = "" }: { href?: string; children: React.ReactNode; className?: string }) {
  if (!href || isTodo(href)) {
    // Not a link yet: no underline or hover styling, just the label and a visible TODO.
    const plain = className.replace(/\b(underline|hover:\S+|text-ink)\b/g, "");
    return (
      <span className={`inline-flex items-center gap-2 text-ink-subtle ${plain}`}>
        {children} <Todo>TODO: link</Todo>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
      {children}
    </a>
  );
}
