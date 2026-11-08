"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, FileText, X } from "lucide-react";
import { agentMarkdown } from "@/lib/agent-markdown";
import { mailto, profile, resumeHref } from "@/lib/profile";
import { Todo } from "@/components/ui/todo-text";

const LINKS = [
  { label: "Email", href: mailto(), value: profile.links.email },
  { label: "LinkedIn", href: profile.links.linkedin, value: "hashim-khan-7b07b3223", external: true },
  { label: "GitHub", href: profile.links.github, value: "itshashi7", external: true },
];

export function Footer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [md, setMd] = useState("");
  const [copied, setCopied] = useState(false);

  const open = () => {
    setMd(agentMarkdown());
    setCopied(false);
    dialog.current?.showModal();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer className="container-site section-gap pb-12">
      <div className="border-t border-hairline pt-16">
        <p className="max-w-[24ch] text-h2 text-ink wdth-heading">Good backends are quiet. You notice them only when they&apos;re missing.</p>

        <div className="mt-16 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="text-small text-ink-subtle">Contact</h2>
            <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="text-body text-ink">{l.label}</span>
                    <span className="flex min-w-0 items-center gap-2 text-small text-ink-muted group-hover:text-ink">
                      <span className="truncate">{l.value}</span>
                      <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
                    </span>
                  </a>
                </li>
              ))}
              <li>
                {resumeHref ? (
                  <a href={resumeHref} download="Hashim_Khan_N_Resume.pdf" className="group flex items-center justify-between gap-4 py-4">
                    <span className="text-body text-ink">Resume</span>
                    <span className="flex items-center gap-2 text-small text-ink-muted group-hover:text-ink">
                      cv.pdf <Download size={15} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  </a>
                ) : (
                  <span className="flex items-center justify-between gap-4 py-4">
                    <span className="text-body text-ink-subtle">Resume</span>
                    <Todo>TODO: CV</Todo>
                  </span>
                )}
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-8 md:col-span-4 md:col-start-9">
            <button
              type="button"
              onClick={open}
              className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-hairline-strong bg-surface-1 px-4 text-small text-ink hover:bg-surface-2"
            >
              <FileText size={15} strokeWidth={1.5} aria-hidden="true" /> Agent view
            </button>
            <p className="text-small text-ink-subtle">
              Designed and built by Hashim · <span className="tabular">{new Date().getFullYear()}</span>
            </p>
          </div>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="agent-title"
        className="m-auto w-[min(56rem,calc(100vw-2rem))] max-w-none rounded-lg bg-surface-1 p-0 text-ink shadow-float backdrop:bg-scrim"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
          <h2 id="agent-title" className="text-small font-[550]">
            Agent view <span className="font-normal text-ink-subtle">· this page as Markdown</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-hairline-strong px-3 text-caption text-ink hover:bg-surface-2"
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? "Copied" : "Copy Markdown"}
            </button>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close agent view"
              className="grid size-8 place-items-center rounded-full text-ink-muted hover:bg-surface-2 hover:text-ink"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
        <pre tabIndex={0} className="max-h-[70vh] overflow-auto whitespace-pre-wrap p-5 font-mono text-mono text-ink-muted">
          {md}
        </pre>
        <p className="sr-only" aria-live="polite">
          {copied ? "Markdown copied to clipboard" : ""}
        </p>
      </dialog>
    </footer>
  );
}
