# Reference analysis — poulo.site

Captured 2026-11-08 with Chrome DevTools MCP: the accessibility tree, computed styles, CSS custom
properties, keyframes, Web Animations timings and screenshots at 1440/1920 desktop and 390 mobile, in both themes.

> **What we take from it:** structure, rhythm, motion and feel only. None of its text, images, logos,
> illustrations, case studies, name or branding go into this site. The copy-rhythm notes below
> describe shape (word counts, punctuation, pacing), not wording.
>
> **Firecrawl:** the scrape in markdown, branding and screenshot formats was refused. The keyless Firecrawl tier
> returns "Anonymous keyless access is unavailable" for this site, so everything here comes from
> DevTools. Re-run the scrape once a Firecrawl API key is added (see TODO.md).

---

## 1. Section order

| # | Section | Anchor | Notes |
|---|---|---|---|
| 0 | Loader | — | Full-screen, every load (no repeat-visit skip). |
| 1 | Floating nav + Book-a-call CTA + theme switch | — | Fixed, top-centre pill; theme button pinned top-right. |
| 2 | Left section index | — | Five horizontal ticks at the left edge; active tick is longer (scroll-spy). |
| 3 | Hero | `#home` | Rotating role title (H1) + two buttons, illustrated portrait in the centre, three expandable intro rows on the right. Animated weather backdrop. |
| 4 | "Led initiatives at" logo carousel | — | Circular logo badges orbiting on an ellipse. |
| 5 | Statement + component gallery | — | One-sentence H2 statement, then a scrollable masonry "wall" of live UI widgets. |
| 6 | Works | `#work` | Filter chips with counts + Showcase / Grid / Deck toggle + case-study cards. |
| 7 | AI Experiments | `#experiments` | Three cards, each with a "try it" link to a live sub-site. |
| 8 | Ask me anything → About | `#about` | Section heading, then About copy, photo mosaic, Journey table. |
| 9 | Stack | `#stack` | Logo grid (mono → colour on hover) + grouped skill lines. |
| 10 | Footer | — | Handwritten quote, menu + contact columns, credit line, "View as AI agent", cookie settings. |
| — | Floating chat button | — | Bottom-right; opens the "Ask about …" panel from anywhere. |

## 2. Copy rhythm (shape only)

- **H1:** four rotating role titles, 2–4 words each, title case, no punctuation. The full list is
  also in a visually hidden `sr-only` span for screen readers.
- **Intro rows:** three stacked accordion rows. Each has an 18px label (3–6 words), and one row is
  open at a time, showing a single muted sentence (15–25 words). The first label is a greeting,
  the second a verb-led claim, the third a discipline line.
- **Section headings:** short, often with terminal punctuation ("X." or "X…"), which gives a
  confident, conversational voice.
- **Statement H2:** a single 20–25 word sentence at 48px. It's the only long heading on the page.
- **Case headline:** `<Name>. <verb-led outcome sentence>.`, 9–15 words. Under it sit hashtag tags,
  one prompt line, product type, category, `Year:` and `Role:` meta, a 1–2 sentence summary, one
  outcome or context sentence, and a "Learn more" pill.
- **Case sub-points:** four per case. Each is a 2–4 word title ending in a period, then one
  sentence of 15–22 words, written in the first person past tense.
- **Journey rows:** role · organisation · location · years, with no prose.
- **Stack lines:** `Group: item, item, item` on one line per group.

## 3. Component inventory

Floating segmented nav (icons at ≤1440, icon + label at wider widths; active item gets a filled pill) ·
CTA pill with a spinning dot-cluster icon · round theme button · left scroll-spy ticks · rotating
per-letter H1 · secondary and outline pill buttons (one has a press-and-hold mechanic) ·
accordion intro rows · portrait whose eyes follow the cursor · orbit logo carousel (draggable,
keyboard-focusable `role=application` + `aria-roledescription=carousel`) · masonry widget wall in
a 24px-radius inset frame with internal scroll, where each widget has a ↻ reset button · segmented
filter chips (icon + label + mono count) · segmented view toggle · showcase case card (visual on the
left, text on the right) · grid case card (mono index badge `01`, preview, title + year, mono hashtag
chips, "View project ↗") · deck card stack (fanned and rotated cards behind, `01 / 06` counter) ·
prompt-input pill with a spinner button · experiment cards · photo mosaic with a tile reveal ·
journey table · logo grid · footer link columns · Markdown `<dialog>` with a Copy button · chat panel ·
cookie toast.

## 4. Design tokens (computed)

