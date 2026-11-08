"use client";

import { useRef, useState } from "react";
import { ArrowRight, GalleryVerticalEnd, LayoutGrid, Rows3 } from "lucide-react";
import { Flip, gsap, ScrollTrigger, useGSAP, prefersReduced, useReducedMotion, MOTION_OK } from "@/lib/motion";
import { dur, gsapEase } from "@/lib/tokens";
import { categories, projects, type Category, type Project } from "@/lib/profile";
import { PromptLine } from "@/components/works/prompt-line";
import { Schematic } from "@/components/works/schematic";
import { TodoLink, TodoText } from "@/components/ui/todo-text";
import { useReveal } from "@/components/ui/use-reveal";

type View = "showcase" | "grid" | "deck";
type Filter = "All" | Category;

const VIEWS: { id: View; label: string; Icon: typeof Rows3 }[] = [
  { id: "showcase", label: "Showcase", Icon: Rows3 },
  { id: "grid", label: "Grid", Icon: LayoutGrid },
  { id: "deck", label: "Deck", Icon: GalleryVerticalEnd },
];

const count = (f: Filter) => (f === "All" ? projects.length : projects.filter((p) => p.categories.includes(f)).length);

export function Works() {
  const root = useRef<HTMLElement>(null);
  const flip = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const pendingScroll = useRef<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<View>("showcase");
  const list = projects.filter((p) => filter === "All" || p.categories.includes(filter));

  useReveal(root, { selector: "[data-reveal]" });

  const change = (fn: () => void, nextView: View = view) => {
    if (!prefersReduced() && view !== "deck" && nextView !== "deck") {
      flip.current = Flip.getState(gsap.utils.toArray("[data-flip-id]", root.current));
    }
    fn();
  };

  // Layout change: Flip the card frames (transform only), fade their contents in.
  useGSAP(
    () => {
      const state = flip.current;
      flip.current = null;
      if (state) {
        Flip.from(state, {
          duration: dur.max,
          ease: gsapEase.outExpo,
          scale: true,
          absolute: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: dur.slow, ease: gsapEase.outExpo }),
          onComplete: () => ScrollTrigger.refresh(),
        });
        gsap.fromTo(
          gsap.utils.toArray("[data-flip-id] > *", root.current),
          { opacity: 0 },
          { opacity: 1, duration: dur.base, delay: dur.fast, ease: gsapEase.outQuart },
        );
      } else {
        ScrollTrigger.refresh();
      }
      if (pendingScroll.current) {
        document.getElementById(pendingScroll.current)?.scrollIntoView({ block: "start" });
        pendingScroll.current = null;
      }
    },
    { dependencies: [filter, view], scope: root },
  );

  const openCase = (id: string) => {
    pendingScroll.current = `case-${id}`;
    change(() => setView("showcase"), "showcase");
  };

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="container-site section-gap">
      <h2 id="work-title" data-reveal className="text-h2 text-ink wdth-heading">
        Selected work.
      </h2>

      <div data-reveal className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-1 self-start rounded-full border border-hairline bg-surface-1 p-1">
          {(["All", ...categories] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => change(() => setFilter(f))}
              className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-small ${
                filter === f ? "bg-surface-2 text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              {f}
              <span className={`font-mono text-mono-sm tabular ${filter === f ? "text-accent-text" : "text-ink-subtle"}`}>{count(f)}</span>
            </button>
          ))}
        </div>
        <div role="group" aria-label="Layout" className="flex gap-1 self-start rounded-full border border-hairline bg-surface-1 p-1">
          {VIEWS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => change(() => setView(id), id)}
              className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-small ${
                view === id ? "bg-surface-2 text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {list.length} of {projects.length} projects, {view} layout
      </p>
      <p aria-hidden="true" className="mt-4 font-mono text-mono-sm text-ink-subtle tabular">
        Showing {list.length} of {projects.length} projects
      </p>

      <div className="mt-8">
        {view === "showcase" && (
          <div className="space-y-6">
            {list.map((p) => (
              <CaseStudy key={p.id} p={p} />
            ))}
          </div>
        )}
        {view === "grid" && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.id} data-flip-id={p.id} className="flex flex-col rounded-lg border border-hairline bg-surface-1 p-6">
                <GridCard p={p} onOpen={() => openCase(p.id)} />
              </li>
            ))}
          </ul>
        )}
        {view === "deck" && <Deck list={list} onOpen={openCase} />}
      </div>
    </section>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
      {tags.map((t) => (
        <li key={t} className="rounded-xs border border-hairline px-2 py-0.5 font-mono text-mono-sm text-ink-subtle">
          #{t.replace(/\s+/g, "")}
        </li>
      ))}
    </ul>
  );
}

