import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo.svg'],
            manifest: {
                name: 'Shaxmatchi',
                short_name: 'Shaxmatchi',
                description: 'Chess openings practice and tools',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
                    { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                navigateFallback: '/index.html',
            }
        })
    ],
    build: {
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('firebase')) return 'vendor-firebase';
                        if (id.includes('react-chessboard') || id.includes('chess.js')) return 'vendor-chess';
                        // Avoid grouping react-confetti and react-use together to prevent init order issues
                        // if (id.includes('react-confetti') || id.includes('react-use')) return 'vendor-fun';
                        if (id.includes('react')) return 'vendor-react';
                    }
                    return undefined;
                },
            },
        },
    },
})
