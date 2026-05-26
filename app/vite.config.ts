/**
 * Build the demo straight from the vendored lexical TypeScript source.
 *
 * The only opt-in required by the `source` export condition (facebook/lexical
 * PR #8554) is listing it first in resolve.conditions: every `lexical` /
 * `@lexical/*` import then resolves to its `src/*.ts(x)` instead of a prebuilt
 * `dist/` artifact. No aliases, and no `define`: the `__DEV__` branches are
 * local `process.env.NODE_ENV` checks Vite substitutes, and lexical-internal's
 * version.ts reads `process.env.LEXICAL_VERSION` inside a try/catch, so it
 * falls back cleanly when `process` is undefined in a browser bundle.
 */
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['source', 'development', 'module', 'browser', 'default'],
  },
});
