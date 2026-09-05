import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites from /<repo-name>/, so the production
  // build needs that prefix. Local dev keeps the root path.
  base: process.env.GITHUB_ACTIONS ? '/fantasy-football-tarot/' : '/',
})
