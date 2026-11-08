"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/motion";
import { distance, dur, gsapEase, stagger } from "@/lib/tokens";
import { profile, projects } from "@/lib/profile";
import { TodoText } from "@/components/ui/todo-text";
import { useReveal } from "@/components/ui/use-reveal";
import { whenIdle } from "@/lib/idle";

const exp = profile.experience[0];
const edu = profile.education[0];
const workshop = projects.find((p) => p.id === "rag-mcp-workshop")!;

const JOURNEY = [
  { role: exp.role, org: exp.company, place: profile.person.location, years: `${exp.start.slice(0, 4)} – ${exp.endLabel}`, current: true },
  { role: "B.E. Computer Science", org: edu.school, place: edu.city, years: edu.end, note: `CGPA ${edu.cgpa}` },
  { role: "RAG & MCP hands-on AI workshop", org: "Workshop", place: "—", years: workshop.year },
];

export function About() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  useReveal(root, { selector: "[data-reveal]" });

  // Journey: the rail draws down (scaleY) and rows stagger in.
  useGSAP(
    (_ctx, contextSafe) => {
      const setup = contextSafe!(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
          const journey = root.current?.querySelector("[data-journey]");
          if (!journey || journey.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already on screen
          const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
          gsap.set(rail.current, { scaleY: 0 });
          gsap.set(rows, { opacity: 0.001, x: -distance.reveal / 2 });
          gsap
            .timeline({ scrollTrigger: { trigger: journey, start: "top 75%", once: true } })
            .to(rail.current, { scaleY: 1, duration: dur.max, ease: gsapEase.outExpo })
            .to(rows, { opacity: 1, x: 0, duration: dur.slow, ease: gsapEase.outExpo, stagger: stagger.cards }, 0.1);
        });
      });
      return whenIdle(setup);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="container-site section-gap">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <h2 id="about-title" data-reveal className="text-h2 text-ink wdth-heading lg:col-span-4">
          About.
        </h2>
        <div className="space-y-5 lg:col-span-8">
          <p data-reveal className="text-lead text-ink measure">
            I&apos;m Hashim, a backend engineer at Tata Communications. I build the services behind IZO Multi Cloud Connect: REST APIs,
            service-to-service integrations and event-driven processing that connect enterprise infrastructure to AWS, Azure and GCP.
          </p>
          <p data-reveal className="text-body text-ink-muted measure">
            I own scoped features from implementation through automated testing and Jenkins deployment, and I debug methodically down to the
            root cause. Day to day I work AI-assisted with GitHub Copilot and Claude Code, and I review what they generate before it ships.
          </p>
          <p data-reveal className="text-body text-ink-muted">
            <span className="text-ink">Languages:</span> {profile.person.languages.items.join(", ")}.{" "}
            <span className="text-ink">Availability:</span> remote, or relocation to the UAE or Saudi Arabia · {profile.faq.noticePeriod.replace(/\.$/, "")} notice.
          </p>
        </div>
      </div>

      <div data-journey className="mt-20">
        <h3 data-reveal className="text-h3 text-ink wdth-heading">
          Journey.
        </h3>
        <div className="relative mt-8">
          <span ref={rail} aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-hairline-strong" />
          <ol>
            {JOURNEY.map((j) => (
              <li
                key={j.role}
                data-row
                className="relative grid grid-cols-1 gap-1 border-b border-hairline py-5 pl-8 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-baseline md:gap-6"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[1.75rem] size-[11px] rounded-full border ${j.current ? "border-accent bg-accent" : "border-hairline-strong bg-canvas"}`}
                />
                <span className="text-body text-ink">
                  {j.role}
                  {j.current && <span className="sr-only"> (current)</span>}
                </span>
                <span className="text-small text-ink-muted">
                  {j.org}
                  {j.note && <span className="text-ink-subtle"> · {j.note}</span>}
                </span>
                <span className="text-small text-ink-subtle">{j.place}</span>
                <span className="font-mono text-mono text-ink-muted tabular md:text-right">
                  <TodoText text={j.years} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
