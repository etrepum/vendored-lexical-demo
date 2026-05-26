# vendored-lexical-demo

A small **pnpm + Vite + React** rich-text demo that builds [Lexical](https://lexical.dev)
**from its TypeScript source** instead of from prebuilt npm packages. The lexical
monorepo is vendored into [`vendor/lexical/`](vendor/lexical) with `git subtree`,
and the demo resolves `lexical` / `@lexical/*` to that source via the `source`
export condition — so you can modify Lexical locally and instantly see the result.

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

```bash
pnpm build      # production build straight from source -> app/dist
pnpm preview    # serve the production build
```

## How it works

Two pieces combine:

1. **`git subtree` vendoring.** The full lexical source lives under
   `vendor/lexical/`, brought in as a squashed subtree of
   [`etrepum/lexical@claude/kind-johnson-RexEG`](https://github.com/etrepum/lexical/tree/claude/kind-johnson-RexEG)
   (the branch from [facebook/lexical#8554](https://github.com/facebook/lexical/pull/8554)).
   It behaves like a normal directory — no submodule init, no separate clone.

2. **The `source` export condition.** PR #8554 adds a `source` entry to every
   lexical package's `exports`, pointing at `./src/index.ts`. The demo opts in
   with one line in [`app/vite.config.ts`](app/vite.config.ts):

   ```ts
   resolve: { conditions: ['source', 'development', 'module', 'browser', 'default'] }
   ```

   The lexical packages are also pnpm workspace members
   ([`pnpm-workspace.yaml`](pnpm-workspace.yaml)), so their internal
   `workspace:*` dependencies resolve against the vendored source too — no
   bundler aliases required.

## Making local modifications to Lexical

Edit any file under `vendor/lexical/packages/*/src/` and the change flows into
the demo on the next dev reload / build. To sync with upstream later:

```bash
pnpm lexical:pull   # git subtree pull --squash from the lexical branch
```

See [`AGENTS.md`](AGENTS.md) for the full subtree workflow (remote setup,
pull/push) and workspace details.

## Credits

The demo UI is adapted from lexical's own `examples/react-rich`. Lexical is
MIT-licensed by Meta; see `vendor/lexical/LICENSE`.
