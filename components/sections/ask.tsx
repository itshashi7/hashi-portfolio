"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { ArrowUp, MessageCircle } from "lucide-react";
import { ask, STARTERS, type Answer } from "@/lib/chat";
import { prefersReduced } from "@/lib/motion";
import { ms } from "@/lib/tokens";
import { useReveal } from "@/components/ui/use-reveal";

type Msg = { id: number; from: "you" | "hashim"; text: string; links?: Answer["links"] };

const INTRO: Msg = {
  id: 0,
  from: "hashim",
  text: "Ask about my work, stack or availability. Answers come from this site's content, matched in your browser. No AI model is called.",
};

export function Ask() {
  const root = useRef<HTMLElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const seq = useRef(1);
  const [msgs, setMsgs] = useState<Msg[]>([INTRO]);
  const [value, setValue] = useState("");
  useReveal(root);

  const submit = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const a = ask(text);
    setMsgs((m) => [
      ...m,
      { id: seq.current++, from: "you", text },
      { id: seq.current++, from: "hashim", text: a.text, links: a.links },
    ]);
    setValue("");
  };

  // new messages slide in; the log keeps its own scroll
  const lastId = msgs[msgs.length - 1].id;
  useEffect(() => {
    const el = log.current;
    if (!el || lastId === 0) return;
    el.scrollTo({ top: el.scrollHeight, behavior: prefersReduced() ? "auto" : "smooth" });
    if (prefersReduced()) return;
    const items = Array.from(el.children).slice(-2);
    animate(items, { opacity: [0, 1], y: [8, 0], duration: ms.base, ease: "outQuart", delay: stagger(60) });
  }, [lastId]);

  return (
    <section ref={root} id="ask" aria-labelledby="ask-title" className="container-site section-gap">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="ask-title" data-reveal className="text-h2 text-ink wdth-heading">
            Ask me anything.
          </h2>
          <p data-reveal className="mt-4 text-body text-ink-muted measure">
            Recruiter questions answered from my CV and the details I&apos;ve confirmed: stack, current work, relocation and notice period.
          </p>
        </div>
        <div data-reveal className="flex flex-col rounded-lg border border-hairline bg-surface-1 lg:col-span-8">
          <div
            ref={log}
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            tabIndex={0}
            className="flex h-[22rem] flex-col gap-4 overflow-y-auto p-5 sm:p-6"
          >
            {msgs.map((m) => (
              <div key={m.id} className={m.from === "you" ? "max-w-[80%] self-end" : "max-w-[90%] self-start"}>
                <span className="sr-only">{m.from === "you" ? "You: " : "Hashim: "}</span>
                <p className={m.from === "you" ? "rounded-md bg-surface-2 px-4 py-2.5 text-body text-ink" : "text-body text-ink-muted"}>{m.text}</p>
                {m.links && (
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-small">
                    {m.links.map((l) => (
                      <a key={l.href} href={l.href} className="text-ink underline decoration-hairline-strong hover:decoration-accent">
                        {l.label}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-hairline p-4 sm:p-5">
            <ul className="mb-3 flex flex-wrap gap-2" aria-label="Suggested questions">
              {STARTERS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => submit(s)}
                    className="h-8 rounded-full border border-hairline-strong px-3 text-caption text-ink-muted hover:text-ink"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(value);
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor="ask-input" className="sr-only">
                Your question
              </label>
              <input
                ref={input}
                id="ask-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask about my stack, IZO, relocation…"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-full border border-control-border bg-canvas px-4 text-body text-ink placeholder:text-ink-subtle focus-visible:outline-2"
              />
              <button
                type="submit"
                aria-label="Send question"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-canvas disabled:opacity-50"
                disabled={!value.trim()}
              >
                <ArrowUp size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Floating launcher: appears after the hero, jumps to the chat and focuses the input. */
export function AskLauncher() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("home");
    const chat = document.getElementById("ask");
    if (!hero || !chat) return;
    let pastHero = false;
    let atChat = false;
    const update = () => setShow(pastHero && !atChat);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === chat) atChat = e.isIntersecting;
      });
      update();
    });
    io.observe(hero);
    io.observe(chat);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href="#ask"
      onClick={() => setTimeout(() => document.getElementById("ask-input")?.focus({ preventScroll: true }), 450)}
      aria-label="Ask me anything"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed bottom-5 right-5 z-[var(--z-chat)] grid size-12 place-items-center rounded-full bg-surface-1 text-ink shadow-float transition-[opacity,transform] duration-[var(--dur-base)] ease-out-expo sm:bottom-6 sm:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}
