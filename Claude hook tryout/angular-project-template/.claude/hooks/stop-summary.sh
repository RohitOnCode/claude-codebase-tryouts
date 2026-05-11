#!/bin/bash
# Claude Code Hook — Print a TypeScript health summary when Claude finishes a turn.
# Trigger: Stop
# Effect:  Gives the developer an at-a-glance health check after each Claude response.
#          Output goes to the user (not back to Claude).

PROJECT_DIR=$(pwd)

[[ ! -f "$PROJECT_DIR/tsconfig.json" ]] && exit 0

echo ""
echo "╔══════════════════════════════════════╗"
echo "║      Angular Project Health Check    ║"
echo "╚══════════════════════════════════════╝"

# TypeScript
echo ""
echo "▸ TypeScript"
OUTPUT=$(npx tsc --noEmit 2>&1)
TS_ERRORS=$(echo "$OUTPUT" | grep -c "error TS" 2>/dev/null || true)
if [[ $TS_ERRORS -eq 0 ]]; then
  echo "  ✔ 0 type errors"
else
  echo "  ✖ $TS_ERRORS type error(s)"
  echo "$OUTPUT" | grep "error TS" | head -5 | sed 's/^/    /'
fi

# Prettier (check only — do not write)
if [[ -f "$PROJECT_DIR/package.json" ]] && grep -q '"prettier"' "$PROJECT_DIR/package.json" 2>/dev/null; then
  echo ""
  echo "▸ Prettier"
  UNFORMATTED=$(npx prettier --check "src/**/*.{ts,html,css,scss}" 2>&1 | grep -c "would reformat" || true)
  if [[ $UNFORMATTED -eq 0 ]]; then
    echo "  ✔ All files formatted"
  else
    echo "  ⚠ $UNFORMATTED file(s) need formatting (run: npx prettier --write src/)"
  fi
fi

echo ""
