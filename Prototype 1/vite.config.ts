import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Custom domains (including Cloudflare Pages) serve from `/`.
  // The GitHub Pages workflow opts into the repository subpath explicitly.
  base: process.env.GITHUB_PAGES === 'true' ? '/sirosiu-website/' : '/',
  plugins: [react()],
})
