#!/usr/bin/env bash
# Fetch the live site and confirm HTTP 200 + expected content.
set -euo pipefail

SITE_URL="${SITE_URL:-https://dnd.h3r3.com}"
MARKER="${VERIFY_MARKER:-Hotel Door Hanger Collection}"

echo "→ GET $SITE_URL"
response="$(curl -sS -o /tmp/dnd-verify.html -w '%{http_code} %{time_total}s' --max-time 15 "$SITE_URL")"
code="${response%% *}"
elapsed="${response#* }"

if [ "$code" != "200" ]; then
	echo "✗ unexpected status: $code (${elapsed})" >&2
	head -20 /tmp/dnd-verify.html >&2 || true
	exit 1
fi

if ! grep -q "$MARKER" /tmp/dnd-verify.html; then
	echo "✗ HTTP 200 but marker not found: '$MARKER'" >&2
	echo "  (site may be stale or a CF error page)" >&2
	exit 1
fi

echo "✓ live at $SITE_URL ($code, ${elapsed})"
