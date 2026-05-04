---
description: Refactor a given file to improve code quality, readability, and structure without changing its behavior. Works with any programming language.
---

# Command: Refactor File

Refactor the file provided by the user. The target file is: **$ARGUMENTS**

## Steps

1. Read the file at the path provided in `$ARGUMENTS`
2. Analyze it for the following issues:
   - Duplicated or repeated logic that can be extracted
   - Functions or methods that are too long (do more than one thing)
   - Poorly named variables, functions, or classes
   - Deep nesting that reduces readability
   - Magic numbers or strings that should be named constants
   - Dead code or unused imports
   - Opportunities to simplify conditional logic
   - Violations of single responsibility principle

3. Refactor the file, applying improvements while:
   - **Preserving all existing behavior exactly** — do not change what the code does
   - **Keeping the same public API** — same function names, same exports, same signatures
   - **Not adding new features** — only improve the existing code
   - **Staying in the same language and framework** — do not introduce new dependencies

4. After applying changes, provide a brief summary of:
   - What was changed and why
   - Any patterns or issues that were fixed

## Rules
- If the file path is missing or invalid, ask the user to provide it
- If the file is already clean and well-structured, say so and explain why no changes were needed
- Never change behavior — only improve structure, naming, and readability
- Do not add comments explaining what the code does — the code should speak for itself
