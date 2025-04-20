
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import pages directly instead of using lazy loading to fix the loading issues
import HomePage from '@/pages/Index';
import AuditPage from '@/pages/Audit';
import SiteAudit from '@/pages/SiteAudit';
import AdminPage from '@/pages/AdminPanel';
import SeoOptimizationPage from '@/pages/SeoOptimizationPage';
import BlogPage from '@/pages/Blog';
import BlogPostPage from '@/pages/BlogPost';
import ClientProfile from '@/pages/ClientProfile';
import PositionTracking from '@/pages/PositionTracking';
import Reports from '@/pages/Reports';
import AuditHistory from '@/pages/AuditHistory';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Pricing from '@/pages/Pricing';
import PositionPricing from '@/pages/PositionPricing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Support from '@/pages/Support';
import Contact from '@/pages/Contact';
import Guides from '@/pages/Guides';
import Demo from '@/pages/Demo';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Features from '@/pages/Features';
import Documentation from '@/pages/Documentation';
import NotFound from '@/pages/NotFound';
import GuidePost from '@/pages/GuidePost';
import IPInfo from '@/pages/IPInfo';
import Partnership from '@/pages/Partnership';

// Import the AuthProvider from contexts
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  console.log("App component rendering");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set a short timeout to ensure the app loads properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/site-audit" element={<SiteAudit />} />
            <Route path="/admin/*" element={<AdminPage />} />
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
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
