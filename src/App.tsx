
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { FullscreenLoader } from './components/ui/loading';
import AdminLayout from './layouts/AdminLayout';

// Импорт критичных страниц
import Index from './pages/Index';
import About from './pages/About';
import Audit from './pages/Audit';

// Админ страницы
import AdminDashboard from './pages/admin/AdminDashboard';

// Ленивая загрузка некритичных страниц
const LazyFeatures = React.lazy(() => import('./pages/Features'));
const LazyPricing = React.lazy(() => import('./pages/Pricing'));
const LazyContact = React.lazy(() => import('./pages/Contact'));
const LazyProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const LazyNotFound = React.lazy(() => import('./pages/NotFound'));
const LazySeoElementsPage = React.lazy(() => import('./pages/SeoElementsPage'));
const LazyKeywordsPage = React.lazy(() => import('./pages/KeywordsPage'));

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
            <Route path="/audit" element={<Audit />} />
            
            {/* Админ-панель */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
            
            {/* Некритичные страницы - ленивая загрузка */}
            <Route path="/seo-elements" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка оптимизации..." />}>
                <LazySeoElementsPage />
              </Suspense>
            } />
            <Route path="/keywords" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка ключевых слов..." />}>
                <LazyKeywordsPage />
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
            <Route path="/project-details" element={
              <Suspense fallback={<FullscreenLoader text="Загрузка деталей..." />}>
                <LazyProjectDetails />
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
