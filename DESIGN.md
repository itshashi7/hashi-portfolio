---
version: 1.0
name: hashim-portfolio
description: >
  A near-black, cool-tinted engineering canvas with hairline structure, one scarce amber
  "signal" accent, Archivo for the voice and JetBrains Mono for anything measured. It reads
  like a well-run production dashboard: calm surfaces, exact type, and colour that appears
  only where something is live, focused or selected.
defaultTheme: dark

colors:
  dark:
    canvas: "#0b0c0f"          # oklch(0.155 0.006 265)
    surface-1: "#121417"       # oklch(0.19 0.007 265)  cards, widgets
    surface-2: "#1a1c20"       # oklch(0.225 0.008 265) raised/hover, selected chip
    surface-3: "#23252a"       # oklch(0.265 0.009 265) inset wells inside widgets
    ink: "#f2f3f6"             # 17.7:1 on canvas
    ink-muted: "#b3b6bc"       # 9.6:1
    ink-subtle: "#8d9198"      # 6.2:1 — smallest text allowed
    hairline: "rgb(255 255 255 / 0.08)"
    hairline-strong: "rgb(255 255 255 / 0.16)"
    control-border: "rgb(255 255 255 / 0.40)"   # 3.8:1, inputs/toggles
    accent: "#faaa49"          # oklch(0.80 0.145 68) — the ONLY chromatic colour
    accent-text: "#faaa49"     # 10.2:1 on canvas
    accent-ink: "#0b0c0f"      # text on an accent fill (10.2:1)
    accent-soft: "rgb(250 170 73 / 0.12)"       # spotlight, selection wash
    scrim: "rgb(4 5 7 / 0.72)"
  light:
    canvas: "#f9fafb"          # oklch(0.985 0.002 265)
    surface-1: "#ffffff"
    surface-2: "#f1f2f4"
    surface-3: "#e8e9ec"
    ink: "#14171d"             # 17.2:1 on canvas
    ink-muted: "#4d5057"       # 7.8:1
    ink-subtle: "#5f636a"       # 5.8:1 on canvas, 5.0:1 on surface-3
    hairline: "rgb(20 23 29 / 0.09)"
    hairline-strong: "rgb(20 23 29 / 0.16)"
    control-border: "rgb(20 23 29 / 0.52)"      # 3.6:1
    accent: "#cf6f00"          # oklch(0.64 0.155 58) — indicators, rings (3.4:1 non-text)
    accent-text: "#a65003"     # oklch(0.53 0.135 52) — accent used as text (5.3:1)
    accent-ink: "#14171d"      # text on an accent fill (5.1:1)
    accent-soft: "rgb(207 111 0 / 0.10)"
    scrim: "rgb(20 23 29 / 0.40)"

typography:
  families:
    sans: '"Archivo", ui-sans-serif, system-ui, sans-serif'        # variable wght 100–900, wdth 62–125
    mono: '"JetBrains Mono", ui-monospace, "Cascadia Code", monospace'
  scale:          # size / line-height / weight / tracking
    display:  { size: "clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)", lh: 1.02, weight: 600, tracking: "-0.035em", wdth: 92 }
    h1:       { size: "3.5rem",   lh: 1.06, weight: 600, tracking: "-0.03em",  wdth: 95 }   # 56
    h2:       { size: "2.75rem",  lh: 1.1,  weight: 600, tracking: "-0.03em",  wdth: 95 }   # 44 section titles
    h3:       { size: "2rem",     lh: 1.2,  weight: 550, tracking: "-0.025em" }             # 32 case headlines
    h4:       { size: "1.25rem",  lh: 1.35, weight: 550, tracking: "-0.015em" }             # 20 card titles
    lead:     { size: "1.125rem", lh: 1.6,  weight: 400, tracking: "-0.011em" }             # 18
    body:     { size: "1rem",     lh: 1.6,  weight: 400, tracking: "-0.006em" }             # 16
    small:    { size: "0.875rem", lh: 1.5,  weight: 450, tracking: "0" }                    # 14 buttons, chips, nav
    caption:  { size: "0.75rem",  lh: 1.45, weight: 450, tracking: "0.005em" }              # 12
    mono:     { size: "0.8125rem",lh: 1.55, weight: 400, tracking: "0" }                    # 13 figures, logs, prompts
    mono-sm:  { size: "0.75rem",  lh: 1.4,  weight: 500, tracking: "0.02em" }               # 12 counts, badges (12px is the floor for any text)
  mobile:     # ≤ 640px
    h1: "2.5rem"
    h2: "2rem"
    h3: "1.5rem"
  measure: "62ch"      # body paragraphs; never wider than 75 characters as rendered
  numerals: tabular    # font-variant-numeric: tabular-nums on every figure, counter, timestamp

