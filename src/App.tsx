
import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { GlobalErrorBoundary } from '@/components/ui/error-handler';
import { FullscreenLoader } from '@/components/ui/loading';
import AppProviders from './providers/AppProviders';

// Directly import the main page to avoid potential issues with lazy loading
import HomePage from '@/pages/Index';

// Lazy load other pages
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
const OptimizationDemo = React.lazy(() => import('@/pages/OptimizationDemo'));

// Lazy load admin routes
const AdminRoutes = React.lazy(() => import('@/routes/AdminRoutes'));

const FallbackErrorComponent = () => (
  <div className="p-6 text-center">
    <h1 className="text-xl text-red-500 mb-4">Произошла критическая ошибка в приложении</h1>
    <p className="mb-4">Пожалуйста, обновите страницу</p>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Обновить страницу
    </button>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Shorter timeout for faster initial load
    const timer = setTimeout(() => {
      console.log("Initial loading complete");
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <FullscreenLoader text="Запуск приложения..." />;
  }
  
  return (
    <BrowserRouter>
      <AppProviders>
        <GlobalErrorBoundary fallback={<FallbackErrorComponent />}>
          <Suspense fallback={<FullscreenLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              {/* Group routes by section for better code-splitting */}
              {/* Audit related routes */}
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/site-audit" element={<SiteAudit />} />
              <Route path="/seo-optimization" element={<SeoOptimizationPage />} />
              <Route path="/audit-history" element={<AuditHistory />} />
              <Route path="/optimization-demo" element={<OptimizationDemo />} />
              
              {/* Content related routes */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/:id" element={<GuidePost />} />
              <Route path="/features" element={<Features />} />
              
              {/* User account related routes */}
              <Route path="/profile" element={<ClientProfile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Position tracking related routes */}
              <Route path="/position-tracking" element={<PositionTracking />} />
              <Route path="/position-pricing" element={<PositionPricing />} />
              <Route path="/reports" element={<Reports />} />
              
              {/* Information pages */}
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/documentation/:tab" element={<Documentation />} />
              <Route path="/ip-info" element={<IPInfo />} />
              <Route path="/partnership" element={<Partnership />} />
              
              {/* Admin section - completely separate bundle */}
              <Route path="/admin/*" element={<AdminRoutes />} />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </GlobalErrorBoundary>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