### Type
| Role | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Body | TikTok Sans (variable 300–900) | 16 / 24 | 400 | −0.04em (−0.64px) |
| H1 rotating | TikTok Sans | fluid `min(2.75rem, 100cqw/9.4)` (41.7px at 1440, 36.4px at 390) / 1.02 | 600 | −0.04em |
| Statement H2 | TikTok Sans | 48 / 57.6 (1.2) | 500 | −0.04em |
| Section H2, case H3 | TikTok Sans | 32 / 42 | 500 | −0.04em |
| Sub-point H4 | TikTok Sans | 16 / 24, muted colour | 500 | −0.04em |
| Intro rows | TikTok Sans | 18 / 28 | 400 | −0.04em |
| Nav | TikTok Sans | 15 / 22.5 | 400 | −0.04em |
| Buttons, chips | TikTok Sans | 14 / 20 | 400–500 | −0.04em |
| Badges, counts, hashtags, loader, Agent view | IBM Plex Mono | 10–14 | 400–500 | 0 |
| Footer quote | Reenie Beanie (handwriting) | 32 | 400 | — |

The whole site uses one tight −0.04em tracking, and the type scale is small: 12 · 14 · 15 · 16 · 18 · 32 · 42 · 48.

### Colour (shadcn neutral scale; the accent is effectively monochrome)
| Token | Light | Dark |
|---|---|---|
| background | `#ffffff` | `#0a0a0a` |
| foreground | `#0a0a0a` | `#fafafa` |
| card / popover | `#ffffff` | `#171717` |
| secondary / muted | `#f5f5f5` | `#262626` |
| muted-foreground | `#737373` | `#a1a1a1` |
| border | `#e5e5e5` | `rgba(255,255,255,.10)` |
| border-strong / ring | `#a1a1a1` | `#737373` |
| input | `#e5e5e5` | `rgba(255,255,255,.15)` |
| primary | `#171717` | `#e5e5e5` |
| destructive | `#e40014` | `#ff6568` |
| `--brand` (defined but barely used) | `#adfa1d` | — |

The hairlines actually rendered are 0.8px borders at 2–6% foreground. Text is drawn in steps of
foreground opacity (100 / 78 / 54 / 32 / 16%) rather than separate greys.

### Radii
Full pill (by far the most common) · 24px (cards, gallery tiles, gallery frame) · 22px (dialog) · 20px · 16px · 10px (`--radius`) · 8px (prompt pill) · 32px (large visual frames).

### Shadows
- **Hairline lift:** `0 0 .5px rgb(0 0 0/.4), 0 2px 2px rgb(0 0 0/.04)`, used on small surfaces (prompt pill, loader icon).
- **Ring:** `0 0 0 1px rgb(255 255 255/.15)` in dark mode.
- **Float:** `0 10px 40px -10px rgb(0 0 0/.35)` (light) and `/.7` (dark) plus an inset top highlight
  `inset 0 1px 0 rgb(255 255 255/.2)` and a bottom shade `inset 0 -1px 0 rgb(255 255 255/.05)`, used on the nav and CTA.

### Spacing and layout
- Container max-width 1280px; side padding 40px desktop.
- Hero padding `112px 40px 64px`, gap 64px.
- Sections sit flush and are separated by large vertical rhythm (≈ 160–200px), not dividers.
- Gallery frame: 1024px wide, 12px inner padding, 800px tall with internal scroll.
- Chip height 32px, horizontal padding 12px. Stack grid gap 48px row.
- Blueprint framing: hairline vertical rules at the container edges, plus a horizontal rule with small dot markers where the lines cross.
- Bottom-of-viewport progressive blur/fade mask over scrolling content.

### Motion (measured)
| Use | Duration | Easing |
|---|---|---|
| Generic opacity (hover and reveal states) | 300ms | `cubic-bezier(.4,0,.2,1)` |
| Colour / background hover | 150ms | `cubic-bezier(.4,0,.2,1)` |
| Translate / scale / rotate on hover | 300ms | `cubic-bezier(0,0,.2,1)` (ease-out) |
| Scroll reveals (opacity) | 1000–1200ms | ease-out |
| Blur reveals (filter + opacity) | 500ms | ease-out |
| Accordion (grid-template-rows) | 300ms | ease-out |
| Loader exit (curtain) | 500ms | `cubic-bezier(.76,0,.24,1)` |
| Theme reveal | 800ms | `cubic-bezier(.16,1,.3,1)` (expo-out) |
| Rotating title letters | 900ms per letter, ≈ 78ms stagger | linear keyframes |

Scrolling is native (`scroll-behavior: smooth`, no Lenis). `motion-reduce:animate-none` is used on
spinners.

## 5. Behaviours

1. **000→100 loader.** A full-screen layer with a centred isometric line-art illustration (keys
   pressing), a thin progress rule below it, and "Loading" plus a 3-digit counter in mono, one at
   each end of the rule. The counter runs 000→~90 quickly (≈ 300ms), then crawls 90→100
   (≈ 500ms) as an ease-out. The layer exits with a 500ms translate on
   `cubic-bezier(.76,0,.24,1)` (curtain). A CSS `site-loader-failsafe` keyframe hides it if
   JavaScript stalls. It shows on every visit; nothing is stored.
