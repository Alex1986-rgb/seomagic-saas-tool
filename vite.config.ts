
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable chunk splitting for better caching
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000, // Increase warning limit for chunks
    sourcemap: mode !== 'production',
    minify: mode === 'production',
    rollupOptions: {
      output: {
        // Split code chunks by features
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide') || id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('date-fns') || id.includes('recharts')) {
              return 'vendor-data';
            }
            return 'vendor-other';
          }
          
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
          
          if (id.includes('/components/admin/')) {
            return 'admin-components';
          }
          
          if (id.includes('/pages/admin/')) {
            return 'admin-pages';
          }
          
          if (id.includes('/components/audit/')) {
            return 'audit-components';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react']
  },
}));
