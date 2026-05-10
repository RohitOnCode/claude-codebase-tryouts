---
description: Generate unit tests for a given file covering happy paths, edge cases, and error conditions. Works with any programming language and test framework.
---

# Command: Write Tests

Generate tests for the file provided: **$ARGUMENTS**

## Steps

1. Read the file at the path provided in `$ARGUMENTS`
2. Identify the testing framework already used in the project:
   - Check for existing test files (`*.spec.ts`, `*Test.java`, `*_test.go`, `test_*.py`, etc.)
   - Check `package.json`, `pom.xml`, `build.gradle`, `pyproject.toml` for test dependencies
   - Use the same framework — do not introduce a new one

3. For each public function, method, or class, generate tests covering:

### Happy Path
- Normal inputs that produce expected outputs
- Boundary values (min, max valid inputs)

### Edge Cases
- Empty inputs (empty string, empty array, zero)
- Null or undefined inputs
- Very large inputs
- Inputs at exact boundary conditions

### Error Cases
- Invalid input types or formats
- Inputs that should trigger exceptions or error responses
- Missing required fields

4. Write tests that are:
   - **Independent** — each test sets up its own data, no shared mutable state
   - **Descriptive** — test name clearly states what is being tested and what is expected
   - **Focused** — one assertion concept per test (can have multiple `expect` calls for one scenario)
   - **Fast** — no real HTTP calls, DB calls, or file I/O — mock external dependencies

## Output
- Create the test file alongside the source file using the project's naming convention
- Group tests by function/method using `describe` blocks (or equivalent)
- Include any necessary mock setup

## Rules
- Do not test private/internal helpers directly — test through the public interface
- If the file has external dependencies (DB, HTTP, file system), mock them
- Do not modify the source file
- If the file is already fully tested, say so
