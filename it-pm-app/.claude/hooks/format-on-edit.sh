#!/bin/bash
# Claude Code Hook — Auto-format Angular files after Claude edits them.
# Trigger: PostToolUse → Write | Edit
# Effect:  Runs Prettier on any .ts / .html / .css / .scss file Claude touches.

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

[[ -z "$FILE" ]] && exit 0
[[ ! "$FILE" =~ \.(ts|html|css|scss)$ ]] && exit 0

# Walk up from the edited file to find the nearest package.json with prettier
DIR=$(dirname "$FILE")
while [[ "$DIR" != "/" ]]; do
  if [[ -f "$DIR/package.json" ]] && grep -q '"prettier"' "$DIR/package.json" 2>/dev/null; then
    npx --prefix "$DIR" prettier --write "$FILE" --log-level warn 2>&1
    echo "✔ Formatted: $(basename "$FILE")"
    exit 0
  fi
  DIR=$(dirname "$DIR")
done

echo "ℹ Prettier not found — skipping format for $(basename "$FILE")"
exit 0
