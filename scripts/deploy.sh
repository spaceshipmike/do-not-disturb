#!/usr/bin/env bash
# Bootstrap do-not-disturb on the NAS, or hand-deploy a new image immediately.
#
# Day-to-day flow is `git push` → GitHub Actions → ghcr → WUD pulls. This
# script is for: (a) first-time setup; (b) syncing a changed compose.yml;
# (c) forcing a pull without waiting for WUD.
#
# Usage:
#   scripts/deploy.sh                 # sync compose + pull + up
#   scripts/deploy.sh --pull-only     # just pull latest image + restart
set -euo pipefail

NAS="mike@192.168.10.10"
NAS_SERVICE_DIR="docker/services/do-not-disturb"

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

pull_only=false
for arg in "$@"; do
	case $arg in
		--pull-only) pull_only=true ;;
		-h|--help)
			sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
			exit 0
			;;
		*)
			echo "unknown arg: $arg" >&2
			exit 2
			;;
	esac
done

if [ "$pull_only" = true ]; then
	echo "==> Pulling latest image and restarting on NAS..."
	ssh "$NAS" "cd ~/$NAS_SERVICE_DIR && docker compose pull && docker compose up -d"
else
	echo "==> Syncing compose file to NAS..."
	ssh "$NAS" "mkdir -p ~/$NAS_SERVICE_DIR"
	# UGREEN NAS: scp/rsync are unreliable. Use cat-pipe.
	cat deploy/compose.yml | ssh "$NAS" "cat > ~/$NAS_SERVICE_DIR/compose.yml"

	echo "==> Pulling latest image and starting container..."
	ssh "$NAS" "cd ~/$NAS_SERVICE_DIR && docker compose pull && docker compose up -d"
fi

echo ""
ssh "$NAS" "docker ps --filter name=do-not-disturb --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
echo ""
echo "==> Done. See docs/setup.md for Traefik + CF Tunnel wiring."
