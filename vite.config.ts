
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vite не кладёт переменные из .env в process.env, пока разбирается этот
  // файл: VITE_BASE_PATH=/ из .env молча игнорировался, и сборка под свой домен
  // получала подпуть /seomagic-saas-tool/ — ассеты отдавали 404, белый экран.
  // loadEnv читает .env, .env.local, .env.[mode] и переменные командной строки
  // (у командной строки приоритет).
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    // lovable-tagger убран (16.09.2026): в dev он вписывал data-lov-* атрибуты в JSX и на части
    // файлов ломал разбор («Unexpected token `Screen`. Expected jsx identifier») — экраны кабинета
    // не открывались в разработке, хотя прод-сборка проходила. Проект больше не редактируется в Lovable.
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Сайт опубликован на GitHub Pages по адресу с подпутём
    // (/seomagic-saas-tool/). При сборке с корнем «/» страница ищет свои файлы
    // не там и открывается пустой — так живой сайт уже можно было положить одной
    // выкладкой. Свой домен задаётся переменной VITE_BASE_PATH="/".
    base: env.VITE_BASE_PATH || (mode === 'production' ? '/seomagic-saas-tool/' : '/'),
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: mode !== 'production',
      minify: mode === 'production',
      rollupOptions: {
        output: {
          /**
           * Ручное разбиение на части убрано.
           *
           * Правило `id.includes('react')` забирало в «vendor-react» всё, в чьём
           * пути встречается слово react: @radix-ui/react-dialog, react-hook-form,
           * react-helmet-async. Зависимые друг от друга библиотеки оказывались в
           * разных частях, части ссылались друг на друга по кругу («Circular
           * chunk: vendor-other -> vendor-react -> vendor-other» в выводе сборки),
           * и в браузере одна из них исполнялась раньше другой. Итог: собранный
           * сайт открывался пустым с ошибкой «Cannot read properties of undefined
           * (reading 'createContext')». Разбиение оставляем сборщику — он
           * учитывает зависимости и циклов не создаёт.
           */
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react']
    },
  };
});
