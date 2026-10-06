#!/usr/bin/env bash
set -euo pipefail

# Deletes only disposable runtime files older than one hour. It never touches
# Git, Obsidian, agent memory, model weights, credentials, VM disks or Drive data.
HOME_DIR="${HOME:?}"
REPO_DIR="${STUDEX_HOME_REPO:-$HOME_DIR/N}"
REPORT_DIR="$REPO_DIR/reports/local"
REPORT_FILE="$REPORT_DIR/cache-reset.log"
mkdir -p "$REPORT_DIR" "$HOME_DIR/Library/Caches/StudExRuntime"
TARGETS=(
  "$HOME_DIR/Library/Caches/StudExRuntime"
  "$HOME_DIR/.openclaw-dench/tmp"
  "$HOME_DIR/.openclaw-dench/web-runtime"
  "$HOME_DIR/.config/browser-harness/tmp"
  "$HOME_DIR/.config/browser-harness/runtime"
  "$HOME_DIR/.qwen/tmp"
  "$HOME_DIR/.summarize/cache"
  "$HOME_DIR/.lark-cli/cache"
)
before=0
after=0
for target in "${TARGETS[@]}"; do
  [[ -d "$target" ]] || continue
  before=$((before + $(du -sk "$target" 2>/dev/null | awk '{print $1}' || echo 0)))
  find -P "$target" -type f -mmin +60 -delete 2>/dev/null || true
  find -P "$target" -type d -empty -mindepth 1 -delete 2>/dev/null || true
  after=$((after + $(du -sk "$target" 2>/dev/null | awk '{print $1}' || echo 0)))
done
freed=$((before - after))
printf '%s removed_kb=%s remaining_kb=%s targets=%s\n' "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$freed" "$after" "${#TARGETS[@]}" >> "$REPORT_FILE"
