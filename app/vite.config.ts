import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

// Interface version shown in Settings: package.json version, plus the commit
// when the build passes one (APP_COMMIT, set by the Docker build argument).
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))
const commit = process.env.APP_COMMIT

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        __APP_VERSION__: JSON.stringify(commit ? `${version} (${commit})` : version),
    },
    base: "./",
    server: {
        proxy: {
            '/api': {
                target: process.env.VACUULA_API ?? 'http://localhost:8050',
                changeOrigin: true,
            },
        },
    },
})
