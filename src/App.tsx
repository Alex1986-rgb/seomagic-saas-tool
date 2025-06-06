
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { FullscreenLoader } from './components/ui/loading';

// Импорт критичных страниц
import Index from './pages/Index';
import About from './pages/About';
import SeoElementsPage from './pages/SeoElementsPage';
import KeywordsPage from './pages/KeywordsPage';

// Ленивая загрузка некритичных страниц
const LazyAudit = React.lazy(() => import('./pages/Audit'));
const LazyFeatures = React.lazy(() => import('./pages/Features'));
const LazyPricing = React.lazy(() => import('./pages/Pricing'));
const LazyContact = React.lazy(() => import('./pages/Contact'));
const LazyProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const LazyNotFound = React.lazy(() => import('./pages/NotFound'));
const LazyAuth = React.lazy(() => import('./pages/Auth'));
const LazyDashboard = React.lazy(() => import('./pages/Dashboard'));
const LazyClientDashboard = React.lazy(() => import('./pages/ClientDashboard'));
const LazyAdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const LazyProfile = React.lazy(() => import('./pages/Profile'));
const LazyClientProfile = React.lazy(() => import('./pages/ClientProfile'));
const LazyReports = React.lazy(() => import('./pages/Reports'));
const LazyAuditHistory = React.lazy(() => import('./pages/AuditHistory'));
const LazySettings = React.lazy(() => import('./pages/Settings'));
const LazyPositionPricing = React.lazy(() => import('./pages/PositionPricing'));
const LazyPositionTracker = React.lazy(() => import('./pages/PositionTracker'));
const LazyPositionTracking = React.lazy(() => import('./pages/PositionTracking'));
const LazyOptimizationDemo = React.lazy(() => import('./pages/OptimizationDemo'));
const LazyOptimizationPricing = React.lazy(() => import('./pages/OptimizationPricing'));
const LazyGuidePost = React.lazy(() => import('./pages/GuidePost'));
const LazyGuides = React.lazy(() => import('./pages/Guides'));
const LazyIPInfo = React.lazy(() => import('./pages/IPInfo'));
const LazyBlog = React.lazy(() => import('./pages/Blog'));
const LazyBlogPost = React.lazy(() => import('./pages/BlogPost'));
const LazyPartnership = React.lazy(() => import('./pages/Partnership'));
const LazyWebinars = React.lazy(() => import('./pages/Webinars'));
const LazyDemo = React.lazy(() => import('./pages/Demo'));
const LazySeoOptimizationPage = React.lazy(() => import('./pages/SeoOptimizationPage'));
const LazyApiDocs = React.lazy(() => import('./pages/ApiDocs'));
const LazyHome = React.lazy(() => import('./pages/Home'));

function App() {
  console.log("App component rendering");
  
  return (
    <ErrorBoundary showErrorDetails={process.env.NODE_ENV === 'development'}>
      <AppProviders>
        <Router>
          <Routes>
            {/* Критичные страницы - загружаются сразу */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/seo-elements" element={<SeoElementsPage />} />
            <Route path="/keywords" element={<KeywordsPage />} />
            
            {/* Основные функциональные страницы */}
            <Route path="/audit" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка аудита..." />}>
                <LazyAudit />
              </Suspense>
            } />
            <Route path="/features" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка функций..." />}>
                <LazyFeatures />
              </Suspense>
            } />
            <Route path="/pricing" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка тарифов..." />}>
                <LazyPricing />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка контактов..." />}>
                <LazyContact />
              </Suspense>
            } />
            
            {/* Аутентификация и пользовательские страницы */}
            <Route path="/auth" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка авторизации..." />}>
                <LazyAuth />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка панели..." />}>
                <LazyDashboard />
              </Suspense>
            } />
            <Route path="/client-dashboard" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка панели клиента..." />}>
                <LazyClientDashboard />
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка админ панели..." />}>
                <LazyAdminDashboard />
              </Suspense>
            } />
            <Route path="/profile" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка профиля..." />}>
                <LazyProfile />
              </Suspense>
            } />
            <Route path="/client-profile" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка профиля клиента..." />}>
                <LazyClientProfile />
              </Suspense>
            } />
            <Route path="/reports" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка отчетов..." />}>
                <LazyReports />
              </Suspense>
            } />
            <Route path="/audit-history" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка истории..." />}>
                <LazyAuditHistory />
              </Suspense>
            } />
            <Route path="/settings" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка настроек..." />}>
                <LazySettings />
              </Suspense>
            } />
            
            {/* Отслеживание позиций */}
            <Route path="/position-pricing" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка тарифов..." />}>
                <LazyPositionPricing />
              </Suspense>
            } />
            <Route path="/position-tracker" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка трекера..." />}>
                <LazyPositionTracker />
              </Suspense>
            } />
            <Route path="/position-tracking" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка отслеживания..." />}>
                <LazyPositionTracking />
              </Suspense>
            } />
            
            {/* Оптимизация */}
            <Route path="/optimization-demo" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка демо..." />}>
                <LazyOptimizationDemo />
              </Suspense>
            } />
            <Route path="/optimization-pricing" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка тарифов оптимизации..." />}>
                <LazyOptimizationPricing />
              </Suspense>
            } />
            <Route path="/seo-optimization" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка SEO оптимизации..." />}>
                <LazySeoOptimizationPage />
              </Suspense>
            } />
            
            {/* Контент и обучение */}
            <Route path="/guides" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка руководств..." />}>
                <LazyGuides />
              </Suspense>
            } />
            <Route path="/guides/:id" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка руководства..." />}>
                <LazyGuidePost />
              </Suspense>
            } />
            <Route path="/blog" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка блога..." />}>
                <LazyBlog />
              </Suspense>
            } />
            <Route path="/blog/:id" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка статьи..." />}>
                <LazyBlogPost />
              </Suspense>
            } />
            <Route path="/webinars" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка вебинаров..." />}>
                <LazyWebinars />
              </Suspense>
            } />
            <Route path="/demo" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка демо..." />}>
                <LazyDemo />
              </Suspense>
            } />
            
            {/* Дополнительные страницы */}
            <Route path="/partnership" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка партнерства..." />}>
                <LazyPartnership />
              </Suspense>
            } />
            <Route path="/ip-info" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка IP информации..." />}>
                <LazyIPInfo />
              </Suspense>
            } />
            <Route path="/api-docs" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка API документации..." />}>
                <LazyApiDocs />
              </Suspense>
            } />
            <Route path="/project-details" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка деталей проекта..." />}>
                <LazyProjectDetails />
              </Suspense>
            } />
            <Route path="/home" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка..." />}>
                <LazyHome />
              </Suspense>
            } />
            
            {/* 404 страница */}
            <Route path="*" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка..." />}>
                <LazyNotFound />
              </Suspense>
            } />
          </Routes>
        </Router>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
