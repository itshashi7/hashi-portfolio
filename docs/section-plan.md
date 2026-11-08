# Section plan (for review before any components are written)

All copy comes from `content/profile.json`; anything missing renders as a visible `TODO:`.
All values come from DESIGN.md. Mode: **Experience** (the work leads from the first viewport).
Every motion line below has a reduced-motion fallback, defined in DESIGN.md → Motion.

Page skeleton: a fixed nav pill (top centre), a theme switch (top right), a left scroll-spy index
(five ticks, ≥1024px only), a blueprint frame (hairline rules at the container edges) and a
floating "Ask" launcher (bottom right, appears after the hero).

---

### 1. Loader (first visit per session)
- Full-screen `canvas`. A 160px hairline rule with an amber `scaleX` fill grows as the
  counter climbs; "Loading" sits at the left end and `000→100` (JetBrains Mono, tabular) at the right.
- Anime.js counts 000→100 in 1100ms (fast to 90, crawl to 100). Then the GSAP curtain runs
  (translateY −100%, 600ms `in-out`), and the hero entrance starts as the curtain clears.
- It's skipped when `sessionStorage['hk:loaded']` is set (read/write in try/catch) or when reduced motion
  is on. A CSS failsafe keyframe hides it after 3s if JavaScript never runs. The page behind it is fully
  rendered HTML, so nothing waits on the loader.

### 2. Navbar
- Pill: Home · Work · Experiments · About · Stack (Lucide icons + labels; icons only below
  768px). The active section gets a `surface-2` pill and an amber dot (scroll-spy through ScrollTrigger).
- "Hire me": an inverse pill → `mailto:hashimkhan1618@gmail.com?subject=Role%20for%20Hashim`.
- Light/dark toggle (next-themes) with a radial View Transition from the button, 600ms.
- Sticky with a 12px backdrop blur. It hides on scroll-down and shows on scroll-up (translateY, `base`).
  A skip link to `#main` comes first in the tab order.

### 3. Hero (`#home`)
- **Left (7 of 12 cols):** an H1 of rotating titles (React Bits Rotating Text): "Backend Engineer" →
  "Java & Spring Boot Developer" → "Multi-Cloud Builder" → "AI-Assisted Builder". The full list
  sits in a visually hidden span for screen readers, and a hidden grid stack reserves the width
  so nothing reflows. Below it: "See my work" (magnetic, Anime.js, ≤ 6px) and a secondary "Download CV".
- **Right (5 cols):** three stacked intro rows (an accordion, one open at a time). The copy is
  CV-backed:
  1. **Hi, I'm Hashim.** Software Engineer – Backend at Tata Communications, 2+ years.
  2. **I build cloud-native backend services.** REST APIs, service-to-service integrations and
     event-driven processing for an enterprise multi-cloud networking platform.
  3. **Java · Spring Boot · RabbitMQ · PostgreSQL · Redis.** Running across AWS, Azure and GCP,
     shipped through Jenkins CI/CD.
- **Proposed addition (the first viewport proves the mechanism):** a slim full-width
  **request trace** along the bottom of the hero. An amber packet travels
  `client → gateway → service → RabbitMQ → Redis / PostgreSQL` in a 3s loop, with a mono
  latency readout. It's labelled "Illustrative". It stands in for poulo's portrait slot, since we
  don't draw a real person, and it previews the gallery below. Reduced motion shows a static trace
  with the path drawn.
- Entrance (after the loader): the title letters rise, then the intro rows stagger (`items` 50ms), then
  the trace draws. Each step is ≤ 400ms.

### 4. "Shipped across" marquee
- React Bits Logo Loop at 40px/s, pausing on hover or focus, with edge fade masks. Items:
  **Tata Communications** (a text wordmark in Mona Sans at width 95; no logo file), AWS, Azure, GCP,
  Docker, PostgreSQL, Redis (simple-icons, mono `ink-subtle`).
- Risk to verify in Phase 4: simple-icons has removed some vendor marks after brand requests
  (AWS and Azure may be absent). Any missing mark falls back to a text wordmark in the same style;
  no third-party logo files are hand-copied.
- Reduced motion: a static wrapped row.

### 5. Backend component gallery
- Statement H2 (one sentence, CV-backed): "Services I build talk over REST and queues, cache in
  Redis, and run across three clouds." It's followed by a masonry wall of six widgets (CSS columns: 3 → 2 → 1).
- Each widget is a React Bits Spotlight Card (amber `accent-soft`, hover only) with a name,
  an **"Illustrative demo"** label, a reset button and a `surface-3` well:
  1. **API request lifecycle:** a packet moves gateway → service → cache → DB, with a hit/miss
     branch and per-hop mono timings. You can replay it.
  2. **Redis cache-hit gauge:** a half-ring gauge of the hit ratio; "Send 10 requests" nudges it.
  3. **Live log tail:** illustrative Spring Boot log lines stream in (INFO/WARN/DEBUG as text tags);
     it pauses on hover or focus and under reduced motion. `aria-live="off"` keeps screen readers quiet.
  4. **p95 latency chart:** an SVG line chart with p50 in ink and p95 in amber, and a "spike" button
     that shows recovery.
  5. **Circuit breaker:** a segmented control for closed / open / half-open, a state diagram and
     a request feed reacting to it. Each state has a label and line style, not just colour.
  6. **Multi-cloud lanes:** three lanes (AWS / Azure / GCP) with requests routed across them;
     you can "drain" a lane and watch traffic shift.
