
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/Home'));
const AuditPage = lazy(() => import('@/pages/Audit'));
const SiteAudit = lazy(() => import('@/pages/SiteAudit'));
const AdminPage = lazy(() => import('@/pages/Admin'));
const SeoOptimizationPage = lazy(() => import('@/pages/SeoOptimizationPage'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/site-audit" element={<SiteAudit />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/seo-optimization" element={<SeoOptimizationPage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;