function Meta({ p }: { p: Project }) {
  return (
    <dl className="grid grid-cols-1 gap-2 text-caption sm:grid-cols-3 sm:gap-3">
      {[
        ["Type", p.type],
        ["Year", p.year],
        ["Role", p.role],
      ].map(([k, v]) => (
        <div key={k} className="flex items-baseline gap-3 sm:block">
          <dt className="w-10 shrink-0 text-ink-subtle sm:w-auto">{k}</dt>
          <dd className="font-mono text-mono-sm text-ink tabular sm:mt-0.5">
            <TodoText text={v} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

const POINTS = [
  ["Problem", "problem"],
  ["Approach", "approach"],
  ["Architecture", "architecture"],
  ["Outcome", "outcome"],
] as const;

function CaseStudy({ p }: { p: Project }) {
  return (
    <article id={`case-${p.id}`} data-flip-id={p.id} aria-labelledby={`t-${p.id}`} className="rounded-lg border border-hairline bg-surface-1 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-4 lg:col-span-5">
          <Schematic id={p.id} />
          <PromptLine text={p.prompt} note={p.promptNote} />
          <Meta p={p} />
        </div>
        <div className="lg:col-span-7">
          <h3 id={`t-${p.id}`} className="text-h3 wdth-heading">
            <span className="text-ink">{p.title}.</span> <span className="text-ink-muted">{p.headline}</span>
          </h3>
          <div className="mt-4">
            <Tags tags={p.tags} />
          </div>
          <p className="mt-5 max-w-[60ch] text-body text-ink-muted">{p.summary}</p>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {POINTS.map(([label, key]) => (
              <div key={key}>
                <h4 className="text-small font-[550] text-ink">{label}</h4>
                <p className="mt-1.5 text-small text-ink-muted">
                  <TodoText text={p.caseStudy[key]} />
                </p>
              </div>
            ))}
          </div>
          {(p.links.repo || p.links.demo) && (
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small">
              {p.links.repo && <TodoLink href={p.links.repo} className="text-ink underline hover:decoration-accent">Source code</TodoLink>}
              {p.links.demo && <TodoLink href={p.links.demo} className="text-ink underline hover:decoration-accent">Live demo</TodoLink>}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function GridCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-h4 text-ink wdth-heading">{p.title}</h3>
        <span className="shrink-0 font-mono text-mono-sm text-ink-subtle tabular">
          <TodoText text={p.year} />
        </span>
      </div>
      <p className="mt-1 text-small text-ink-muted">{p.type}</p>
      <p className="mt-4 text-small text-ink-muted">{p.headline}</p>
      <div className="mt-5">
        <Tags tags={p.tags.slice(0, 4)} />
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-small text-ink hover:text-accent-text"
      >
        Read the case study <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </>
  );
}

/** Deck: a ScrollTrigger-pinned stack. Each card slides up over the last as you scroll. */
function Deck({ list, onOpen }: { list: Project[]; onOpen: (id: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pinned = !reduced && list.length > 1;

  useGSAP(
    () => {
      if (!pinned) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-deck-card]");
        gsap.set(cards.slice(1), { yPercent: 110 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap.current,
            start: "top 96px",
            end: () => `+=${(cards.length - 1) * window.innerHeight * 0.8}`,
            pin: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
        cards.slice(1).forEach((card, i) => {
          tl.to(card, { yPercent: 0, ease: "none" }, i).to(cards[i], { scale: 0.94, opacity: 0.5, ease: "none" }, i);
        });
      });
    },
    { dependencies: [pinned, list.length], scope: wrap, revertOnUpdate: true },
  );

  if (!pinned) {
    return (
      <ol className="space-y-4">
        {list.map((p, i) => (
          <li key={p.id} className="rounded-lg border border-hairline bg-surface-1 p-6 sm:p-8">
            <DeckFace p={p} i={i} n={list.length} onOpen={onOpen} />
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div ref={wrap} className="relative">
      <ol className="relative h-[min(70vh,560px)] [clip-path:inset(-48px_-48px_0_-48px)]">
        {list.map((p, i) => (
          <li
            key={p.id}
            data-deck-card
            className="absolute inset-0 overflow-hidden rounded-lg bg-surface-1 p-6 shadow-float sm:p-10"
            style={{ zIndex: i + 1 }}
          >
            <DeckFace p={p} i={i} n={list.length} onOpen={onOpen} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function DeckFace({ p, i, n, onOpen }: { p: Project; i: number; n: number; onOpen: (id: string) => void }) {
  return (
    <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-12">
      <div className="flex h-full flex-col md:col-span-7">
        <span className="font-mono text-mono-sm text-ink-subtle tabular">
          {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <h3 className="mt-6 max-w-[22ch] text-h2 wdth-heading">
          <span className="text-ink">{p.title}.</span>
        </h3>
        <p className="mt-4 max-w-[52ch] text-lead text-ink-muted">{p.headline}</p>
        <div className="mt-6">
          <Tags tags={p.tags} />
        </div>
        <DeckFoot p={p} onOpen={onOpen} />
      </div>
      <div className="hidden self-center md:col-span-5 md:block">
        <Schematic id={p.id} />
      </div>
    </div>
  );
}

function DeckFoot({ p, onOpen }: { p: Project; onOpen: (id: string) => void }) {
  return (
    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
        <span className="font-mono text-mono-sm text-ink-subtle">
          {p.type} · <TodoText text={p.year} />
        </span>
        <button type="button" onClick={() => onOpen(p.id)} className="inline-flex items-center gap-1.5 text-small text-ink hover:text-accent-text">
          Read the case study <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
        </button>
    </div>
  );
}
