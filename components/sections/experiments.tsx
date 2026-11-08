"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/profile";
import { TodoLink } from "@/components/ui/todo-text";
import { useReveal } from "@/components/ui/use-reveal";
import { stagger } from "@/lib/tokens";

function RagArtefact() {
  const steps = ["chunk", "embed", "retrieve", "grounded answer"];
  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="RAG pipeline steps">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="block h-px w-3 bg-hairline-strong" />}
          <span className={`rounded-sm border px-2.5 py-1 font-mono text-mono-sm ${i === 2 ? "border-accent text-ink" : "border-hairline-strong text-ink-muted"}`}>
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

const MCP = `{
  "name": "get_connection_status",
  "description": "Look up a connection by id",
  "input_schema": {
    "type": "object",
    "properties": { "id": { "type": "string" } },
    "required": ["id"]
  }
}`;

// Commands actually used to set up and build this site.
const TERMINAL = [
  ["$", "npx skills add pbakaus/impeccable"],
  ["$", "claude mcp add chrome-devtools -- npx chrome-devtools-mcp"],
  ["$", "npm run build"],
  ["", "Exported static site to out/"],
];

const ARTEFACTS: Record<string, React.ReactNode> = {
  "rag-pipeline": <RagArtefact />,
  "mcp-servers": (
    <pre aria-label="Illustrative MCP tool definition" className="whitespace-pre-wrap break-words font-mono text-[12px] leading-[1.6] text-ink-muted">
      {MCP}
    </pre>
  ),
  "built-with-claude-code": (
    <pre aria-label="Terminal commands used to build this site" className="whitespace-pre-wrap break-words font-mono text-[12px] leading-[1.7] text-ink-muted">
      {TERMINAL.map(([p, c]) => (
        <span key={c} className="block">
          {p && <span className="text-ink-subtle">{p} </span>}
          <span className={p ? "text-ink" : ""}>{c}</span>
        </span>
      ))}
    </pre>
  ),
};

export function Experiments() {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { each: stagger.cards });
  return (
    <section ref={root} id="experiments" aria-labelledby="exp-title" className="container-site section-gap">
      <h2 id="exp-title" data-reveal className="text-h2 text-ink wdth-heading">
        Experiments.
      </h2>
      <p data-reveal className="mt-4 text-body text-ink-muted measure">
        Hands-on AI work: retrieval pipelines, tools for agents, and building with AI pair programmers.
      </p>
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {profile.experiments.map((e, i) => (
          <li key={e.id} data-reveal className={`flex flex-col rounded-lg border border-hairline bg-surface-1 p-6 ${i === 2 ? "lg:col-span-1" : ""}`}>
            <h3 className="text-h4 text-ink wdth-heading">{e.title}</h3>
            <p className="mt-2 text-small text-ink-muted">{e.body}</p>
            <div className="mt-5 rounded-md bg-surface-3 p-4">{ARTEFACTS[e.id]}</div>
            {e.id === "mcp-servers" && <p className="mt-2 text-caption text-ink-subtle">Illustrative tool definition</p>}
            <p className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6 text-small">
              <TodoLink href={e.links.try} className="inline-flex items-center gap-1 text-ink underline hover:decoration-accent">
                Try it <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </TodoLink>
              <TodoLink href={e.links.code} className="inline-flex items-center gap-1 text-ink underline hover:decoration-accent">
                View code <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </TodoLink>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
