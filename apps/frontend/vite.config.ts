import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        allowedHosts: ['polar.net'],
    },
    optimizeDeps: {
        // Include internal packages in dependency optimization
        include: [
            '@polar/api',
            '@polar/types',
            '@polar/utils',
            '@polar/services',
            '@polar/media',
            '@polar/algorithm',
        ],
    },
    // Vite automatically transpiles TypeScript files from node_modules
    // when they are imported, so no additional configuration is needed
    // for internal packages to work
})
