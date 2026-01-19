import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Bind to 0.0.0.0 to allow external connections
    allowedHosts: true, // Allow all hosts (for ngrok, etc.)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure single React instance when using workspace packages
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // Enable minification for smaller bundle sizes
    minify: 'esbuild',
    // Generate source maps for debugging (hidden from browser devtools)
    sourcemap: 'hidden',
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'radix-ui': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
          ],
        },
      },
    },
    // Target modern browsers for smaller output
    target: 'esnext',
    // CSS code splitting
    cssCodeSplit: true,
  },
});
