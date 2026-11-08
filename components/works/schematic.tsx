/** Authored system schematics built only from CV facts. Geometry, not illustration. */

type Node = { label: string; side?: string[]; accent?: boolean };

export const SCHEMATICS: Record<string, { title: string; nodes: Node[]; loop?: string }> = {
  "izo-multi-cloud-connect": {
    title: "Layered Spring Boot service",
    nodes: [
      { label: "REST client" },
      { label: "Controller" },
      { label: "Service", side: ["RabbitMQ", "Redis"], accent: true },
      { label: "Repository" },
      { label: "PostgreSQL · MySQL" },
    ],
  },
  "wikipedia-summarizer": {
    title: "Summarisation pipeline",
    nodes: [
      { label: "Wikipedia article" },
      { label: "NLP summariser", side: ["level: short · medium · long"], accent: true },
      { label: "Streamlit UI" },
    ],
    loop: "user feedback → output quality",
  },
  "rag-mcp-workshop": {
    title: "Retrieval and tools",
    nodes: [
      { label: "Documents" },
      { label: "Chunk → embed" },
      { label: "Vector retrieval", accent: true },
      { label: "LLM (grounded)", side: ["MCP tools"] },
      { label: "Answer" },
    ],
  },
};

export function Schematic({ id }: { id: string }) {
  const s = SCHEMATICS[id];
  if (!s) return null;
  return (
    <figure className="rounded-md bg-surface-3 p-5" aria-label={`${s.title} (schematic)`}>
      <ol className="flex flex-col items-start">
        {s.nodes.map((n, i) => (
          <li key={n.label} className="flex flex-col items-start">
            {i > 0 && <span aria-hidden="true" className="ml-5 block h-4 w-px bg-hairline-strong" />}
            <span className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-sm border bg-surface-1 px-3 py-1.5 font-mono text-mono ${
                  n.accent ? "border-accent text-ink" : "border-hairline-strong text-ink-muted"
                }`}
              >
                {n.label}
              </span>
              {n.side?.map((x) => (
                <span key={x} className="flex items-center gap-2">
                  <span aria-hidden="true" className="block h-px w-4 bg-hairline-strong" />
                  <span className="rounded-sm border border-dashed border-hairline-strong px-2 py-1 font-mono text-mono-sm text-ink-subtle">
                    {x}
                  </span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
      {s.loop && <p className="mt-4 font-mono text-mono-sm text-ink-subtle">Feedback loop: {s.loop}</p>}
      <figcaption className="mt-4 text-caption text-ink-subtle">{s.title} · schematic</figcaption>
    </figure>
  );
}
