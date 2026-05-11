# Claude Hook Tryout

Reusable **Claude Code hooks** for Angular projects.

Claude Code hooks are shell scripts that Claude Code runs **automatically** during
your session — no manual commands needed. They fire on events like "after Claude
edits a file" or "when Claude finishes a response".

---

## What's inside

```
angular-project-template/
  .claude/
    settings.json       ← hook wiring (copy this to your Angular project)
    hooks/
      format-on-edit.sh       ← Hook 1
      typecheck-on-edit.sh    ← Hook 2
      test-on-spec-edit.sh    ← Hook 3
      stop-summary.sh         ← Hook 4
```

---

## The 4 Hooks

### Hook 1 — `format-on-edit.sh`
**Trigger:** Every time Claude writes or edits a `.ts`, `.html`, `.css`, or `.scss` file  
**What it does:** Runs Prettier automatically — you never get an unformatted file  
**Requires:** `prettier` in `devDependencies`

```
Claude edits task-board.ts
  → prettier --write task-board.ts
  → ✔ Formatted: task-board.ts
```

---

### Hook 2 — `typecheck-on-edit.sh`
**Trigger:** Every time Claude writes or edits a `.ts` file (non-spec)  
**What it does:** Runs `tsc --noEmit` and prints any type errors back to Claude  
**Why it matters:** Claude sees the errors in the same turn and fixes them immediately

```
Claude edits project.service.ts (introduces a type error)
  → tsc --noEmit
  → src/app/core/services/project.service.ts:24:5
    Type 'string' is not assignable to type 'number'.
  → Claude reads this and fixes it before you even notice
```

---

### Hook 3 — `test-on-spec-edit.sh`
**Trigger:** Every time Claude writes or edits a `*.spec.ts` file  
**What it does:** Runs Vitest on that specific spec file immediately  
**Why it matters:** Enables a tight TDD loop — write test → Claude sees failure → Claude fixes code

```
Claude edits project.service.spec.ts
  → vitest run project.service.spec.ts
  → ✖ 1 test failed: should return project by id
  → Claude fixes the service and the test passes
```

---

### Hook 4 — `stop-summary.sh`
**Trigger:** When Claude finishes responding (the "Stop" event)  
**What it does:** Prints an Angular health check to your terminal every time Claude stops  
**Output:** TypeScript error count + Prettier formatting status

```
╔══════════════════════════════════════╗
║      Angular Project Health Check   ║
╚══════════════════════════════════════╝

▸ TypeScript
  ✔ 0 type errors

▸ Prettier
  ✔ All files formatted
```

---

## How hooks work in Claude Code

```
You ask Claude to add a feature
         ↓
Claude calls Write tool (edits dashboard.ts)
         ↓
[PostToolUse fires]
  → format-on-edit.sh   → formats the file
  → typecheck-on-edit.sh → finds 1 type error, prints it
         ↓
Claude sees the error output, fixes it in the next tool call
         ↓
Claude finishes responding
         ↓
[Stop fires]
  → stop-summary.sh → prints health check to your terminal
```

---

## How to use in any Angular project

1. **Copy the template into your project:**
   ```bash
   cp -r "angular-project-template/.claude" your-angular-app/
   ```

2. **Make scripts executable:**
   ```bash
   chmod +x your-angular-app/.claude/hooks/*.sh
   ```

3. **Open the project in Claude Code** — hooks activate automatically.

> The hooks auto-detect your project root by walking up the directory tree
> looking for `package.json` or `tsconfig.json`, so they work even when Claude
> edits deeply nested files.

---

## Already applied to

- `it-pm-app/` — hooks are live in `.claude/settings.json` + `.claude/hooks/`
