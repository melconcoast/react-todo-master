import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for production debugging
    sourcemap: true,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          vendor: ['react', 'react-dom'],
          // Separate UI libraries
          ui: ['lucide-react', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
    // Target modern browsers for better optimization
    target: 'esnext',
    // Minify the build
    minify: 'terser',
    // Set chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
  // Base URL for deployment - different for GitHub Pages vs Netlify
  base: process.env.GITHUB_PAGES === 'true' ? '/react-todo-master/' : '/',
})