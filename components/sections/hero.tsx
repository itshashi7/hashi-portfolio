"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { ArrowDown, Download, Mail, Minus, Plus } from "lucide-react";
import RotatingText from "@/components/reactbits/RotatingText";
import { Magnetic } from "@/components/ui/magnetic";
import { LiquidLink, ShineLink } from "@/components/ui/buttons";
import { NetworkField } from "@/components/fx/network-field";
import { LOADER_DONE, loaderFinished } from "@/components/site/loader";
import { gsap, useGSAP, useReducedMotion, MOTION_OK } from "@/lib/motion";
import { cubic, distance, dur, gsapEase, ms, stagger } from "@/lib/tokens";
import { mailto, profile, resumeHref } from "@/lib/profile";

const TITLES = ["Backend Engineer", "Java & Spring Boot Developer", "Multi-Cloud Builder", "AI-Assisted Builder"];

const exp = profile.experience[0];
const INTRO = [
  {
    label: `Hi, I'm ${profile.person.shortName}.`,
    body: `${profile.person.title} at ${exp.company.replace(" Ltd", "")}, ${profile.person.yearsExperience} years.`,
  },
  {
    label: "I build cloud-native backend services.",
    body: "REST APIs, service-to-service integrations and event-driven processing for an enterprise multi-cloud networking platform.",
  },
  {
    label: "Mostly the parts nobody sees.",
    body: "Java, Spring Boot, RabbitMQ, PostgreSQL and Redis, running across AWS, Azure and GCP.",
  },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(-1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Transform only: hero text stays opaque (painted under the loader), so LCP isn't held back by the intro.
        const items = gsap.utils.toArray<HTMLElement>("[data-hero]");
        gsap.set(items, { y: distance.reveal });
        const play = () => gsap.to(items, { y: 0, duration: dur.slow, ease: gsapEase.outExpo, stagger: stagger.items });
        if (loaderFinished()) play();
        else window.addEventListener(LOADER_DONE, play, { once: true });
        return () => window.removeEventListener(LOADER_DONE, play);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" aria-labelledby="hero-title" className="container-site relative pt-36 sm:pt-44">
      <NetworkField />
      <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className="text-display text-ink wdth-heading" data-hero>
            <span className="sr-only">
              {profile.person.name}: {TITLES.join(", ")}
            </span>
            <span aria-hidden="true" className="grid">
              {TITLES.map((t) => (
                <span key={t} className="invisible col-start-1 row-start-1">
                  {t}
                </span>
              ))}
              <span className="col-start-1 row-start-1 self-end">
                <RotatingText
                  texts={TITLES}
                  splitBy="words"
                  auto={!reduced}
                  pauseOnHover
                  rotationInterval={2800}
                  staggerDuration={0.06}
                  transition={{ type: "tween", duration: dur.slow, ease: cubic.outExpo }}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  mainClassName="overflow-hidden"
                  splitLevelClassName="overflow-hidden pb-[0.08em]"
                />
              </span>
            </span>
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-3" data-hero>
            <Magnetic>
              <ShineLink href="#work" icon={ArrowDown} dir="down">
                See my work
              </ShineLink>
            </Magnetic>
            {resumeHref ? (
              <LiquidLink href={resumeHref} download="Hashim_Khan_N_Resume.pdf" icon={Download}>
                Download CV
              </LiquidLink>
            ) : (
              <LiquidLink href={mailto()} icon={Mail}>
                Email me
              </LiquidLink>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-3">
          <ul className="divide-y divide-hairline border-y border-hairline">
            {INTRO.map((row, i) => (
              <IntroRow key={row.label} index={i} {...row} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function IntroRow({
  index,
  label,
  body,
  open,
  onToggle,
}: {
  index: number;
  label: string;
  body: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panel = useRef<HTMLParagraphElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (open && panel.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animate(panel.current, { opacity: [0, 1], y: [-6, 0], duration: ms.base, ease: "outQuart" });
    }
  }, [open]);
  const id = `intro-${index}`;
  return (
    <li data-hero>
      <div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className={`flex w-full items-center justify-between gap-4 py-4 text-left text-lead ${
            open ? "text-ink" : "text-ink-muted hover:text-ink"
          }`}
        >
          <span>{label}</span>
          {open ? (
            <Minus size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-ink-subtle" />
          ) : (
            <Plus size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-ink-subtle" />
          )}
        </button>
      </div>
      <p ref={panel} id={id} hidden={!open} className="-mt-1 pb-5 text-body text-ink-muted measure">
        {body}
      </p>
    </li>
  );
}
