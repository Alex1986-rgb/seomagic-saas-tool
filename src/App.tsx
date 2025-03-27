
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from './components/SEO';
import { AppErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load non-critical pages for better performance
const SiteAudit = React.lazy(() => import('./pages/SiteAudit'));
const PositionTracking = React.lazy(() => import('./pages/PositionTracking'));
const AuditHistory = React.lazy(() => import('./pages/AuditHistory'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <AppErrorBoundary>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="audit" element={<SiteAudit />} />
                <Route path="positions" element={<PositionTracking />} />
                <Route path="history" element={<AuditHistory />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="admin" element={<AdminPanel />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </AppErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
