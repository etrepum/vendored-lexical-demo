/**
 * Build the demo straight from the vendored lexical TypeScript source.
 *
 * The only opt-in required by the `source` export condition (facebook/lexical
 * PR #8554) is listing it first in resolve.conditions: every `lexical` /
 * `@lexical/*` import then resolves to its `src/*.ts(x)` instead of a prebuilt
 * `dist/` artifact. No aliases needed, and the `__DEV__` branches are local
 * `process.env.NODE_ENV !== 'production'` checks that Vite substitutes for us.
 */
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['source', 'development', 'module', 'browser', 'default'],
  },
});
