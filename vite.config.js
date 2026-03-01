import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            include: ['buffer', 'stream', 'util', 'events', 'http', 'https', 'url'],
            globals: {
                Buffer: true,
            },
        }),
    ],
    define: {
        global: 'globalThis',
    },
});
