#!/bin/bash
# Claude Code Hook — Run Vitest on a spec file after Claude edits it.
# Trigger: PostToolUse → Write | Edit
# Effect:  Instantly shows test results so Claude can fix failures in the same session.

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

[[ -z "$FILE" ]] && exit 0
[[ "$FILE" != *.spec.ts ]] && exit 0

# Walk up to find the project root (package.json with vitest)
DIR=$(dirname "$FILE")
while [[ "$DIR" != "/" ]]; do
  if [[ -f "$DIR/package.json" ]] && grep -q '"vitest"' "$DIR/package.json" 2>/dev/null; then
    echo "--- Vitest: $(basename "$FILE") ---"
    cd "$DIR" || exit 0
    npx vitest run "$FILE" --reporter=verbose 2>&1 | tail -35
    exit 0
  fi
  DIR=$(dirname "$DIR")
done

echo "ℹ Vitest not found — skipping test run"
exit 0
