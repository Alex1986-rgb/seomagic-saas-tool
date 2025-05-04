
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/Index'));
const AuditPage = React.lazy(() => import('@/pages/Audit'));
const SiteAudit = React.lazy(() => import('@/pages/SiteAudit'));
const SeoOptimizationPage = React.lazy(() => import('@/pages/SeoOptimizationPage'));
const BlogPage = React.lazy(() => import('@/pages/Blog'));
const BlogPostPage = React.lazy(() => import('@/pages/BlogPost'));
const ClientProfile = React.lazy(() => import('@/pages/ClientProfile'));
const PositionTracking = React.lazy(() => import('@/pages/PositionTracking'));
const Reports = React.lazy(() => import('@/pages/Reports'));
const AuditHistory = React.lazy(() => import('@/pages/AuditHistory'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const About = React.lazy(() => import('@/pages/About'));
const Pricing = React.lazy(() => import('@/pages/Pricing'));
const PositionPricing = React.lazy(() => import('@/pages/PositionPricing'));
const Auth = React.lazy(() => import('@/pages/Auth'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Support = React.lazy(() => import('@/pages/Support'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Guides = React.lazy(() => import('@/pages/Guides'));
const Demo = React.lazy(() => import('@/pages/Demo'));
const Privacy = React.lazy(() => import('@/pages/Privacy'));
const Terms = React.lazy(() => import('@/pages/Terms'));
const Features = React.lazy(() => import('@/pages/Features'));
const Documentation = React.lazy(() => import('@/pages/Documentation'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const GuidePost = React.lazy(() => import('@/pages/GuidePost'));
const IPInfo = React.lazy(() => import('@/pages/IPInfo'));
const Partnership = React.lazy(() => import('@/pages/Partnership'));

// Lazy load admin routes
const AdminRoutes = React.lazy(() => import('@/routes/AdminRoutes'));

// Import the AuthProvider from contexts
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Preload critical resources
    const preloadResources = async () => {
      // Add any critical resources preloading here
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300); // Reduced from 500ms to 300ms for faster initial load
      
      return () => clearTimeout(timer);
    };
    
    preloadResources();
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/site-audit" element={<SiteAudit />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="/seo-optimization" element={<SeoOptimizationPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
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
              <Route path="/guides/:id" element={<GuidePost />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/features" element={<Features />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/documentation/:tab" element={<Documentation />} />
              <Route path="/ip-info" element={<IPInfo />} />
              <Route path="/partnership" element={<Partnership />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Suspense>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
