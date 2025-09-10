import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('firebase')) return 'vendor-firebase';
                        if (id.includes('react-chessboard') || id.includes('chess.js')) return 'vendor-chess';
                        if (id.includes('react-confetti') || id.includes('react-use')) return 'vendor-fun';
                        if (id.includes('react')) return 'vendor-react';
                    }
                    return undefined;
                },
            },
        },
    },
})
