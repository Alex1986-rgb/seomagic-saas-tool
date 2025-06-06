
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  plugins: [
    react({
      plugins: mode === 'production' ? [
        ['transform-remove-console', { exclude: ['error', 'warn'] }]
      ] : []
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode !== 'production',
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug']
      }
    } : undefined,
    rollupOptions: {
      output: {
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
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            if (id.includes('axios')) {
              return 'vendor-api';
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
          
          if (id.includes('/components/seo-optimization/')) {
            return 'seo-components';
          }
          
          if (id.includes('/services/')) {
            return 'services';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    cssMinify: mode === 'production'
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'framer-motion', 
      'lucide-react',
      '@radix-ui/react-tabs',
      '@radix-ui/react-dialog',
      '@radix-ui/react-toast'
    ],
    exclude: [
      '@supabase/supabase-js',
      '@supabase/postgrest-js',
      '@supabase/realtime-js',
      '@supabase/storage-js',
      '@supabase/gotrue-js',
      '@supabase/functions-js'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  experimental: {
    renderBuiltUrl(filename) {
      return `/${filename}`;
    }
  },
  define: {
    global: 'globalThis',
  }
}));
