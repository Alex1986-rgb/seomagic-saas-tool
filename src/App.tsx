
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/Index'));
const AuditPage = lazy(() => import('@/pages/Audit'));
const SiteAudit = lazy(() => import('@/pages/SiteAudit'));
const AdminPage = lazy(() => import('@/pages/AdminPanel'));
const SeoOptimizationPage = lazy(() => import('@/pages/SeoOptimizationPage'));
const BlogPage = lazy(() => import('@/pages/Blog'));
const ClientProfile = lazy(() => import('@/pages/ClientProfile'));
const PositionTracking = lazy(() => import('@/pages/PositionTracking'));
const Reports = lazy(() => import('@/pages/Reports'));
const AuditHistory = lazy(() => import('@/pages/AuditHistory'));
const Settings = lazy(() => import('@/pages/Settings'));
const About = lazy(() => import('@/pages/About'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const PositionPricing = lazy(() => import('@/pages/PositionPricing'));

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
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/profile" element={<ClientProfile />} />
            <Route path="/position-tracking" element={<PositionTracking />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit-history" element={<AuditHistory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/position-pricing" element={<PositionPricing />} />
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;
