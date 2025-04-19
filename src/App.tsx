
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AuthProvider } from '@/contexts/AuthContext';

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
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Support = lazy(() => import('@/pages/Support'));
const Contact = lazy(() => import('@/pages/Contact'));
const Guides = lazy(() => import('@/pages/Guides'));
const Demo = lazy(() => import('@/pages/Demo'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Features = lazy(() => import('@/pages/Features'));
const Documentation = lazy(() => import('@/pages/Documentation'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  console.log("App component rendering");
  
  return (
    <AuthProvider>
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/features" element={<Features />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/documentation/:tab" element={<Documentation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </Router>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