spacing:   # 4px base
  "0.5": 2px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "24": 96px
  "32": 128px
  "40": 160px
layout:
  container: 1200px          # content width; 1280 with gutters
  gutter: { mobile: 16px, tablet: 24px, desktop: 40px }
  section-gap: { mobile: 96px, desktop: 160px }
  header-offset: 96px        # scroll-margin-top for anchors
  breakpoints: { sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px }   # tested at 375 / 768 / 1280 / 1920

rounded:
  xs: 6px       # badges, kbd, log-level tags
  sm: 8px       # inputs, prompt line, inner wells
  md: 12px      # inner panels, widget bodies, timeline rows on hover
  lg: 16px      # cards, widgets, dialog, chat panel (ceiling for any container)
  pill: 9999px  # small controls only: nav, buttons, chips, toggles

elevation:      # declare ONE per surface: a border OR a shadow, never a soft shadow under a border
  flat: "none"                                   # + 1px hairline border — default cards
  float-dark: "0 1px 0 0 rgb(255 255 255 / 0.06) inset, 0 16px 40px -16px rgb(0 0 0 / 0.7), 0 4px 12px -4px rgb(0 0 0 / 0.5)"
  float-light: "0 1px 0 0 rgb(255 255 255 / 0.9) inset, 0 16px 40px -18px rgb(20 23 29 / 0.22), 0 4px 12px -6px rgb(20 23 29 / 0.12)"
  # float = nav pill, chat panel, dialog, deck cards. No border on these.

motion:
  duration:
    instant: 100ms     # press, colour flips
    fast: 160ms        # hover in
    base: 240ms        # UI state, chip select, toggle
    slow: 400ms        # section reveals
    max: 600ms         # layout (Flip), deck, theme reveal — hard ceiling outside the loader
    loader-count: 1100ms
    loader-curtain: 600ms
  easing:
    out-expo: "cubic-bezier(0.16, 1, 0.3, 1)"      # reveals, theme reveal, Flip
    out-quart: "cubic-bezier(0.25, 1, 0.5, 1)"     # hover, magnetic return
    in-out: "cubic-bezier(0.76, 0, 0.24, 1)"       # loader curtain, deck hand-off
    standard: "cubic-bezier(0.4, 0, 0.2, 1)"       # colour/opacity utility
  gsap-ease:   # same curves for GSAP/Anime.js
    out-expo: "expo.out"
    out-quart: "quart.out"
    in-out: "power4.inOut"
  stagger: { letters: 30ms, items: 50ms, cards: 70ms }
  distance: { reveal: 16px, hover-lift: 2px, magnetic-max: 6px }
  properties: [transform, opacity]   # nothing else animates
  marquee-speed: 40px/s
  typing-speed: 28ms/char

z:
  base: 0
  raised: 10
  sticky: 40
  nav: 50
  chat: 60
  dialog: 70
  loader: 100
---

# DESIGN.md: Hashim Khan N, portfolio

This file is the single source of truth. Every colour, size, radius, shadow, duration and easing
in the codebase comes from the tokens above, exposed as CSS custom properties (`--color-*`,
`--text-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--dur-*`, `--ease-*`) and mapped into the
Tailwind `@theme`. If a value is missing, add it here first.

## North star

