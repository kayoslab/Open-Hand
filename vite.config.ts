import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function spaFallback(): Plugin {
  return {
    name: 'spa-fallback-preview',
    configurePreviewServer(server) {
      return () => {
        server.middlewares.use((_req, res) => {
          const outDir = server.config.build.outDir
          const indexPath = resolve(server.config.root, outDir, 'index.html')
          const html = readFileSync(indexPath, 'utf-8')
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          res.end(html)
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  base: '/',
})
