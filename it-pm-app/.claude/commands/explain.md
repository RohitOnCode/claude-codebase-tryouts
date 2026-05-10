---
description: Explain what a file, function, or piece of code does in plain English — its purpose, how it works, and how it fits into the broader system. Works with any programming language.
---

# Command: Explain Code

Explain the file or code provided: **$ARGUMENTS**

## Steps

1. Read the file at the path provided in `$ARGUMENTS`
   - If `$ARGUMENTS` specifies a function name or line range (e.g. `src/service.ts:calculateTotal`), focus on that specific part
   - If only a file path is given, explain the whole file

2. Explore the surrounding context:
   - Check what imports/dependencies the file uses
   - Check what other files import or call this file
   - Understand where it fits in the overall architecture

3. Produce a structured explanation:

### What it does
One paragraph describing the overall purpose of the file or function — what problem it solves, what role it plays in the system.

### How it works
Step-by-step walkthrough of the key logic:
- What inputs it takes and where they come from
- The main processing steps in plain English
- What it produces or what side effects it causes
- Any important conditions or branching logic

### Key concepts
Explain any domain-specific terms, patterns, or non-obvious decisions in the code (e.g. "This uses the Strategy pattern to...", "The reason it does X before Y is...").

### How to use it
A short example showing how to call or use this code correctly, including what to watch out for.

### Dependencies & relationships
- What it depends on (services, libraries, config)
- What depends on it (who calls it)

## Rules
- Use plain English — avoid jargon unless you define it
- Tailor the depth to the complexity of the code — a 5-line utility needs one paragraph, not five sections
- If `$ARGUMENTS` is missing, ask the user which file or function to explain
- Do not modify any files — this is a read-only command