A production dashboard for one engineer. The visitor should feel the calm of a system
that is working: quiet surfaces, exact type, and one amber signal that lights up only where
something is live (a request in flight, a cache hit, the focused control, the active filter).
The page proves "backend" through behaviour rather than illustration: small, honest, working
widgets.

**Tone:** confident, technical, calm. **Audience:** recruiters and engineering leads at product
companies in Dubai, Saudi Arabia and remote teams, screening on a laptop in daylight, often
quickly. That's why the light theme is first-class, even though the brief makes dark the default.

## Where these tokens came from

| Input | What we kept | What we rejected |
|---|---|---|
| **poulo.site** (docs/reference-analysis.md) | Section flow; pill controls; −0.03–0.04em tracking; one sans plus one mono; the 0.5px/2px hairline-lift idea; opacity steps for text; 300ms ease-out hovers; the expo-out theme reveal; the mono counter loader | 24px card radii (now 16); the lime var; durations over 600ms; blur animations; the handwriting face; atmospheric backdrops |
| **Raycast** (chosen style, see note) | The chrome *is* product chrome: a near-black ladder `#07080a → #121212`, hairline 1px borders, a white CTA pill, command-palette density, generous ~96–160px section rhythm | Multi-colour category accents; the red gradient wordmark |
| **Linear** (precision) | A four-step surface ladder carries hierarchy without shadows; a faint blue tint in the canvas; one scarce accent for focus, CTA emphasis and live state only; display weight capped at 600; 8px base for controls | Lavender (purple reads as default-AI); the "no light mode" rule |
| **Vercel** (precision) | A 4px spacing base; sentence-case headings ending in a period; mono only for the technical layer; stacked small-offset shadows instead of one heavy drop; a polished light theme (`#fafafa` page, `#fff` cards) | The mesh gradient |

> **Refero note:** the Refero MCP returned HTTP 403 for every call (search, get). Instead, the
> 3–5 candidate styles were compared from the awesome-design-md catalog: **Raycast**
> (picked: dark product-chrome and hairline precision), **ClickHouse** (scarce single accent on
> data; its accent-on-figures habit informed ours), **Linear**, **Resend** (rejected: atmospheric
> glows) and **Warp** (rejected: warm charcoal, editorial serif). Re-run the Refero search when
> its API is reachable (TODO.md).

## Colour

- **Exactly one accent: signal amber.** It comes from Hashim's own stack, where orange and amber recur
  (Java, RabbitMQ, AWS, Grafana). It's tuned per theme for contrast and keeps the same hue.
- **Where the accent goes, and nowhere else:** focus rings; the active nav item's indicator dot; the
  selected chip's count; the typing caret; live/in-flight state inside widgets (the request
  packet, cache hits, the p95 line, the closed breaker, the active lane); link underlines on hover;
  the loader progress rule; `::selection`.
- **Never:** section backgrounds, large fills, gradients, gradient text, decorative glows, or a
  second chromatic colour. Up-states are shown by shape (arrows, solid vs. hollow) and labels, not
  by green.
- **Neutrals** are tinted 265° (cool) at chroma ≤ 0.012 so the amber reads as a signal against
  them. There's no pure `#000` and no pure grey text.
- **State without colour:** widgets show state with labels, icons and line style as well as the
  accent (closed = solid amber, open = hollow ink with a strike, half-open = dashed). Nothing relies
  on colour alone (WCAG 1.4.1).
- **Contrast** (verified): body ≥ 4.5:1 everywhere (the lowest is `ink-subtle` on `surface-3` in light at 5.0:1),
  and controls and focus rings ≥ 3:1. Text on an amber fill uses `accent-ink`.

## Typography

