
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from './components/SEO';
import { AppErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { ThemeProvider } from './contexts/ThemeContext';

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
        <ThemeProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Layout><Dashboard /></Layout>} />
                <Route path="dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="audit" element={<Layout><SiteAudit /></Layout>} />
                <Route path="positions" element={<Layout><PositionTracking /></Layout>} />
                <Route path="history" element={<Layout><AuditHistory /></Layout>} />
                <Route path="reports" element={<Layout><Reports /></Layout>} />
                <Route path="settings" element={<Layout><Settings /></Layout>} />
                <Route path="admin" element={<Layout><AdminPanel /></Layout>} />
              </Routes>
            </Suspense>
          </Router>
          <Toaster />
        </ThemeProvider>
      </AppErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
