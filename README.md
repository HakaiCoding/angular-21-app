# ANGULAR-21-APP

Angular 21 application scaffolded with Angular CLI (`21.2.7`) and configured with project-level AI skills for Codex.

## Prerequisites

- Node.js (LTS recommended)
- npm (project uses `npm@11.6.2`)

## Setup

```bash
npm install
```

## Development

Start the local dev server:

```bash
npm start
```

App runs at `http://localhost:4200/`.

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Angular CLI

Generate code:

```bash
npx ng generate component my-feature
```

See all generators:

```bash
npx ng generate --help
```

## Project Skills (Codex)

This repo uses project-scoped skills stored in `.agents/skills/` and pinned in `skills-lock.json`.

Restore pinned skills (recommended on fresh clones):

```bash
npm run skills:restore
```

Install/update from source repositories:

```bash
npm run skills:install
```

List installed project skills:

```bash
npm run skills:list
```

Installed skills:

- `angular-best-practices`
- `angular-best-practices-material`
- `angular-best-practices-transloco`
- `angular-component`
- `angular-signals`
- `angular-forms`
- `angular-routing`
- `angular-http`
- `angular-di`
- `angular-directives`
- `caveman-commit`

After skill changes, restart Codex so the updated skills are loaded.
