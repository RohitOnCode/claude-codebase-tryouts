---
description: Add clear, useful documentation to a file — function docs, parameter descriptions, and inline comments for non-obvious logic. Works with any programming language.
---

# Command: Document File

Add documentation to the file provided: **$ARGUMENTS**

## Steps

1. Read the file at the path provided in `$ARGUMENTS`
2. Identify what needs documentation:
   - Public functions, methods, and classes that lack doc comments
   - Complex or non-obvious logic that needs explanation
   - Parameters whose purpose or valid values aren't clear
   - Return values and what they represent
   - Error conditions or exceptions that can be thrown

3. Add documentation following the language's native convention:
   - **JavaScript/TypeScript** → JSDoc (`/** */`)
   - **Java** → Javadoc (`/** */`)
   - **Python** → Docstrings (`"""..."""`)
   - **Go** → GoDoc comments (`// FunctionName ...`)
   - **C#** → XML doc comments (`/// <summary>`)
   - **Other languages** → Use the standard doc format for that language

4. Add inline comments only where the **why** is non-obvious — never comment what the code clearly does

## Rules
- Document the **why** and **intent**, not the **what** — the code already shows what it does
- Do not add comments like `// increment counter` above `count++`
- Do not add documentation to private helpers that are self-explanatory
- Keep doc comments concise — one clear sentence is better than a paragraph
- Do not change any logic or behavior — only add documentation
- If the file is already well-documented, say so and skip

## Example (TypeScript)

```typescript
/**
 * Calculates the total price including applicable discounts and tax.
 * Discounts are applied before tax.
 *
 * @param items - List of cart items with unit price and quantity
 * @param discountRate - Fractional discount (0.0 to 1.0), e.g. 0.1 for 10% off
 * @param taxRate - Fractional tax rate (0.0 to 1.0), e.g. 0.08 for 8% tax
 * @returns Final price rounded to 2 decimal places
 */
function calculateTotal(items: CartItem[], discountRate: number, taxRate: number): number {
```
