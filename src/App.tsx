import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import DefaultSEO from './components/seo/DefaultSEO';
import SkipLink from './components/accessibility/SkipLink';
import { PerformanceDebugger } from './components/debug';
import { LoadingSpinner } from './components/ui/loading';

// Главная — первая страница для большинства посетителей, её грузим сразу.
// С 16.09.2026 публичный сайт собран по макету design/seomarket-v2 (дизайн-система Industry).
import Landing from './pages/site/Landing';

// Auth guards
import AdminRouteGuard from './components/admin/AdminRouteGuard';

/**
 * Разбиение сайта на части по страницам.
 *
 * Все ~60 страниц, кабинет и админка импортировались сразу, и главная
 * загружала и разбирала один файл почти в 4 МБ — вместе с графиками, генерацией
 * PDF и админкой, которые на главной не нужны. Теперь сразу грузится только
 * главная, остальные страницы подтягиваются при переходе на них.
 *
 * Форма записи «const Имя = lazy(() => import('./pages/…'))» важна: по ней
 * scripts/prerender.cjs находит файл страницы для пререндера. Функция lazy
 * ниже — обёртка над React.lazy, а не импорт из React.
 *
 * Выкладка на GitHub Pages пересоздаёт сайт целиком, и файлы частей прежней
 * сборки исчезают. У того, кто открыл сайт до выкладки, переход на новую
 * страницу падал бы с ошибкой загрузки. Поэтому при такой ошибке страница один
 * раз перезагружается и получает свежую сборку; если и после этого часть не
 * загрузилась, ошибка показывается как есть, без бесконечных перезагрузок.
 */
const CHUNK_RELOAD_KEY = 'seo-market-chunk-reload';

function lazy(factory: () => Promise<{ default: React.ComponentType }>) {
  return React.lazy(() =>
    factory()
      .then((module) => {
        try {
          sessionStorage.removeItem(CHUNK_RELOAD_KEY);
        } catch {
          // Хранилище недоступно (приватный режим) — отметку просто не ведём.
        }
        return module;
      })
      .catch((error: unknown) => {
        let canReload = false;
        try {
          canReload = sessionStorage.getItem(CHUNK_RELOAD_KEY) !== '1';
          if (canReload) sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
        } catch {
          // Без хранилища не перезагружаем: иначе можно уйти в бесконечный цикл.
          canReload = false;
        }
        if (canReload) {
          window.location.reload();
          return new Promise<never>(() => {});
        }
        throw error;
      })
  );
}

