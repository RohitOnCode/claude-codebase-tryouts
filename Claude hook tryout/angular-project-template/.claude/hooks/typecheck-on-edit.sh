#!/bin/bash
# Claude Code Hook — Run tsc --noEmit after Claude edits a TypeScript file.
# Trigger: PostToolUse → Write | Edit
# Effect:  Prints type errors so Claude can see them and self-correct.
#          Always exits 0 so the session continues; Claude acts on the output.

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

[[ -z "$FILE" ]] && exit 0
[[ "$FILE" != *.ts ]] && exit 0
# Skip spec files — the test hook handles those
[[ "$FILE" == *.spec.ts ]] && exit 0

# Walk up to find the nearest tsconfig.json
DIR=$(dirname "$FILE")
while [[ "$DIR" != "/" ]]; do
  if [[ -f "$DIR/tsconfig.json" ]]; then
    echo "--- TypeScript check ($(basename "$DIR")) ---"
    cd "$DIR" || exit 0
    OUTPUT=$(npx tsc --noEmit --pretty 2>&1)
    if [[ $? -eq 0 ]]; then
      echo "✔ No type errors"
    else
      # Show up to 40 lines so Claude can read and fix them
      echo "$OUTPUT" | head -40
      TOTAL=$(echo "$OUTPUT" | grep -c "error TS" 2>/dev/null || true)
      [[ $TOTAL -gt 0 ]] && echo "($TOTAL error(s) total)"
    fi
    exit 0
  fi
  DIR=$(dirname "$DIR")
done

exit 0
