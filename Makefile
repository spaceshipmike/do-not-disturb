# do-not-disturb — agent-friendly Make targets.
#
# Day-to-day:
#   edit site/* → git commit → git push  (GH Actions → ghcr → WUD)
# This Makefile is for preview, verification, and emergency hand-deploys.

NAS             ?= mike@192.168.10.10
NAS_SERVICE_DIR ?= docker/services/do-not-disturb
SITE_URL        ?= https://dnd.h3r3.com

.PHONY: help preview serve bootstrap pull verify logs status restart down

help: ## List targets
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

preview: ## Open site/index.html in the default browser (local preview, file://)
	@open site/index.html

serve: ## Serve site/ on http://localhost:8000 (use if file:// blocks .jsx fetches)
	@cd site && python3 -m http.server 8000

bootstrap: ## First-time deploy: sync compose to NAS + pull + start
	@scripts/deploy.sh

pull: ## Force pull latest image on NAS (skip waiting for WUD)
	@scripts/deploy.sh --pull-only

verify: ## curl https://dnd.h3r3.com, check HTTP 200 + content marker
	@scripts/verify.sh

logs: ## Tail container logs on the NAS
	ssh $(NAS) "cd ~/$(NAS_SERVICE_DIR) && docker compose logs --tail=100 -f"

status: ## Show container status on the NAS
	ssh $(NAS) "docker ps --filter name=do-not-disturb --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

restart: ## Restart container on the NAS
	ssh $(NAS) "cd ~/$(NAS_SERVICE_DIR) && docker compose restart"

down: ## Stop the stack on the NAS
	ssh $(NAS) "cd ~/$(NAS_SERVICE_DIR) && docker compose down"
