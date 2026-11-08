# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Decided in the build brief: Next.js (App Router) + TypeScript + Tailwind CSS, `output: 'export'`
static build deployed to GitHub Pages at itshashi7.github.io/hashi-portfolio/ (repo hashi-portfolio). GSAP + ScrollTrigger (section
choreography, Flip, pinning), Anime.js (micro-interactions), React Bits (Rotating Text, Logo Loop,
Spotlight Card), next-themes (light/dark). No server, no API keys in the frontend, no LLM calls.

## Users

Primary: recruiters and engineering hiring managers at product companies in Dubai, Saudi Arabia
and on remote teams, screening backend candidates. They often skim quickly on a laptop, sometimes
on a phone, and need to answer "can this person run backend services in production, on our
stack, and can we hire them?" within a minute or two.

Secondary: engineers on the interview loop who open the case studies and check depth.

## Product Purpose

A personal portfolio for Hashim Khan N, Software Engineer – Backend (2+ years), that turns a
one-page CV into evidence a recruiter can act on: what he builds, on what stack, how he works, and
how to contact him. Success is a recruiter reaching out (email or LinkedIn) or downloading the CV.

## Positioning

A backend engineer who builds cloud-native services for an enterprise multi-cloud networking
platform (IZO Multi Cloud Connect at Tata Communications, connecting enterprise infrastructure
securely to AWS, Azure and GCP): Java and Spring Boot microservices, event-driven RabbitMQ
integrations, PostgreSQL, MySQL and Redis, shipped through Jenkins CI/CD. He also works
AI-assisted every day (GitHub Copilot Agent mode, Claude Code) and has built RAG pipelines and MCP
servers hands-on. The site itself demonstrates the backend mindset through small, honest, working
widgets instead of claims.

## Operating Context

- Recruiters compare many profiles side by side, and the CV PDF and LinkedIn are the usual
  hand-off artefacts.
- The page must work fully offline-from-server (static export) and load fast on mid-range phones.
- The chat answers from `content/profile.json` with client-side intent matching only.

## Capabilities and Constraints

- Every fact comes from `cv.pdf` via `content/profile.json`. Missing details render as visible
  `TODO:` text and are listed in TODO.md. Never invent metrics, employers, dates or projects.
- Confirmed by Hashim on 2026-11-08 (not on the CV): open to remote roles **and** to relocating
  to the UAE or Saudi Arabia; notice period 90 days; Tata Communications and IZO Multi Cloud
  Connect may be named publicly, described only with the CV's wording.
- From the brief, not the CV: languages English, Tamil, Hindi; B.E. completed 2024.
- The phone number on the CV is deliberately not published on the site.
- Interactive widgets show illustrative data and must be labelled as illustrative demos; none
  represent real IZO systems, endpoints or numbers.
- Undecided or missing: repo/demo links for Wikipedia Summarizer, the RAG/MCP work and this site;
  project years for Wikipedia Summarizer and the workshop; any shareable outcome metric for IZO
  work.

## Brand Commitments

- Name: Hashim Khan N. Short name: Hashim. Credit line: "Designed and built by Hashim".
- Voice: confident, technical, calm. Plain English, first person, no hype, no filler.
- Explicitly avoided: purple gradients, generic glassmorphism, centred-everything layouts, emoji
  bullets, lorem-style filler copy.
- poulo.site is a structural and motion reference only. None of its text, images, logos, case
  studies, name or branding may appear.

## Evidence on Hand

- `cv.pdf` (also served as `/cv.pdf`): the source for experience, projects, skills and education.
- `content/profile.json`: structured CV facts plus the confirmed answers above.
- Links: hashimkhan1618@gmail.com, linkedin.com/in/hashim-khan-7b07b3223, github.com/itshashi7.
- Absent, and must not be fabricated: testimonials, client logos (Tata Communications appears as
  a text wordmark only), performance or business metrics, screenshots of internal systems.

## Product Principles

1. **Proof over claims.** Show how he thinks about requests, caches, failures and clouds through
   working demos. Label them honestly.
2. **Recruiter-first scanning.** Role, stack, availability, relocation and contact are reachable
   within seconds from any point on the page.
3. **The CV is the contract.** If it isn't in the CV or confirmed by Hashim, it's a visible TODO,
   not copy.
4. **Calm under load.** Motion and interactivity never block reading, never exceed what the
   content needs, and always have a no-motion path.

## Accessibility & Inclusion

WCAG 2.1 AA; full keyboard navigation with visible focus; `prefers-reduced-motion` respected by
every animation; Lighthouse ≥ 90 on Performance, Accessibility, Best Practices and SEO (mobile and
desktop). Recruiters include non-native English readers, so copy stays plain and literal.
