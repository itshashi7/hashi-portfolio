# TODO

Everything the site shows as `TODO:` or that is still open. Edit `content/profile.json` to fill
content items, and the site updates on the next build.

## Content (missing from the CV)
- [x] Wikipedia Summarizer: repo URL → https://github.com/itshashi7/wiki_summarizer (found on your GitHub, 2026-11-08)
- [ ] CV download: held back because the PDF shows your phone number. Make a version without it, save it as
      `public/cv.pdf` (git-ignored), set `links.resume` to `/cv.pdf` in profile.json, and remove `/public/cv.pdf`
      from .gitignore. Until then the hero shows "Email me" and the footer shows a TODO.
- [ ] Wikipedia Summarizer: live demo URL, if any
- [ ] Wikipedia Summarizer: year
- [ ] Wikipedia Summarizer: which NLP library or technique it uses
- [ ] Wikipedia Summarizer: a shareable result (users, screenshots, quality)
- [ ] RAG & MCP workshop: year
- [ ] RAG & MCP workshop: code or write-up link
- [ ] RAG & MCP workshop: what you shipped or learned (outcome line)
- [ ] IZO Multi Cloud Connect: a measurable outcome you can share publicly (optional; none is on the CV)
- [ ] Experiments: "Try it" and "View code" links for RAG pipeline, MCP server setup and Built with Claude Code
- [ ] This site: public repo URL for the "Built with Claude Code" card (https://github.com/itshashi7/hashi once it's pushed)

## To confirm (taken from the brief, not the CV)
- [ ] B.E. graduation year 2024
- [ ] Languages: English, Tamil, Hindi

## Decided
- [x] Relocation: open to remote roles and to relocating to the UAE or Saudi Arabia (confirmed 2026-11-08)
- [x] Notice period: 90 days (confirmed 2026-11-08)
- [x] Tata Communications and IZO Multi Cloud Connect may be named, with CV wording only (confirmed 2026-11-08)
- [x] The phone number from the CV is deliberately not published

## Ship
- [ ] Create the public repo `hashi` (empty), push to `main`, and set Settings → Pages → Source to "GitHub Actions".
      The site goes live at https://itshashi7.github.io/hashi/. The old site in `itshashi7.github.io` stays as it is.
- [ ] Re-measure mobile Lighthouse Performance on the live site. Locally it scored 72–79 (desktop 99) with
      blocking time around 1s at 4x CPU throttling. Kaspersky injects a render-blocking script and strips compression
      locally, so the local numbers understate the live site. If it's still under 90 live: defer the Nav ScrollTrigger
      setup to idle, and consider replacing the Motion-based Rotating Text.

## Tooling gaps from the build
- [ ] Firecrawl: the keyless tier refused poulo.site. Add a Firecrawl API key to re-run the Phase 1
      markdown/branding/screenshot scrape. The analysis was done with Chrome DevTools instead.
- [ ] Refero: the MCP returns HTTP 403 for every call. The style comparison was done from the
      awesome-design-md catalog instead. Re-run when Refero is reachable.
