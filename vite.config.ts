import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPages ? '/StudyNova/' : '/',
  plugins: [react(), tailwindcss()],
})
