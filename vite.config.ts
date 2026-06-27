
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
  // Для деплоя на GitHub Pages (проектный сайт) приложение живёт по под-пути
  // /seomagic-saas-tool/. Включается переменной GITHUB_PAGES=true при сборке.
  // Обычные сборки (и продакшен на корне домена) остаются на "/".
  base: process.env.GITHUB_PAGES === "true" ? "/seomagic-saas-tool/" : "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode !== 'production',
    minify: mode === 'production',
    rollupOptions: {
      output: {
        // Все зависимости из node_modules — в один vendor-чанк.
        // Раздельные vendor-чанки (react / ui / other) ломали порядок
        // инициализации: код из vendor-other обращался к React.createContext
        // раньше, чем загружался react-чанк → рантайм-ошибка в проде.
        // Единый vendor-чанк гарантирует, что React доступен своим потребителям.
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react']
  },
}));
