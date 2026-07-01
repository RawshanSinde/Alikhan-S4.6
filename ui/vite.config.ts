// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

const backendUrl = 'http://localhost:9002'

export default defineConfig({
  base: '/views/',
    build: {
        outDir: resolve(__dirname, '../src/static/oidc'),
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'consent.html'),
                nested: resolve(__dirname, 'login.html'),
            },
        },
        emptyOutDir: true,
    },
  server:{
      proxy:{
        '/static':{
            target: backendUrl,
            changeOrigin: true,
            secure: false,
        },
        '/views/manifest.json':{
            target: backendUrl,
            changeOrigin: true,
            secure: false,
          rewrite: (path) => path.replace(/^\/views/, ''),
        },
        '/locales.json':{
            target: backendUrl,
            changeOrigin: true,
            secure: false,
          rewrite: (path) => path.replace(/^\/views/, ''),
        },
        '/locales':{
            target: backendUrl,
            changeOrigin: true,
            secure: false,
          rewrite: (path) => path.replace(/^\/views/, ''),
        },
      }
  }
})