// Публичный сайт (Industry)
const BlogIndex = lazy(() => import('./pages/site/BlogIndex'));
const BlogArticle = lazy(() => import('./pages/site/BlogArticle'));
const Reviews = lazy(() => import('./pages/site/Reviews'));
const About = lazy(() => import('./pages/site/About'));
const Contacts = lazy(() => import('./pages/site/Contacts'));
const Offer = lazy(() => import('./pages/site/Offer'));
const Privacy = lazy(() => import('./pages/site/Privacy'));
const Cookie = lazy(() => import('./pages/site/Cookie'));
const Refund = lazy(() => import('./pages/site/Refund'));
const Security = lazy(() => import('./pages/site/Security'));
const SiteMap = lazy(() => import('./pages/site/SiteMap'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Прежние страницы, у которых нет замены в новом сайте и которые ещё нужны
const SiteAudit = lazy(() => import('./pages/SiteAudit'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const SharedEstimateLegacy = lazy(() => import('./pages/SharedEstimate'));

// Admin Routes: страницы внутри и так грузятся по требованию, а сам раздел
// посетителям сайта не нужен вовсе.
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));

// Кабинет 2.0 по макету design/seomarket-v2 — отдельная часть со своей дизайн-системой (Industry),
// её стили и шрифты грузятся только при входе на /app.
const CabinetRoutes = lazy(() => import('./cabinet/CabinetRoutes'));

const PageFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Загрузка страницы">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="seo-market-theme">
      {/* Тот же подпуть, что и у сборки: иначе переходы внутри сайта ведут
          мимо приложения. */}
      <Router basename={import.meta.env.BASE_URL}>
        <SkipLink />
        <div className="App min-h-screen bg-background text-foreground" data-app="true">
          <DefaultSEO />
          <main id="main-content" role="main">
            <Suspense fallback={<PageFallback />}>
            {/*
              У одной страницы должен быть один адрес. Пары /docs и
              /documentation, /all-pages и /pages, русские и английские адреса
              /features/*, /position-tracking, /features/position-tracking и
              /features/отслеживание-позиций отдавали одно и то же, и каждая
              копия ставила canonical на себя — поисковик видел дубли title и
              description. Основной адрес — тот,
              на который ведут ссылки сайта, остальные переадресуют на него.
            */}
            <Routes>
                    {/* Публичный сайт по макету. Каждая страница — свой адрес и свой PageSeo. */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/:slug" element={<BlogArticle />} />
                    <Route path="/otzyvy" element={<Reviews />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contacts />} />
                    <Route path="/oferta" element={<Offer />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookie" element={<Cookie />} />
                    <Route path="/vozvrat" element={<Refund />} />
                    <Route path="/bezopasnost" element={<Security />} />
                    <Route path="/sitemap" element={<SiteMap />} />

                    {/* Кабинет 2.0: вход и защита — внутри CabinetRoutes */}
                    <Route path="/app/*" element={<CabinetRoutes />} />

                    {/* Бесплатная проверка без входа — прежний экран, пока лендинг не запускает аудит сам */}
                    <Route path="/site-audit" element={<SiteAudit />} />
                    {/* Ссылки из уже отправленных писем со сметой */}
                    <Route path="/shared-estimate/:token" element={<SharedEstimateLegacy />} />
                    {/* Внутренняя страница о состоянии проекта: открыта только администратору. */}
                    <Route path="/project-details" element={<AdminRouteGuard><ProjectDetails /></AdminRouteGuard>} />
                    <Route path="/admin/*" element={<AdminRouteGuard><AdminRoutes /></AdminRouteGuard>} />

                    {/*
                      Переадресации со страниц прежнего сайта (16.09.2026). У них были внешние ссылки и
                      место в поиске, поэтому адреса не бросаем в 404, а ведём на ближайший раздел нового
                      сайта. Страницы тарифов и подписок удалены по сути: подписок у сервиса нет.
                    */}
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/reviews" element={<Navigate to="/otzyvy" replace />} />
                    <Route path="/terms" element={<Navigate to="/oferta" replace />} />
                    <Route path="/pricing" element={<Navigate to="/#ceny" replace />} />
                    <Route path="/position-pricing" element={<Navigate to="/#ceny" replace />} />
                    <Route path="/optimization-pricing" element={<Navigate to="/#ceny" replace />} />
                    <Route path="/faq" element={<Navigate to="/#faq" replace />} />
                    <Route path="/features" element={<Navigate to="/#proverki" replace />} />
                    <Route path="/features/*" element={<Navigate to="/#proverki" replace />} />
                    <Route path="/position-tracking" element={<Navigate to="/#uslugi" replace />} />
                    <Route path="/demo" element={<Navigate to="/#kak" replace />} />
                    <Route path="/optimization-demo" element={<Navigate to="/#kak" replace />} />
                    <Route path="/webinars" element={<Navigate to="/blog" replace />} />
                    <Route path="/guides" element={<Navigate to="/blog" replace />} />
                    <Route path="/guides/*" element={<Navigate to="/blog" replace />} />
                    <Route path="/team" element={<Navigate to="/about" replace />} />
                    <Route path="/careers" element={<Navigate to="/about" replace />} />
                    <Route path="/partners" element={<Navigate to="/about" replace />} />
                    <Route path="/partnership" element={<Navigate to="/about" replace />} />
                    <Route path="/channel" element={<Navigate to="/about" replace />} />
                    <Route path="/documentation" element={<Navigate to="/about" replace />} />
                    <Route path="/docs" element={<Navigate to="/about" replace />} />
                    <Route path="/api-docs" element={<Navigate to="/about" replace />} />
                    <Route path="/support" element={<Navigate to="/contact" replace />} />
                    <Route path="/pages" element={<Navigate to="/sitemap" replace />} />
                    <Route path="/all-pages" element={<Navigate to="/sitemap" replace />} />
                    <Route path="/ip-info" element={<Navigate to="/bezopasnost" replace />} />

                    {/* Прежний кабинет → кабинет 2.0 */}
                    <Route path="/auth" element={<Navigate to="/app/login" replace />} />
                    <Route path="/dashboard" element={<Navigate to="/app" replace />} />
                    <Route path="/client-dashboard" element={<Navigate to="/app" replace />} />
                    <Route path="/profile" element={<Navigate to="/app/settings" replace />} />
                    <Route path="/client-profile" element={<Navigate to="/app/settings" replace />} />
                    <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
                    <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
                    <Route path="/audit-history" element={<Navigate to="/app/history" replace />} />
                    <Route path="/audits" element={<Navigate to="/app/history" replace />} />
                    <Route path="/audit" element={<Navigate to="/app/audit" replace />} />
                    <Route path="/optimizations" element={<Navigate to="/app/optimize" replace />} />
                    <Route path="/seo-optimization" element={<Navigate to="/app/optimize" replace />} />
                    <Route path="/optimization-test" element={<Navigate to="/app/optimize" replace />} />
                    <Route path="/position-tracker" element={<Navigate to="/app/positions" replace />} />
                    <Route path="/admin-dashboard" element={<Navigate to="/app/admin" replace />} />

                    {/* 404 - Must be last */}
                    <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </main>
          <Toaster />
          <PerformanceDebugger />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
