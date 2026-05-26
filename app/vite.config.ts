/**
 * Build the demo straight from the vendored lexical TypeScript source.
 *
 * The only opt-in required by the `source` export condition (facebook/lexical
 * PR #8554) is listing it first in resolve.conditions: every `lexical` /
 * `@lexical/*` import then resolves to its `src/*.ts(x)` instead of a prebuilt
 * `dist/` artifact. No aliases needed, and the `__DEV__` branches are local
 * `process.env.NODE_ENV !== 'production'` checks that Vite substitutes for us.
 */
import {createRequire} from 'node:module';

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

const require = createRequire(import.meta.url);
const {version} = require('../vendor/lexical/packages/lexical/package.json');

export default defineConfig({
  define: {
    // lexical-internal/src/version.ts reads `process.env.LEXICAL_VERSION`, but
    // `process` is undefined in the browser. The prod build happens to rewrite
    // `process.env` to `{}` (so the `?? '…+source'` fallback wins), but the dev
    // server does NOT — without this define `pnpm dev` throws "process is not
    // defined" at module load. Statically replacing it is what lexical's own
    // Rollup build does; we mirror that so dev and prod behave identically.
    'process.env.LEXICAL_VERSION': JSON.stringify(`${version}+source`),
  },
  plugins: [react()],
  resolve: {
    conditions: ['source', 'development', 'module', 'browser', 'default'],
  },
});