- **Archivo** (Omnibus-Type, OFL, variable weight and width) carries every heading and all UI copy: an industrial grotesk with an engineered, slightly condensed voice. (Mona Sans was the first pick; Impeccable's detector lists it as overused, so it was replaced.) It
  is self-hosted through `next/font` and never loaded from a CDN at runtime. Headings use width
  92–95, a hair condensed, for an engineered feel. Body uses width 100.
- **JetBrains Mono** (OFL), the face of the IDE Hashim works in, is used only for the measured layer:
  figures, dates, durations, counters, log lines, HTTP lines, prompt lines, tag counts, the Agent
  view and the loader. It's never used for paragraphs or as a "technical" costume.
- Headings are sentence case and may end with a period ("Selected work."). There are **no
  eyebrows or kickers** above headings: the heading carries itself.
- Display tops out at 4.5rem (72px), under Impeccable's 6rem cap. Tracking never goes below −0.035em.
- Body measure is 62ch (≈ 75 rendered characters at most). Nothing on the page is smaller than 12px. Paragraphs use `text-wrap: pretty` and headings `text-wrap: balance`.
- Every number uses `font-variant-numeric: tabular-nums`, so counters and timestamps never jitter.

## Layout

- The 1200px container is centred, but the **content is left-aligned**. Hero, section heads,
  cards and timeline all hang from a left edge. Nothing is centred except the loader and the Deck
  card.
- **Blueprint frame:** two hairline vertical rules at the container edges, with small 3px dot
  markers where a section's top rule meets them, the way an architecture schematic is drawn. It
  isn't a grid overlay or a texture.
- Sections separate by space (160px desktop, 96px mobile), not by dividers or alternating bands.
- Cards live on `surface-1` with a hairline border. Hover lifts to `surface-2`, with no shadow.
  Floating chrome (nav, chat, dialog, deck) uses a `float` shadow and no border.
- No nested cards. A widget body inside a card is a `surface-3` well, not a second card.

## Shape

The radii are 6 / 8 / 12 / 16 and pill. 16px is the ceiling for any container. Pills are only for
small controls (nav items, buttons, chips, toggles, the chat launcher).

## Motion

| What | Library | Duration / ease | Reduced motion |
|---|---|---|---|
| Loader counter 000→100 | Anime.js | `loader-count` 1100ms, ease-out (fast to 90, crawl to 100) | Skipped entirely |
| Loader curtain | GSAP | `loader-curtain` 600ms `in-out`, translateY −100% | Skipped |
| Section reveals (staggered) | GSAP ScrollTrigger | `slow` 400ms `out-expo`, y 16px → 0, opacity .001 → 1, `items` stagger | Content static, fully visible |
| Rotating hero title | React Bits Rotating Text | letters `out-expo` ≤ 400ms, 30ms stagger, a title every 2.8s | First title, static |
| Works layout change | GSAP Flip | `max` 600ms `out-expo` | Instant swap |
| Deck view | GSAP ScrollTrigger pin | scrubbed to scroll, card hand-off `in-out` | Plain vertical list |
| Timeline | GSAP ScrollTrigger | rows `slow` `out-expo`, `items` stagger; the rail scales Y 0 → 1 (transform) | Static |
| Buttons, chips, magnetic CTA | Anime.js | `fast`/`base`, `out-quart`, magnetic ≤ 6px | No translation |
| Typed prompt lines | Anime.js timeline | 28ms/char, once in view | Full text immediately |
| Logo Loop marquee | React Bits Logo Loop | 40px/s linear, pauses on hover/focus | Static row, wraps |
| Theme switch | View Transitions | radial reveal from the toggle, `max` 600ms `out-expo` | Instant swap |
| Widgets | Anime.js | each update ≤ `base` 240ms | Values update without tweening; streams pause |

**Rules:** animate `transform` and `opacity` only. Nothing exceeds 600ms except the loader. Content
is visible without JavaScript, so GSAP applies the from-state at mount and never ships hidden HTML.
There's one authored moment per section, and entrances vary (rise, mask-free stagger, rail draw,
Flip) rather than repeating one fade. Scroll must hold 60fps: no scroll listeners that cause layout,
only ScrollTrigger, and `will-change` only while animating. Every animation checks
`prefers-reduced-motion: reduce` through a shared `useReducedMotion()` and a GSAP
`matchMedia()` context.

