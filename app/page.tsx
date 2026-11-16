import dynamic from "next/dynamic";
import { Loader } from "@/components/site/loader";
import { Nav } from "@/components/site/nav";
import { ScrollIndex } from "@/components/site/scroll-index";
import { Hero } from "@/components/sections/hero";
import { IconSprite } from "@/components/ui/icon-sprite";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import { ScrollProgress } from "@/components/fx/scroll-progress";
import { Band } from "@/components/fx/band";
import { Sheet } from "@/components/fx/sheet";
import { profile } from "@/lib/profile";

// Below-the-fold sections are still pre-rendered to HTML, but their JS loads and hydrates in
// separate chunks, so start-up work is split into small tasks instead of one long one.
const Marquee = dynamic(() => import("@/components/sections/marquee").then((m) => m.Marquee));
const Works = dynamic(() => import("@/components/sections/works").then((m) => m.Works));
const Experiments = dynamic(() => import("@/components/sections/experiments").then((m) => m.Experiments));
const Ask = dynamic(() => import("@/components/sections/ask").then((m) => m.Ask));
const AskLauncher = dynamic(() => import("@/components/sections/ask").then((m) => m.AskLauncher));
const About = dynamic(() => import("@/components/sections/about").then((m) => m.About));
const Stack = dynamic(() => import("@/components/sections/stack").then((m) => m.Stack));
const Footer = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer));

// Band copy comes from the CV and the facts confirmed in profile.json.
const BAND_ROWS = [
  {
    items: ["Java", "Spring Boot", "Microservices", "RabbitMQ", "Redis", "PostgreSQL", "Docker", "AWS, Azure, GCP"],
    dir: 1 as const,
  },
  {
    items: ["Open to remote", "Open to relocate: UAE", "Open to relocate: KSA", `Notice: ${profile.faq.noticePeriod.replace(/\.$/, "")}`],
    dir: -1 as const,
    size: "md" as const,
  },
];

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[var(--z-dialog)] rounded-full bg-ink text-small text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <IconSprite />
      <SmoothScroll />
      <ScrollProgress />
      <Loader />
      <Nav />
      <ScrollIndex />
      {/* Blueprint frame: hairline rules at the container edges. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-1/2 z-0 hidden w-[calc(var(--container)+2px)] -translate-x-1/2 border-x border-hairline xl:block" />
      <main id="main" className="relative z-[1]">
        <Hero />
        <Marquee />
        <Works />
        <div className="mt-24 lg:mt-32">
          <Band rows={BAND_ROWS} label="stack-and-availability" />
        </div>
        <Experiments />
        <Ask />
        <Sheet>
          <About />
          <Stack />
        </Sheet>
      </main>
      <Footer />
      <AskLauncher />
    </>
  );
}
