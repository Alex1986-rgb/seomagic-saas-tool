import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import DefaultSEO from './components/seo/DefaultSEO';
import SkipLink from './components/accessibility/SkipLink';
import { PerformanceDebugger } from './components/debug';
import { LoadingSpinner } from './components/ui/loading';

// Главная — первая страница для большинства посетителей, её грузим сразу.
import Index from './pages/Index';

// Auth guards
import ProtectedRoute from './components/auth/ProtectedRoute';
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

// Pages
const About = lazy(() => import('./pages/About'));
const Channel = lazy(() => import('./pages/Channel'));
const Audit = lazy(() => import('./pages/Audit'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const PositionPricing = lazy(() => import('./pages/PositionPricing'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Documentation = lazy(() => import('./pages/Documentation'));
const PositionTracker = lazy(() => import('./pages/PositionTracker'));
const SiteAudit = lazy(() => import('./pages/SiteAudit'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Support = lazy(() => import('./pages/Support'));
const Team = lazy(() => import('./pages/Team'));
const Guides = lazy(() => import('./pages/Guides'));
const Webinars = lazy(() => import('./pages/Webinars'));
const Careers = lazy(() => import('./pages/Careers'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const AuditHistory = lazy(() => import('./pages/AuditHistory'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));
const Faq = lazy(() => import('./pages/Faq'));
const Partners = lazy(() => import('./pages/Partners'));
const IPInfo = lazy(() => import('./pages/IPInfo'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Demo = lazy(() => import('./pages/Demo'));
const Partnership = lazy(() => import('./pages/Partnership'));
const GuidePost = lazy(() => import('./pages/GuidePost'));
const OptimizationPricing = lazy(() => import('./pages/OptimizationPricing'));
const ClientProfile = lazy(() => import('./pages/ClientProfile'));

// Feature pages
const SiteScanning = lazy(() => import('./pages/features/SiteScanning'));
const MetadataAnalysis = lazy(() => import('./pages/features/MetadataAnalysis'));
const AutoFix = lazy(() => import('./pages/features/AutoFix'));
const CompetitorAnalysis = lazy(() => import('./pages/features/CompetitorAnalysis'));
const PerformanceReports = lazy(() => import('./pages/features/PerformanceReports'));
const DataSecurity = lazy(() => import('./pages/features/DataSecurity'));
const CMSIntegration = lazy(() => import('./pages/features/CMSIntegration'));
const SeoAudit = lazy(() => import('./pages/features/SeoAudit'));
const AIOptimization = lazy(() => import('./pages/features/AIOptimization'));
const PositionTracking = lazy(() => import('./pages/features/PositionTracking'));
const SpeedAnalysis = lazy(() => import('./pages/features/SpeedAnalysis'));
const MobileOptimization = lazy(() => import('./pages/features/MobileOptimization'));
const OptimizationDemo = lazy(() => import('./pages/OptimizationDemo'));
const AllPages = lazy(() => import('./pages/AllPages'));
const SeoOptimizationPage = lazy(() => import('./pages/SeoOptimizationPage'));
const OptimizationTest = lazy(() => import('./pages/OptimizationTest'));
const AuditsHistory = lazy(() => import('./pages/AuditsHistory'));
const OptimizationsHistory = lazy(() => import('./pages/OptimizationsHistory'));
const SharedEstimate = lazy(() => import('./pages/SharedEstimate'));
const Sitemap = lazy(() => import('./pages/Sitemap'));

// Admin Routes: страницы внутри и так грузятся по требованию, а сам раздел
// посетителям сайта не нужен вовсе.
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));

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
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/channel" element={<Channel />} />
                    <Route path="/audit" element={<Audit />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/position-pricing" element={<PositionPricing />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/guides" element={<Guides />} />
                    <Route path="/guides/:id" element={<GuidePost />} />
                    <Route path="/webinars" element={<Webinars />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route path="/docs" element={<Navigate to="/documentation" replace />} />
                    <Route path="/position-tracker" element={<PositionTracker />} />
                    <Route path="/site-audit" element={<SiteAudit />} />
                    {/* Внутренняя страница о состоянии проекта: посетителям сайта не нужна,
                        открыта только администратору. */}
                    <Route path="/project-details" element={<AdminRouteGuard><ProjectDetails /></AdminRouteGuard>} />

                    {/* Feature pages: основные адреса английские, русские переадресуют */}
                    <Route path="/features/site-scanning" element={<SiteScanning />} />
                    <Route path="/features/полное-сканирование-сайта" element={<Navigate to="/features/site-scanning" replace />} />
                    <Route path="/features/metadata-analysis" element={<MetadataAnalysis />} />
                    <Route path="/features/auto-fix" element={<AutoFix />} />
                    <Route path="/features/автоматическое-исправление" element={<Navigate to="/features/auto-fix" replace />} />
                    {/* Отдельная страница по этому адресу дублировала /position-tracking */}
                    <Route path="/features/отслеживание-позиций" element={<Navigate to="/position-tracking" replace />} />
                    <Route path="/features/competitor-analysis" element={<CompetitorAnalysis />} />
                    <Route path="/features/анализ-конкурентов" element={<Navigate to="/features/competitor-analysis" replace />} />
                    <Route path="/features/performance-reports" element={<PerformanceReports />} />
                    <Route path="/features/отчеты-производительности" element={<Navigate to="/features/performance-reports" replace />} />
                    <Route path="/features/data-security" element={<DataSecurity />} />
                    <Route path="/features/безопасность-данных" element={<Navigate to="/features/data-security" replace />} />
                    <Route path="/features/cms-integration" element={<CMSIntegration />} />
                    <Route path="/features/интеграция-cms" element={<Navigate to="/features/cms-integration" replace />} />

                    {/* New feature pages - English URLs */}
                    <Route path="/features/seo-audit" element={<SeoAudit />} />
                    <Route path="/features/ai-optimization" element={<AIOptimization />} />
                    {/* Основной адрес — /position-tracking: на него ведёт пункт «Позиции» в меню */}
                    <Route path="/position-tracking" element={<PositionTracking />} />
                    <Route path="/features/position-tracking" element={<Navigate to="/position-tracking" replace />} />

                    {/* Speed and Mobile optimization routes */}
                    <Route path="/features/speed-analysis" element={<SpeedAnalysis />} />
                    <Route path="/features/mobile-optimization" element={<MobileOptimization />} />

                    {/* Shared estimate page */}
                    <Route path="/shared-estimate/:token" element={<SharedEstimate />} />

                    {/* Additional pages */}
                    <Route path="/optimization-demo" element={<OptimizationDemo />} />
                    <Route path="/optimization-test" element={<OptimizationTest />} />
                    <Route path="/optimizations" element={<ProtectedRoute><OptimizationsHistory /></ProtectedRoute>} />
                    <Route path="/pages" element={<AllPages />} />
                    <Route path="/all-pages" element={<Navigate to="/pages" replace />} />
                    <Route path="/seo-optimization" element={<SeoOptimizationPage />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/ip-info" element={<IPInfo />} />
                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/partnership" element={<Partnership />} />
                    <Route path="/optimization-pricing" element={<OptimizationPricing />} />
                    <Route path="/client-profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />

                    {/* Client account routes (require login) */}
                    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/audit-history" element={<ProtectedRoute><AuditHistory /></ProtectedRoute>} />
                    <Route path="/audits" element={<ProtectedRoute><AuditsHistory /></ProtectedRoute>} />

                    {/* Legacy placeholder dashboards → redirect to the real areas */}
                    <Route path="/client-dashboard" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />

                    {/* Admin Routes (require admin role) */}
                    <Route path="/admin/*" element={<AdminRouteGuard><AdminRoutes /></AdminRouteGuard>} />

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