## Browser surfaces (themed, never default)

- `::selection` → `accent-soft` background, `ink` text.
- `caret-color` → `accent`.
- Focus → `outline: 2px solid var(--color-accent); outline-offset: 2px` on `:focus-visible`
  only, with the radius following the control.
- Scrollbar → thin, with the thumb in `hairline-strong` and the hover in `control-border`, on a transparent track.
- Links → underline offset 3px, thickness 1px, turning `accent` on hover.
- `color-scheme: dark` / `light` set on `<html>` so form controls and scrollbars match.
- Tap highlight is off, with a visible `:active` state instead.

## Components (tokens to use)

| Component | Spec |
|---|---|
| **Nav pill** | fixed top-centre, `surface-1` at 80% plus a 12px backdrop blur (the one functional blur), `float` shadow, `pill`, 44px tall. Items are `small` at 15px with an icon and a label (labels drop below 768px). The active item gets `surface-2` and an amber 4px dot. It hides on scroll-down and shows on scroll-up (`base`, `out-expo`, translateY). |
| **Button primary ("Hire me")** | `ink` fill, `canvas` text, `pill`, 40px tall, `small` at weight 550. Hover: Anime.js scale 1.02 plus a 6px magnetic pull. |
| **Button secondary** | `surface-1`, 1px `hairline-strong` border, `ink` text, `pill`. |
| **Chip (filter)** | 32px, `pill`, `small`. The label is `ink-muted`, and the count is `mono-sm` in `ink-subtle`. Selected: `surface-2` fill, `ink` label, count in `accent-text`. Chips sit in a segmented track (`surface-1`, hairline border). |
| **Card** | `surface-1`, 1px `hairline`, `lg` radius, 24px padding (32 desktop). Hover: `surface-2`. |
| **Widget card** | Card plus the React Bits Spotlight effect in neutral `ink` at 6% (hover or focus only, no idle glow; a chromatic amber glow read as a decorative halo). The body is a `surface-3` well with `md` radius. The header has the widget name (`h4` at 16px), an "Illustrative demo" `caption`, and a reset icon button. |
| **Prompt line** | `surface-3`, `sm` radius, `mono` in `ink-muted`, a 2px amber caret block blinking at 1s steps (static under reduced motion), 36px tall. |
| **Timeline row** | A 4-column grid (role · org · place · years). The years are `mono` and tabular. There's a hairline bottom rule, and an amber dot on the rail marks the current role. |
| **Logo tile** | a 32px simple-icons SVG in `ink-subtle`; on hover or focus it crossfades to the brand colour over `fast`. That's the only place third-party colours appear, and only during interaction. |
| **Dialog (Agent view)** | native `<dialog>`, `surface-1`, `lg` radius, `float` shadow, max 896px wide, Markdown in `mono` with Copy and Close actions, `scrim` behind. |
| **Chat panel** | `surface-1`, `lg` radius, `float` shadow, 400px wide (full width minus 32px on mobile). Starter chips are secondary pills. Bot messages are `ink-muted`, and user messages sit in a `surface-2` bubble with `md` radius. |
| **Loader** | `canvas` full-screen, a centred 160px hairline progress rule with the amber fill growing in `scaleX`, and "Loading" and `000` in `mono` at the ends of the rule. |

## Do / Don't

**Do:** left-align; keep amber scarce; label every illustrative number "illustrative demo";
use real CV facts or a visible `TODO:`; theme every browser surface; test both themes at 375,
768, 1280 and 1920.

**Don't:** use purple or any gradient; glassmorphism (the nav's backdrop blur is the only blur, and
it's there for legibility); centre whole layouts; use emoji bullets or Unicode icons (the icons are
Lucide at a 1.5px stroke); write filler copy; put an eyebrow above a heading; number sections
01/02/03 (the Deck counter `01 / 04` is the one exception, because it shows position); use a
colored `border-left`; nest cards; use a radius over 16px on containers; put a soft shadow under a border; animate
anything but transform and opacity; or let anything run over 600ms outside the loader.
