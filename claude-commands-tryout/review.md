---
description: Review a file or set of files for code quality, bugs, security issues, and best practices. Works with any programming language.
---

# Command: Code Review

Review the file or files provided: **$ARGUMENTS**

## Steps

1. Read the file(s) at the path(s) provided in `$ARGUMENTS`
2. Perform a thorough review across these categories:

### Bugs & Correctness
- Logic errors or off-by-one mistakes
- Unhandled edge cases (null, empty, zero, overflow)
- Incorrect error handling or swallowed exceptions
- Race conditions or concurrency issues

### Security
- Input validation gaps (unsanitized user input)
- SQL injection, XSS, or injection vulnerabilities
- Sensitive data exposed in logs or responses
- Insecure defaults or hardcoded credentials

### Performance
- Unnecessary loops inside loops (O(n²) patterns)
- Missing indexes or N+1 query patterns
- Repeated expensive computations that could be cached
- Memory leaks or large object allocations in loops

### Code Quality
- Functions doing more than one thing
- Overly complex conditionals that could be simplified
- Magic numbers or strings without named constants
- Misleading or unclear naming

### Maintainability
- Missing or insufficient error messages
- Code that is hard to test (tight coupling, hidden dependencies)
- Duplication that should be extracted

## Output Format

Structure the review as:

**Summary** — one paragraph overall assessment

**Issues Found** — grouped by severity:
- 🔴 Critical — must fix (bugs, security)
- 🟡 Important — should fix (performance, correctness risks)
- 🔵 Suggestion — nice to have (style, maintainability)

**What's Done Well** — highlight good patterns worth keeping

## Rules
- Be specific — reference line numbers or code snippets for each issue
- Do not rewrite the whole file — only point out issues and suggest fixes
- If no issues are found, say so clearly
