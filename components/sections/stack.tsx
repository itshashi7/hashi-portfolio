"use client";

import { useRef } from "react";
import { MarkGlyph } from "@/components/ui/mark";
import { useReveal } from "@/components/ui/use-reveal";
import { isDarkBrand, marks } from "@/lib/icons";
import { profile } from "@/lib/profile";

export function Stack() {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { each: 0.02 });
  return (
    <section ref={root} id="stack" aria-labelledby="stack-title" className="container-site section-gap">
      <h2 id="stack-title" data-reveal className="text-h2 text-ink wdth-heading">
        Stack.
      </h2>
      <ul className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {profile.stackLogos.map((name) => {
          const mark = marks[name];
          if (!mark) return null;
          const brand = isDarkBrand(mark.hex) ? "var(--ink)" : mark.hex;
          return (
            <li key={name} data-reveal>
              <span
                tabIndex={0}
                title={mark.note ? `${name} (${mark.note})` : name}
                className="group flex flex-col items-center gap-2.5 rounded-sm py-2 outline-offset-4"
              >
                <span className="relative grid h-8 place-items-center">
                  <MarkGlyph
                    mark={mark}
                    size={30}
                    className="text-ink-subtle transition-opacity duration-[var(--dur-fast)] group-hover:opacity-0 group-focus-visible:opacity-0"
                  />
                  <span
                    className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ color: mark.path ? brand : "var(--ink)" }}
                    aria-hidden="true"
                  >
                    <MarkGlyph mark={mark} size={30} />
                  </span>
                </span>
                <span className={mark.path ? "text-center text-caption text-ink-muted" : "sr-only"}>{name}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="mt-16 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-hairline pt-10 md:grid-cols-2">
        {profile.skills.map((g) => (
          <div key={g.group} data-reveal className="grid grid-cols-1 gap-1 sm:grid-cols-[12rem_1fr] sm:gap-4">
            <dt className="text-small font-[550] text-ink">{g.group}</dt>
            <dd className="text-small text-ink-muted [text-wrap:pretty]">{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
