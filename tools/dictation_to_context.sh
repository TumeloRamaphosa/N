#!/usr/bin/env bash
set -euo pipefail

# Voicebox post-transcript hook for the StudEx Harness.
# Accepts VOICEBOX_TRANSCRIPT or transcript text on stdin.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATE="$(date +%Y-%m-%d)"
TIME="$(date +%H:%M:%S)"
OUT_DIR="$ROOT/context/dictation"
OUT_FILE="$OUT_DIR/$DATE.md"
OBSIDIAN_DIR="${STUDEX_OBSIDIAN_DIR:-}"

mkdir -p "$OUT_DIR"
TRANSCRIPT="${VOICEBOX_TRANSCRIPT:-}"
if [[ -z "$TRANSCRIPT" && ! -t 0 ]]; then
  TRANSCRIPT="$(cat)"
fi
[[ -z "$TRANSCRIPT" ]] && exit 0

if [[ ! -f "$OUT_FILE" ]]; then
  cat > "$OUT_FILE" <<EOF
---
date: $DATE
source: voicebox
type: dictation-inbox
---

# StudEx dictation — $DATE
EOF
fi

cat >> "$OUT_FILE" <<EOF

## $TIME

$TRANSCRIPT
EOF

# Optional second copy into the selected Obsidian vault. The repo remains the
# canonical record; set STUDEX_OBSIDIAN_DIR explicitly rather than guessing.
if [[ -n "$OBSIDIAN_DIR" ]]; then
  mkdir -p "$OBSIDIAN_DIR"
  cat >> "$OBSIDIAN_DIR/$DATE.md" <<EOF

## StudEx dictation $TIME

$TRANSCRIPT
EOF
fi

echo "Saved dictation to $OUT_FILE"
