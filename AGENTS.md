# AGENTS.md — Updating dnd.h3r3.com

## What this repo is

A static gallery at **https://dnd.h3r3.com** for a collection of 55
hotel "Do Not Disturb" door hangers. The page is `site/index.html` plus
two JSX files transformed in-browser by Babel Standalone (no build
step). It ships as a `nginx:alpine` Docker image to GHCR; the NAS
container auto-updates.

```
edit site/*
       │
       ▼  git push
GitHub Actions builds → ghcr.io/spaceshipmike/do-not-disturb:latest
       │
       ▼  WUD on NAS detects new image (~minutes)
NAS pulls + restarts container
       │
       ▼
LAN: Traefik (M1) ──▶ http://192.168.10.10:4604
WAN: Cloudflare Tunnel ──▶ http://do-not-disturb:80 (NAS)
```

## To update the site

1. Edit files under `site/`. See `CLAUDE.md` for the architecture
   (script load order, `window.HANGERS` globals, the hard-coded count of
   55 plates).
2. Preview locally: `make preview` (opens via `file://`). If your
   browser blocks `.jsx` fetches over `file://`, use `make serve` and
   visit http://localhost:8000/.
3. Commit + push:
   ```bash
   git commit -am "what changed"
   git push
   ```
4. That's it. ~2 minutes later the image is on GHCR and WUD has rolled
   it out. Confirm:
   ```bash
   make verify   # curl https://dnd.h3r3.com, check 200 + content marker
   ```

## Adding a new plate

1. Drop the scan in `site/assets/` as `hanger_NNNN.jpg` (4-digit
   zero-padded — `hanger_0056.jpg` for plate 56).
2. Bump the plate count: search `site/` for the literals `55` and `055`
   and update them. The data file generates the array from
   `length: 55`, and several display strings (`/ 055`, `Math.min(55, …)`,
   `001 — 055`) reference the total too.
3. `make preview` → commit + push.

`uploads/` at the repo root is a personal staging area — `.gitignore`d
and `.dockerignore`d. Move finalized scans into `site/assets/` before
they count as part of the collection.

## To roll back

```bash
git revert HEAD
git push
make verify
```

Every commit = the whole site. No migrations, no built artifacts to
sync.

## To force a deploy faster than WUD

```bash
make pull   # ssh to NAS → docker compose pull && up -d
```

Use when:
- A change is urgent and WUD's poll interval (~5 min) is too slow
- You suspect WUD missed an update

## Config changes (compose / nginx / Dockerfile)

These don't go through WUD — they require a NAS-side restart with a
synced compose file:

```bash
make bootstrap   # rsyncs compose.yml to NAS + pulls + restarts
make verify
```

Image-affecting changes (Dockerfile, nginx.conf) also need a `git push`
first so GH Actions builds the new image. Then `make pull`.

## External surfaces (NOT in this repo)

If `make verify` fails after a deploy, the problem is almost certainly
one of these — see `docs/setup.md` for what to look for:

- **M1 Traefik route** in `~/docker/traefik/dynamic/nas-services.yml`
- **Cloudflare Tunnel public hostname** (Zero Trust dashboard → Networks
  → Tunnels → public hostnames)
- **GitHub Actions** build (check the run on github.com/spaceshipmike/do-not-disturb/actions)
- **WUD** (visible on the homelab dashboard)

## GitHub Actions usage — the workflow has a path filter

The CI build only runs when `site/**`, `nginx.conf`, `Dockerfile`,
`.dockerignore`, or the workflow file itself changes. Edits to
`AGENTS.md`, `CLAUDE.md`, `docs/**`, `Makefile`, `scripts/**`,
`deploy/**`, or the root-level design-exploration files
(`Directions.html`, `design-canvas.jsx`, `gallery-archive.jsx`,
`gallery-drawer.jsx`, `gallery-folio.jsx`) ship via `git push` without
consuming any Actions minutes — they don't affect the image.

If you change one of the image-affecting files but want to defer the
build (e.g., grouping with later changes), add `[skip ci]` to the commit
message and push later commits without it to trigger the build.

To check what triggered or didn't trigger a build: see the workflow file
(`paths:` allowlist), or look at https://github.com/spaceshipmike/do-not-disturb/actions.

## Don't

- Don't add a build step (Vite/Astro/etc.) — the whole point is "static
  HTML + JSX transformed by Babel in the browser, ship it."
- Don't add npm/package.json. Dependencies come from CDN script tags.
- Don't move the design-exploration files (`Directions.html`,
  `design-canvas.jsx`, the three variant JSXes) into `site/` — they're
  the design history, deliberately excluded from the image via
  `.dockerignore`.
- Don't bypass `git push` as the deploy mechanism — manual image pushes
  break the GHCR-tag-driven WUD loop and produce mystery images.
- Don't commit secrets, `.env`, or anything under `.cache/`.
