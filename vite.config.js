import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Relative base so the build works at any GitHub Pages path
// (https://<user>.github.io/<repo>/) without knowing the repo name.
// Combined with hash-based routing, this avoids SPA 404s on refresh.
export default defineConfig({
  base: './',
  plugins: [svelte()],
  // The full word dataset is bundled on purpose (simpler, no async fetch).
  build: { chunkSizeWarningLimit: 1800 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js', 'scripts/**/*.test.js']
  }
});
