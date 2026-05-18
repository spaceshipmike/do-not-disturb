# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static one-page gallery for a personal collection of 55 hotel "Do Not Disturb" door hangers, deployed at **https://dnd.h3r3.com**. No build step, no package manager, no tests — HTML files that load React + Babel Standalone from a CDN and transform `.jsx` in the browser.

## Hosting

Containerized (`nginx:alpine`), built by GitHub Actions on push to `main`, published to `ghcr.io/spaceshipmike/do-not-disturb:latest`, auto-pulled by WUD on the home NAS. Matches the `~/Code/personal-site/` pattern exactly — see its `docs/setup.md` for the precedent and `~/Documents/Resources/System/DEPLOY-TO-HOMELAB.md` for the homelab deploy guide.

The deploy mechanism is **`git push`**. No manual rsync, no image-build-on-laptop, no SSH for content changes. `AGENTS.md` has the full update loop; `docs/setup.md` has the one-time NAS + Traefik + Cloudflare Tunnel wiring. Container port is **4604** on the NAS (custom-app range `4600–4699`; current claimants: jazz=4600, umami=4601, personal-site=4602, knowmarks-marketing=4603, do-not-disturb=4604). The authoritative port list lives on the M1 at `~/docker/traefik/dynamic/nas-services.yml` — grep there rather than trusting this line, which drifts.

```bash
make preview          # open site/index.html locally
make serve            # python3 -m http.server 8000 in site/ (use if file:// blocks .jsx)
make verify           # curl https://dnd.h3r3.com, check 200 + content marker
make pull             # force NAS to pull latest image (skip waiting for WUD)
make bootstrap        # first-time deploy (or after a deploy/compose.yml change)
```

## Layout

```
site/                       # everything shipped in the image
  index.html
  gallery-data.jsx          # window.HANGERS + window.FEATURED_IDS globals
  gallery-folio-app.jsx     # the Folio gallery + detail overlay
  assets/hanger_NNNN.jpg    # 55 scanned plates, 4-digit zero-padded

Directions.html             # design-exploration view — NOT shipped
design-canvas.jsx
gallery-archive.jsx
gallery-drawer.jsx
gallery-folio.jsx
uploads/                    # staging area for new scans — NOT shipped

Dockerfile / nginx.conf     # image build
deploy/compose.yml          # NAS compose file (port 4604, homelab_network, WUD)
.github/workflows/deploy.yml
scripts/{deploy,verify}.sh
Makefile
```

Anything outside `site/` is excluded from the image via `.dockerignore`. The design-exploration files (`Directions.html` + variant JSXes + `design-canvas.jsx`) are kept in the repo as design history but never reach nginx.

## Architecture

Two distinct entry points share the same `gallery-data.jsx`:

- **`site/index.html`** — the shipped artifact. Loads `gallery-data.jsx` + `gallery-folio-app.jsx`. The Folio direction developed into a real interactive gallery: clickable plates, fullscreen detail overlay, keyboard nav (←/→/Esc), curated featured trio + full register grid.
- **`Directions.html`** (repo root, not shipped) — the design-exploration view. Wraps all three direction variants (`gallery-archive.jsx`, `gallery-folio.jsx`, `gallery-drawer.jsx`) inside `design-canvas.jsx` (a Figma-ish artboard canvas with reorderable cards and a fullscreen focus mode).

Script load order matters because data is shared via `window` globals, not modules:

- `gallery-data.jsx` writes `window.HANGERS` (the 55-plate array) and `window.FEATURED_IDS` (a fresh random trio picked on every page load via `pickFeaturedIds`). Every other JSX file reads these globals — load it first.
- `gallery-folio-app.jsx` and the three direction files all assume those globals exist.

`gallery-folio-app.jsx` is the *evolved* version of `gallery-folio.jsx` — keep them in sync conceptually, but the app file is what ships.

## Plate numbering and assets

- 55 plates, hard-coded throughout (`length: 55`, `/ 055`, `Math.min(55, …)`, etc.). If the collection grows, search `site/` for `55` and `055` and update both.
- Filenames follow `site/assets/hanger_NNNN.jpg` (4-digit, zero-padded) — `hanger_0001.jpg` through `hanger_0055.jpg`. Display num is 3-digit (`001`–`055`).
- `uploads/` (repo root) is a staging area for new/replacement scans; only files under `site/assets/` are referenced by the gallery.

## Type and color

Fonts are pulled from Google Fonts in each HTML `<head>`. The Folio uses Instrument Serif (display) + Geist (sans) + Geist Mono. The Archive uses EB Garamond. The Drawer uses Special Elite / Courier Prime. Changing fonts means editing the `<link>` in the HTML *and* the `fontFamily` strings in the corresponding JSX.

All styles live as inline style objects inside each component (no CSS files except the small `<style>` block in each HTML).

## Conventions

- No build step. No JS frameworks beyond React via CDN. If a feature would require either, push back before adding it.
- nginx serves `.jsx` as `application/javascript` (configured in `nginx.conf`) so Babel Standalone can fetch and transform it.
- HTML is sent with `Cache-Control: max-age=0, must-revalidate` so deploys are visible immediately after the new image rolls out.