- Section motion: the wall rises in a 70ms stagger. Widgets run only while on screen
  (IntersectionObserver), and all of them are deterministic from a seeded PRNG.

### 6. Works (`#work`)
- H2 "Selected work." A filter-chip track with counts: All 3 · Backend 1 · Cloud 1 · AI 2 · Tools 1.
  A polite live region reads "Showing N of 3 projects". The **Showcase / Grid / Deck** toggle sits as a
  second radio group on the right.
- GSAP Flip animates layout changes on filter and view switch (600ms `out-expo`), and the swap is
  instant under reduced motion.
- **Case study** (Showcase): headline · tags · a typed prompt line (Anime.js, 28ms/char, once in
  view, with an amber caret) · type · year · role · a one-paragraph summary · Problem / Approach /
  Architecture / Outcome.
  - IZO Multi Cloud Connect: `GET /api/v1/connections?cloud=aws` (labelled illustrative).
  - Wikipedia Summarizer: `summarize --article "Alan_Turing" --level short`.
  - RAG & MCP workshop: `retrieve(query, k=4) → ground(llm, chunks)`.
  - Visual side: no screenshots exist, so each case gets an authored schematic from its CV facts
    (layered Controller → Service → Repository for IZO, an NLP pipeline for the Summarizer, chunk →
    embed → retrieve → answer for RAG). It's drawn in SVG geometry, not illustration.
- **Grid:** 3-up cards (title, year, type, tags, "Read case").
- **Deck:** a GSAP ScrollTrigger pinned stack; cards slide up over each other with the scroll, with a
  `01 / 03` position counter. Reduced motion gives a plain vertical list.

### 7. Experiments (`#experiments`)
- H2 "Experiments." Three cards, each a different artefact rather than icon-plus-text clones:
  - **RAG pipeline:** a four-step mini-diagram (chunk → embed → retrieve → grounded answer).
  - **MCP server setup:** a small JSON tool-definition / tool-call excerpt in mono (marked as illustrative).
  - **Built with Claude Code:** a short terminal transcript of the commands that built this site.
- Each has "Try it" and "View code" links, which show `TODO:` where no link exists yet (all three today).

### 8. Ask me anything
- H2 "Ask me anything." An inline chat panel, plus the floating launcher, which scrolls here and focuses
  the input.
- Client-side intent matching over `profile.json` (keyword/synonym scoring, no network). Starter
  chips: "What's your stack?" · "Tell me about IZO" · "Are you open to relocation?" ·
  "Notice period?" These answer from the CV and the confirmed facts (remote or relocation to the UAE or
  KSA; 90 days).
- No match → "I don't have that in my notes. Email me →" (mailto). The disclaimer reads: "Answers come
  from this site's content. No AI model is called."
- Messages render with a short Anime.js fade/slide (≤ 240ms). `role="log"` and `aria-live="polite"`.

### 9. About (`#about`)
- H2 "About." A short bio (3–4 sentences from the CV summary) and "Languages: English, Tamil,
  Hindi".
- **Journey timeline** with GSAP on scroll. A vertical rail scales in (transform) and rows stagger in:
  - Engineer – Backend Developer · Tata Communications Ltd · India · 2024 – Present (amber dot)
  - B.E. Computer Science · Sri Krishna College of Technology · Coimbatore · 2024 (CGPA 7.67)
  - RAG & MCP hands-on AI workshop · TODO: year
- Desktop uses four columns (role · org · place · years). Mobile stacks them, with years in mono.

### 10. Stack (`#stack`)
- H2 "Stack." A logo grid going from mono to brand colour on hover or focus (two stacked SVGs crossfading,
  160ms). Logos: Java, Spring Boot, Python, PostgreSQL, MySQL, Redis, RabbitMQ, Docker, AWS,
  Azure, GCP, Jenkins, Git, GitHub, GitLab, Maven, JUnit, SonarQube, Postman, Jira, IntelliJ
  IDEA, VS Code, GitHub Copilot, Claude. Each tile is focusable with a name tooltip, and any mark
  missing from simple-icons becomes a text tile.
- Below the grid: the nine skill groups from the CV, as `Group: item, item, …` lines.

### 11. Footer
- Contact: Email · LinkedIn · GitHub · "Download CV" (`/cv.pdf`).
- An original line: *"Good backends are quiet. You notice them only when they're missing."*
- "Designed and built by Hashim" · © year.
- **Agent view** button: a native `<dialog>` showing the whole page as Markdown, generated from
  `profile.json` (with YAML front matter for title and url), plus Copy and Close. Focus is trapped
  in the dialog and Esc closes it.

---

## Where the plan departs from the brief or the reference (say no to any of these)

1. **Hero request trace** (new). It makes the first viewport show the work. Impeccable's
   Experience mode asks for this, and it replaces poulo's portrait.
2. **No eyebrow labels and no grid index numbers** (poulo's "About me" label and `01…06`
   badges). Impeccable bans both. The Deck's `01 / 03` stays because it shows position.
3. **Spotlight Cards stay subtle** (hover only, 12% amber), since Linear and Impeccable warn against
   decorative glows.
4. **Chat lives inline** in its section; the floating launcher jumps to it rather than opening a
   second copy.
5. **Animation is capped at 600ms** and uses only transform and opacity, so poulo's 800ms theme reveal
   and its blurred letter animation are re-timed and re-built to fit.
