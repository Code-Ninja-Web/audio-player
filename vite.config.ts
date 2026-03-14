import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return

                    if (
                        id.includes('node_modules/react') ||
                        id.includes('node_modules/react-dom')
                    ) {
                        return 'vendor-react'
                    }

                    if (
                        id.includes('node_modules/grommet') ||
                        id.includes('node_modules/grommet-icons')
                    ) {
                        return 'vendor-grommet'
                    }

                    if (
                        id.includes('node_modules/styled-components') ||
                        id.includes('node_modules/stylis')
                    ) {
                        return 'vendor-styled'
                    }

                    if (id.includes('node_modules/hls.js')) {
                        return 'vendor-hls'
                    }
                },
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTests.ts'],
    },
})
