# Hashim Khan N — portfolio

Personal site of Hashim Khan N, Software Engineer – Backend. It's a single page, exported as static
HTML and deployed to GitHub Pages at **https://itshashi7.github.io/hashi/** (repo `itshashi7/hashi`).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), `output: "export"`, TypeScript |
| Styling | Tailwind CSS 4, tokens from `DESIGN.md` → `app/globals.css` |
| Fonts | Archivo (headings and UI) and JetBrains Mono (figures, logs, code), self-hosted at build time via `next/font` |
| Section motion | GSAP + ScrollTrigger (reveals, the Deck pin, the journey timeline) and GSAP Flip (Works layout changes) |
| Micro-interactions | Anime.js 4 (loader counter, magnetic button, typed prompts, widget updates, chat messages) |
| Components | React Bits: Rotating Text, Logo Loop and Spotlight Card, vendored in `components/reactbits/` (local edits are marked `local:`) |
| Theme | next-themes (dark default), with the View Transitions radial reveal |
| Icons | lucide-react (UI) and simple-icons (stack logos; AWS, Azure and VS Code fall back to text wordmarks) |

Every animation has a `prefers-reduced-motion` path. With reduced motion there's no loader, all
content is static and fully visible, prompts appear already typed, the Deck becomes a plain list, and the log stream pauses.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to out/
npm run serve      # serve out/ at http://localhost:4173/hashi/
npm run typecheck
```

## Edit the content

All copy comes from **`content/profile.json`**. Edit it and rebuild, and every section updates:

- `person`: name, title, summary, availability, languages.
- `links`: email, LinkedIn, GitHub, and the resume path (`/cv.pdf`, or a `TODO` while the CV is held back).
- `experience`: roles and highlights (they feed the hero, About, the chat and Agent view).
- `projects`: case studies. Each has `categories` (filter chips: Backend, Cloud, AI, Tools), `tags`,
  the typed `prompt` line, `type`, `year`, `role`, `summary` and `caseStudy` (problem, approach, architecture, outcome),
  plus optional `links.repo` and `links.demo`.
- `experiments`: the three experiment cards and their Try it / View code links.
- `skills` and `stackLogos`: the grouped skill lines and the logo grid (logo names map to `lib/icons.ts`).
- `faq`: relocation and notice period, used by the "Ask me anything" chat.

Any string that starts with `TODO` renders as a visible placeholder. The full list is in `TODO.md`.
The CV download is currently held back because the PDF shows a phone number; both `cv.pdf` copies are
git-ignored so they never reach the public repo. To publish a CV, save a version without the number as
`public/cv.pdf`, set `links.resume` to `/cv.pdf`, and remove `/public/cv.pdf` from `.gitignore`.

To change how the chat answers, edit the intents in `lib/chat.ts`. It runs keyword matching in the browser
and never calls a model.

## Design system

`DESIGN.md` is the single source of truth for colour, type, spacing, radii, elevation and motion.
Add a value there first, then expose it in `app/globals.css` (CSS variables plus the Tailwind `@theme`) or
`lib/tokens.ts` (GSAP and Anime.js timings). `PRODUCT.md` records the audience and the product facts, and
`docs/reference-analysis.md` records what was taken from the reference site (structure and motion only).

## Deploy (GitHub Pages)

1. Create an empty public repo named **`hashi`** and push this folder to its `main` branch.
2. In the repo, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which installs, type-checks, builds `out/` and
   deploys it. The site goes live at https://itshashi7.github.io/hashi/.

The site lives under the `/hashi` path, set by `BASE_PATH` in `next.config.ts` and `SITE_URL` in
`lib/profile.ts`. To move it (for example to the root `itshashi7.github.io` repo), change both: use `""` and
`https://itshashi7.github.io` for the root. To preview the built site locally with the path in place, serve the
folder that contains a copy of `out/` named `hashi`, then open `/hashi/`.

## SEO assets

- Metadata, Open Graph and Twitter cards: `app/layout.tsx`.
- `sitemap.xml` and `robots.txt`: `app/sitemap.ts` and `app/robots.ts`, generated at build.
- Favicon: `app/icon.svg`. Apple touch icon: `app/apple-icon.png`.
- OG image: `public/og.png` (1200×630), rendered from `scripts/og.html` with the site's own fonts.
  To regenerate it, run `npm run build`, then copy `scripts/og.html` to `out/og.html`, replacing `__SITE_CSS__` with
  the CSS path from `out/index.html` and the `<html>` class with the one there. Serve `out/`, open `/og.html` at a
  1200×630 viewport, and screenshot it to `public/og.png`.

## Project map

```
app/                 layout, page, global CSS, sitemap, robots, icons
components/site/     loader, nav, theme toggle, scroll index
components/sections/ hero (+ request trace), marquee, gallery, works, experiments, ask, about, stack, footer
components/widgets/  the six illustrative backend demos
components/works/    typed prompt line, case schematics
components/reactbits React Bits components (vendored)
lib/                 profile data, tokens, motion helpers, chat intents, Agent view Markdown, icons
content/profile.json all site copy
docs/                reference analysis, section plan, screenshots
```