2. **Rotating hero titles.** Each title is split into per-letter spans. A letter enters with
   blur 12px→0, scale 1.35→1 and a 0.35em rise ("vapor-in"), and leaves with blur 14px, scale 1.2
   and a drift up and to the right ("vapor-out"), 900ms per letter with a stagger. Each title stays
   ≈ 4s. A hidden grid stack of every title reserves the width, so nothing reflows.
3. **Logo marquee.** Not a linear marquee: circular badges travel an elliptical orbit with scale
   by depth (≈ 0.93→1.08) and visibility culling at the back, moving about 160px/s at the
   front. It's draggable, touch-pans vertically and takes keyboard focus.
4. **Interactive component gallery.** A masonry wall (CSS columns) of six or more working
   mini-UIs inside a scrollable 24px frame: a receipt printer, a liquid gauge, an OTP vault with a
   digit sphere, a forecast line chart, a candlestick chart and agent lanes. Each has a ↻ reset
   button, and each runs on demo data.
5. **Filter chips and the view toggle.** Chips are radios inside a segmented track (icon + label +
   mono count), and a polite live region reads "Showing N of M projects". The Showcase / Grid / Deck
   toggle is a second radio group. Showcase shows full two-column case cards, Grid shows a 3-up card
   grid, and Deck shows a fanned card stack with one card in front and a `01 / 06` counter (drag or
   swipe, not scroll-pinned).
6. **Case-study cards with prompt lines.** Each visual has a prompt pill (a one-line, natural
   language request) next to a spinner button, like a chat composer that has just sent a request.
   The text is static once it's in view.
7. **Ask me anything.** A floating round button (bottom-right) opens a 520px panel. It has a title
   and subtitle, a close button, an assistant greeting with a dotted avatar, four stacked starter
   chips (pill outlines, questions of 3–6 words), a textarea with an animated gradient border and
   a send button, and a disclaimer line. The floating button turns into an ×.
8. **Journey timeline.** A four-column table (role · organisation · location · years) with
   hairline row dividers and a fade/blur reveal as it enters. It has no vertical line or dots.
9. **Stack logos.** 32px logos in a 6-column grid. Each has two stacked images: a mono SVG
   (inverted in dark mode) and a colour SVG. They crossfade over 300ms on hover or `data-lit`.
   Below the grid are grouped skill lines.
10. **Agent view.** "View as AI agent" opens a native `<dialog>` (896×636, radius 22px) showing
    the whole page as Markdown with YAML front-matter (title, url), in IBM Plex Mono, with "Copy
    Markdown" and "Close" buttons. Focus moves into the dialog and Esc closes it.
11. **Light/dark switch.** It uses the View Transitions API. The new theme is revealed through a
    radial-gradient mask (feathered at 65%) that grows from the button's position to 150vmax over
    800ms `cubic-bezier(.16,1,.3,1)`. The dark theme is the class `.dark` on `<html>`, with
    `color-scheme` set.
12. **Mobile (390px).** The nav stays a fixed top pill. The H1 scales down to 36px, there's no
    horizontal overflow, and the loader keeps the same layout.

## 6. How we adapt it (our brief's constraints win)

| Reference does | We do |
|---|---|
| Animations up to 1.2s; letters animate `filter: blur` | Nothing over 600ms except the loader; animate only `transform` and `opacity`. Rotating titles use React Bits Rotating Text (y + opacity stagger). |
| Loader on every visit | Loader once per session (`sessionStorage`, in try/catch). |
| Orbit logo carousel of client logos | Linear React Bits Logo Loop of simple-icons in mono, with Tata Communications as a text wordmark. |
| UI widget wall (design work) | Six backend widgets labelled "illustrative demo", each in a Spotlight Card. |
| Deck = drag stack | Deck = GSAP ScrollTrigger pinned card stack; layout changes animate with GSAP Flip. |
| Static prompt line | The prompt types itself once in view (Anime.js), and is static under reduced motion. |
| Chat answers come from an AI model | Client-side intent matching over `profile.json`; no model calls. Falls back to "Email me". |
| Journey = table | Timeline rows revealed by GSAP on scroll; the table shape stays on mobile. |
| Weather backdrop, cartoon portrait, handwriting font, cookie banner, Calendly | Dropped. No portrait illustration of a real person, and no analytics, so no cookie banner. The CTA is a `mailto:` link. |
| Theme reveal 800ms | Same radial View Transition at 600ms; a plain swap when View Transitions are unsupported or motion is reduced. |
| Monochrome + unused lime brand var | Monochrome neutrals + exactly one accent (see DESIGN.md). |
