# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Directory Is

A **vanilla HTML/CSS/JS static portfolio site** for Muhammad Ahmad Waseem (ML Engineer, UB). No build step, no framework, no package manager — edit files and open in a browser.

**This is the active portfolio under development.** The previous Next.js portfolio (`PersonalWeb/`) is deployed at `https://ahmad-waseem.vercel.app/` and is feature-complete. This site will replace or complement it; deployment target TBD.

## File Structure

| Path | Role |
|---|---|
| `index.html` | Home page (hero, work grid, now, quotes) |
| `about.html`, `contact.html`, `experience.html`, `publications.html`, `projects.html`, `now.html`, `writing.html` | Top-level pages |
| `projects/*.html` | Individual project case-study pages (autophon, rdaam, tfnet, cuda, quant, lwmc, popdensity, sprawl, cooling) |
| `styles/site.css` | Global design system (CSS custom properties, layout shell, nav, buttons, section headers) |
| `styles/project.css` | Case-study-specific styles (`.case-hero`, `.metrics`, `.body-grid`, `.case-links`, `.nav-prev-next`) |
| `components/layout.js` | Renders shared top nav + footer into every page via `SiteLayout.mount(pageId, label)` |
| `components/tweaks.js` | Floating accent/paper color picker panel (edit-mode only, activated via `postMessage`) |
| `assets/` | Images (profile, testimonials, project thumbnails) and `resume.pdf` |

## Architecture

**Shared layout injection** — every page is a bare `<body><div class="shell"><main class="page">…</main></div></body>`. `components/layout.js` inserts the `<header class="topnav">` before `.shell` and `<footer class="site-footer">` after it at runtime. Pages in `projects/` pass `base = '../'` automatically (detected via `location.pathname`).

**Design tokens** live entirely in CSS custom properties on `:root` in `site.css`: `--paper`, `--ink`, `--accent` (burnt sienna), `--f-display` (Instrument Serif), `--f-sans` (Inter), `--f-mono` (JetBrains Mono). `tweaks.js` overrides `--accent` and `--paper-*` on `document.documentElement.style` at runtime.

**Reveal animation** — add class `reveal` to any section; `layout.js` uses `IntersectionObserver` to add `in` when it enters the viewport. The `reveal.in` CSS transition handles the fade+lift.

**Page registration** — the `PAGES` array in `layout.js` is the single source of truth for nav order and hrefs. Adding a new page requires an entry there plus a new HTML file.

## Key Content Details

- **Availability**: July 2026 (STEM OPT) — update `layout.js` (`"Available Jul 2026"` in `renderTopnav`) and `index.html` hero text when this changes.
- **Resume**: served from `assets/resume.pdf`; referenced in `layout.js` `renderTopnav` and `index.html` hero.
- **Tweaks panel** is hidden by default; it becomes visible only when a parent frame sends `{ type: '__activate_edit_mode' }` via `postMessage`.
- All project pages use `<link rel="stylesheet" href="../styles/project.css">` and call `SiteLayout.mount('work', …)`.
