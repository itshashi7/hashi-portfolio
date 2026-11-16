"use client";

import { useRef } from "react";
import { profile, projects } from "@/lib/profile";
import { TodoText } from "@/components/ui/todo-text";
import { Disclosure } from "@/components/ui/disclosure";
import { useReveal } from "@/components/ui/use-reveal";
import { useSplitReveal } from "@/components/fx/use-split-reveal";

const exp = profile.experience[0];
const edu = profile.education[0];
const workshop = projects.find((p) => p.id === "rag-mcp-workshop")!;

const JOURNEY = [
  { role: exp.role, org: exp.company, years: `${exp.start.slice(0, 4)} – ${exp.endLabel}`, current: true },
  { role: "B.E. Computer Science", org: edu.school, years: edu.end },
  { role: "RAG & MCP hands-on AI workshop", org: "Workshop", years: workshop.year },
];

export function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { selector: "[data-reveal]" });
  useSplitReveal(root);

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="container-site section-gap">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <h2 id="about-title" data-split className="text-h2 text-ink wdth-heading lg:col-span-4">
          About.
        </h2>
        <div className="lg:col-span-8">
          <p data-reveal className="text-lead text-ink measure">
            I&apos;m Hashim. I build the backend behind IZO Multi Cloud Connect at Tata Communications: the quiet machinery that connects
            enterprise networks to AWS, Azure and GCP.
          </p>
          <div data-reveal>
            <Disclosure label="A little more" openLabel="That's enough" className="mt-8">
              <div className="space-y-8 pt-6">
                <p className="text-body text-ink-muted measure">
                  I own features from the first line to the Jenkins deploy, and I chase bugs down to the root cause. I work AI-assisted with
                  GitHub Copilot and Claude Code, and I read everything they write before it ships.
                </p>
                <ol className="border-t border-hairline">
                  {JOURNEY.map((j) => (
                    <li
                      key={j.role}
                      className="grid grid-cols-1 gap-1 border-b border-hairline py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
                    >
                      <span className="text-body text-ink">
                        {j.role}
                        {j.current && <span className="sr-only"> (current)</span>}
                        <span className="text-small text-ink-muted"> · {j.org}</span>
                      </span>
                      <span className="font-mono text-mono text-ink-muted tabular">
                        <TodoText text={j.years} />
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </Disclosure>
          </div>
        </div>
      </div>
    </section>
  );
}
