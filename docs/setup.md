# Setup — one-time wiring for dnd.h3r3.com

After this is done, deploys are just `git push`. See `AGENTS.md`.

The pattern matches `~/Code/personal-site` exactly — refer to its
`docs/setup.md` and to `~/Documents/Resources/System/DEPLOY-TO-HOMELAB.md`
for the general homelab guide.

## Architecture

```
                    Internet
                       │
        ┌──────────────┼──────────────┐
        ▼                             ▼
Cloudflare DNS (*.h3r3.com)   Cloudflare Tunnel
        │                             │
   m1-mini (192.168.10.20)      cloudflared (NAS)
   Traefik · TLS                tunnel ingress
        │                             │
        └──────────────┬──────────────┘
                       ▼
              NAS (192.168.10.10)
              do-not-disturb container :4604
```

Two access paths, both pointing at the same container — pick one or both.

## 1. GitHub repo + GHCR — image registry

This repo needs to live at `spaceshipmike/do-not-disturb` on GitHub for
Actions to build and push to GHCR.

After the local `git init` + initial commit:

```bash
gh repo create spaceshipmike/do-not-disturb --public --source=. --push
```

Nothing else to do. `.github/workflows/deploy.yml` pushes to
`ghcr.io/spaceshipmike/do-not-disturb:latest` on every commit to `main`.
The first push to `main` will create the GHCR package automatically.

If the package needs to be made public (so the NAS doesn't need creds to
pull), do it once after the first build:

1. https://github.com/spaceshipmike?tab=packages
2. `do-not-disturb` → Package settings → Change visibility → Public

If you keep it private, configure docker login on the NAS:
```bash
ssh mike@192.168.10.10 "echo <PAT> | docker login ghcr.io -u spaceshipmike --password-stdin"
```

## 2. Bootstrap the container on the NAS

From this repo:

```bash
make bootstrap
```

This:
- creates `~/docker/services/do-not-disturb/` on the NAS
- copies `deploy/compose.yml` via cat-pipe (scp/rsync are unreliable on UGREEN)
- runs `docker compose pull && docker compose up -d`
- joins the `homelab_network`

Confirm:
```bash
ssh mike@192.168.10.10 "curl -sI http://localhost:4604/healthz"   # → 200
```

## 3. M1 Traefik route (LAN path)

SSH to the M1 and edit the file provider:

```bash
ssh mike@192.168.10.20
nano ~/docker/traefik/dynamic/nas-services.yml
```

Append:

```yaml
http:
  routers:
    do-not-disturb:
      rule: "Host(`dnd.h3r3.com`)"
      service: do-not-disturb
      entryPoints: [websecure]
      tls: {}

  services:
    do-not-disturb:
      loadBalancer:
        servers:
          - url: "http://192.168.10.10:4604"
```

Traefik picks up file-provider changes without a restart. Verify on the M1:
```bash
curl -sI -H 'Host: dnd.h3r3.com' http://localhost:80   # → 308 redirect to https
```

The wildcard `*.h3r3.com` Cloudflare DNS already points at the M1, so no
new DNS record is needed for the Traefik path.

## 4. Cloudflare Tunnel public hostname (WAN path)

In the [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/):

1. Networks → Tunnels → select the active NAS tunnel
2. Public Hostname → Add a public hostname
   - **Subdomain:** `dnd`
   - **Domain:** `h3r3.com`
   - **Service:** `http://do-not-disturb:80`
     (NOT `http://localhost:4604` — the homelab `supabase-cloudflared`
     container is on `homelab_network`, not host networking, so
     `localhost` resolves to cloudflared itself. Use the container name
     + internal port instead. Both containers share `homelab_network`,
     so Docker DNS handles the rest.)
3. Save. Cloudflare auto-creates the CNAME for `dnd.h3r3.com`.

No NAS restart needed — `cloudflared` picks up the change from the
dashboard automatically.

Note: adding `dnd` as a tunnel public hostname creates a specific CNAME
that takes precedence over the `*.h3r3.com` wildcard, so all public
traffic to `dnd.h3r3.com` will flow through the tunnel. The Traefik
route from §3 still serves LAN clients that resolve via AdGuard or hit
the M1 directly.

## 5. Verify end-to-end

```bash
make verify   # → ✓ live at https://dnd.h3r3.com (200, ~0.4s)
```

If it fails, walk the path inward:

1. `make status` — container running on NAS?
2. `ssh mike@192.168.10.10 "curl -sI http://localhost:4604/healthz"` — container healthy?
3. `ssh mike@192.168.10.20 "curl -sI -H 'Host: dnd.h3r3.com' http://localhost:80"` — M1 Traefik routing?
4. Cloudflare Zero Trust → Tunnel → public hostname listed?
5. `dig dnd.h3r3.com` — resolves to a Cloudflare proxy?
6. GH Actions: latest run green? (https://github.com/spaceshipmike/do-not-disturb/actions)
7. WUD dashboard: detected the latest image?

## 6. After setup — agents only need this

```bash
# Edit site/*, then:
git commit -am "what changed"
git push
make verify    # ~2 minutes after push
```

See `AGENTS.md` for the full update loop and rollback.
