---
description: Use when the user wants to reorganize or restructure an Angular component by splitting inline template and styles into separate HTML, CSS/SCSS, and TypeScript files for better separation of concerns.
---

# Command: Angular Organize

Reorganize the Angular component(s) at the given path into separate files: **$ARGUMENTS**

`$ARGUMENTS` can be:
- A single component file (e.g. `src/app/features/dashboard/dashboard.ts`)
- A folder (e.g. `src/app/features/dashboard/`) — all `.ts` component files inside will be processed

## Steps

1. Read the file(s) at the path provided in `$ARGUMENTS`
2. For each Angular component file found:

   **a. Detect what needs splitting:**
   - `template: \`...\`` → extract to `<name>.html`
   - `styles: [\`...\`]` or `styleUrl` already external → extract/keep to `<name>.css` or `<name>.scss`
   - If already using `templateUrl` and `styleUrl`, skip that file and say so

   **b. Extract the template:**
   - Pull the full HTML content out of the inline `template: \`...\`` backtick string
   - Create a new `<component-name>.html` file with that content
   - Update the `@Component` decorator: replace `template: \`...\`` with `templateUrl: './<component-name>.html'`

   **c. Extract the styles:**
   - If `styles: [\`...\`]` exists with actual CSS content, extract it to `<component-name>.css` (or `.scss` if the project uses SCSS)
   - Update the `@Component` decorator: replace `styles: [...]` with `styleUrl: './<component-name>.css'`
   - If there are no inline styles, add `styleUrl: './<component-name>.css'` pointing to an empty file

   **d. Clean up the `.ts` file:**
   - Remove the inline `template` and `styles` properties
   - Add `templateUrl` and `styleUrl` pointing to the new files
   - Keep all imports, class logic, inputs, outputs, and signals exactly as they are
   - Do not change any TypeScript logic

3. Check the project for SCSS vs CSS:
   - If `angular.json` has `"style": "scss"` or existing files use `.scss`, use `.scss` extension
   - Otherwise use `.css`

## Output per component

For a file `src/app/features/dashboard/dashboard.ts`, produce:
```
src/app/features/dashboard/
├── dashboard.ts         ← updated (templateUrl + styleUrl, no inline template/styles)
├── dashboard.html       ← extracted template
└── dashboard.css        ← extracted styles (or empty file if no inline styles)
```

The updated `dashboard.ts` `@Component` decorator should look like:
```typescript
@Component({
  selector: 'app-dashboard',
  imports: [...],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
```

## Rules
- Never change any TypeScript class logic, signals, methods, or imports
- Preserve all whitespace and formatting in the extracted HTML exactly
- If a file already uses `templateUrl`, skip it and report it as already organized
- If `$ARGUMENTS` is a folder, process all `.ts` files that contain `@Component` with inline `template:`
- After all files are processed, print a summary: which files were reorganized and which were skipped
