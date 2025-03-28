
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from './components/SEO';
import { AppErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { ThemeProvider } from './contexts/ThemeContext';
import Pricing from './pages/Pricing';
import About from './pages/About';
import PositionTracker from './pages/PositionTracker';
import Demo from './pages/Demo';
import Index from './pages/Index';
import ClientProfile from './pages/ClientProfile';
import Auth from './pages/Auth';

// Lazy load non-critical pages for better performance
const SiteAudit = React.lazy(() => import('./pages/SiteAudit'));
const PositionTracking = React.lazy(() => import('./pages/PositionTracking'));
const AuditHistory = React.lazy(() => import('./pages/AuditHistory'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Guides = React.lazy(() => import('./pages/Guides'));
const Support = React.lazy(() => import('./pages/Support'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));

// Feature page import
const FeaturePageTemplate = React.lazy(() => import('./pages/features/FeaturePageTemplate'));

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <AppErrorBoundary>
        <ThemeProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Make sure the Index page is the default route */}
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/audit" element={<Layout><SiteAudit /></Layout>} />
                <Route path="/positions" element={<Layout><PositionTracking /></Layout>} />
                <Route path="/position-tracker" element={<Layout><PositionTracker /></Layout>} />
                <Route path="/history" element={<Layout><AuditHistory /></Layout>} />
                <Route path="/reports" element={<Layout><Reports /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
                <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
                
                {/* Fix duplicate footer/navbar issue for these pages */}
                <Route path="/demo" element={<Demo />} />
                <Route path="/about" element={<About />} />
                
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
                <Route path="/guides" element={<Layout><Guides /></Layout>} />
                <Route path="/support" element={<Layout><Support /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
                <Route path="/terms" element={<Layout><Terms /></Layout>} />
                <Route path="/profile" element={<Layout><ClientProfile /></Layout>} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Feature pages */}
                <Route path="/optimization" element={<Layout><FeaturePageTemplate featureId="optimization" /></Layout>} />
                <Route path="/speed-optimization" element={<Layout><FeaturePageTemplate featureId="speed-optimization" /></Layout>} />
                <Route path="/competitor-analysis" element={<Layout><FeaturePageTemplate featureId="competitor-analysis" /></Layout>} />
                <Route path="/growth-analytics" element={<Layout><FeaturePageTemplate featureId="growth-analytics" /></Layout>} />
                <Route path="/custom-reports" element={<Layout><FeaturePageTemplate featureId="custom-reports" /></Layout>} />
                <Route path="/automated-checks" element={<Layout><FeaturePageTemplate featureId="automated-checks" /></Layout>} />
                <Route path="/markup-validation" element={<Layout><FeaturePageTemplate featureId="markup-validation" /></Layout>} />
                <Route path="/security" element={<Layout><FeaturePageTemplate featureId="security" /></Layout>} />
                <Route path="/recommendations" element={<Layout><FeaturePageTemplate featureId="recommendations" /></Layout>} />
                <Route path="/expert-support" element={<Layout><FeaturePageTemplate featureId="expert-support" /></Layout>} />
                
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
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
