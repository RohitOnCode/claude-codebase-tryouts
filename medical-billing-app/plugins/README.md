# Claude Code Plugins

Two experimental Claude Code plugins for this project, each scoped to one half
of the stack:

- **`spring-boot-plugin/`** — helpers for the Spring Boot + JPA + H2 backend
- **`angular-plugin/`** — helpers for the Angular + Tailwind CSS frontend

## What's in each plugin

| Plugin | Skills | Agent |
|---|---|---|
| `spring-boot-plugin` | `maven-helper`, `entity-scaffolder`, `rest-api-scaffolder` | `spring-boot-reviewer` |
| `angular-plugin` | `ng-cli-helper`, `component-scaffolder`, `tailwind-helper` | `angular-reviewer` |

Skills are model-invoked (Claude reaches for them automatically based on
context) and can also be called explicitly via `/plugin-name:skill-name`.
Agents are launched via the `Agent`/Task tool or by asking Claude to review
backend/frontend changes.

## Loading the plugins locally

From the repository root, start Claude Code with one or both plugin directories:

```bash
claude --plugin-dir medical-billing-app/plugins/spring-boot-plugin \
       --plugin-dir medical-billing-app/plugins/angular-plugin
```

Then:

- `/spring-boot-plugin:maven-helper` — Maven build/test/run guidance
- `/spring-boot-plugin:entity-scaffolder` — scaffold a new JPA entity vertical slice
- `/spring-boot-plugin:rest-api-scaffolder` — add a new REST endpoint
- `/angular-plugin:ng-cli-helper` — Angular CLI serve/build/test guidance
- `/angular-plugin:component-scaffolder` — scaffold a new Angular feature
- `/angular-plugin:tailwind-helper` — Tailwind CSS usage and troubleshooting

Reload after editing a skill/agent file with `/reload-plugins`.

## Layout

```
plugins/
├── spring-boot-plugin/
│   ├── .claude-plugin/plugin.json
│   ├── skills/
│   │   ├── maven-helper/SKILL.md
│   │   ├── entity-scaffolder/SKILL.md
│   │   └── rest-api-scaffolder/SKILL.md
│   └── agents/
│       └── spring-boot-reviewer.md
└── angular-plugin/
    ├── .claude-plugin/plugin.json
    ├── skills/
    │   ├── ng-cli-helper/SKILL.md
    │   ├── component-scaffolder/SKILL.md
    │   └── tailwind-helper/SKILL.md
    └── agents/
        └── angular-reviewer.md
```

These are intentionally generic — the scaffolding skills describe *this
project's* conventions (layered Spring Boot architecture, Angular module +
template-driven-forms + Tailwind setup) so they stay useful as the codebase grows,
but nothing in them is specific to medical billing domain logic.
