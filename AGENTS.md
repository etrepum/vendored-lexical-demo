# AGENTS.md

## What this repo is

A minimal pnpm + Vite + React demo that builds [Lexical](https://lexical.dev)
**directly from its TypeScript source**, which is vendored into this repo with
`git subtree`. There is no `pnpm add lexical` step pulling prebuilt packages
from npm — the editor you see running is compiled from the `.ts(x)` files under
`vendor/lexical/`, so you can edit Lexical itself and see the change in the demo.

## Layout

```
.
├── app/                 # the Vite + React rich-text demo (workspace package "lexical-source-demo")
├── vendor/lexical/      # git subtree: the lexical monorepo source (DO read, MAY edit — see below)
├── pnpm-workspace.yaml  # app + vendor/lexical/packages/* are one workspace
└── package.json         # root scripts (dev/build/typecheck/lexical:pull)
```

## The vendored lexical subtree

`vendor/lexical/` is a `git subtree` of:

- remote: `https://github.com/etrepum/lexical.git`
- branch: `claude/kind-johnson-RexEG` (the branch from facebook/lexical PR #8554,
  which adds the `source` export condition that makes source-mode builds work)

Unlike the read-only "vendor source for context" pattern, **here the vendored
source is part of the build**, so local modifications under `vendor/lexical/`
are intentional and supported. Edit a `.ts(x)` there and `pnpm dev`/`pnpm build`
will pick it up with no rebuild of lexical required.

### How the source-mode build works

Every lexical `package.json` exports a `source` condition, e.g.:

```jsonc
"exports": { ".": { "source": "./src/index.ts", "import": { /* dist */ } } }
```

`app/vite.config.ts` opts in with `resolve.conditions: ['source', ...]`, so
`import {createEditor} from 'lexical'` resolves to
`vendor/lexical/packages/lexical/src/index.ts`. Because the lexical packages are
also workspace members (see `pnpm-workspace.yaml`), their internal
`"workspace:*"` deps resolve against the vendored siblings — no aliases.

### Updating from / contributing back to upstream

```bash
# pull newer upstream commits into vendor/lexical (squashed)
pnpm lexical:pull
# equivalently:
git subtree pull --prefix vendor/lexical lexical-upstream claude/kind-johnson-RexEG --squash

# push local vendor/lexical changes back to a branch on the lexical remote
git subtree push --prefix vendor/lexical lexical-upstream <your-branch>
```

The `lexical-upstream` remote is created with:
`git remote add lexical-upstream https://github.com/etrepum/lexical.git`

## Workspace / install notes

- `node-linker=hoisted` (`.npmrc`) — mirrors lexical's own setting and keeps a
  single hoisted React/lexical instance, avoiding duplicate-React context bugs.
- Three heavy leaf apps (`lexical-website`, `lexical-playground`,
  `lexical-devtools`) are vendored on disk but **excluded** from the workspace
  in `pnpm-workspace.yaml` — nothing else depends on them and they pull in
  docusaurus / wxt / the full playground toolchain. Re-add a glob line to use one.

## Commands

```bash
pnpm install        # install workspace deps
pnpm dev            # run the demo (Vite dev server, source mode)
pnpm build          # production build, straight from lexical source
pnpm preview        # serve the production build
pnpm tsc            # type-check the demo against the resolved lexical source
```

## Editor / type-checking notes

`tsc` and editors resolve `lexical` / `@lexical/*` to the vendored `src/` via
`customConditions: ["source"]` in `app/tsconfig.json` (the same `source`
condition Vite uses) — there is deliberately **no** `paths`/alias to `vendor/`.
This needs TypeScript >= 5.0; `.vscode/settings.json` points the editor at the
workspace TypeScript so VS Code's language server honors the condition. If a
freshly-opened editor reports "Cannot find module 'lexical'", reload/restart the
TS server (and accept the "use workspace TypeScript version" prompt).
