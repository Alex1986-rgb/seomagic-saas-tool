
import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { GlobalErrorBoundary } from '@/components/ui/error-handler';
import { FullscreenLoader } from '@/components/ui/loading';
import AppProviders from './providers/AppProviders';
import { createLazyComponent } from '@/components/shared/performance/LazyLoadWrapper';

// Eager load critical pages
const HomePage = React.lazy(() => import('@/pages/Index'));
const AuditPage = React.lazy(() => import('@/pages/Audit'));

// Lazy load remaining pages with better naming
const SiteAudit = createLazyComponent(() => import('@/pages/SiteAudit'), 'SiteAudit');
const SeoOptimizationPage = createLazyComponent(() => import('@/pages/SeoOptimizationPage'), 'SeoOptimizationPage');
const BlogPage = createLazyComponent(() => import('@/pages/Blog'), 'BlogPage');
const BlogPostPage = createLazyComponent(() => import('@/pages/BlogPost'), 'BlogPostPage');
const ClientProfile = createLazyComponent(() => import('@/pages/ClientProfile'), 'ClientProfile');
const PositionTracking = createLazyComponent(() => import('@/pages/PositionTracking'), 'PositionTracking');
const Reports = createLazyComponent(() => import('@/pages/Reports'), 'Reports');
const AuditHistory = createLazyComponent(() => import('@/pages/AuditHistory'), 'AuditHistory');
const Settings = createLazyComponent(() => import('@/pages/Settings'), 'Settings');
const About = createLazyComponent(() => import('@/pages/About'), 'About');
const Pricing = createLazyComponent(() => import('@/pages/Pricing'), 'Pricing');
const PositionPricing = createLazyComponent(() => import('@/pages/PositionPricing'), 'PositionPricing');
const Auth = createLazyComponent(() => import('@/pages/Auth'), 'Auth');
const Dashboard = createLazyComponent(() => import('@/pages/Dashboard'), 'Dashboard');
const Support = createLazyComponent(() => import('@/pages/Support'), 'Support');
const Contact = createLazyComponent(() => import('@/pages/Contact'), 'Contact');
const Guides = createLazyComponent(() => import('@/pages/Guides'), 'Guides');
const Demo = createLazyComponent(() => import('@/pages/Demo'), 'Demo');
const Privacy = createLazyComponent(() => import('@/pages/Privacy'), 'Privacy');
const Terms = createLazyComponent(() => import('@/pages/Terms'), 'Terms');
const Features = createLazyComponent(() => import('@/pages/Features'), 'Features');
const Documentation = createLazyComponent(() => import('@/pages/Documentation'), 'Documentation');
const NotFound = createLazyComponent(() => import('@/pages/NotFound'), 'NotFound');
const GuidePost = createLazyComponent(() => import('@/pages/GuidePost'), 'GuidePost');
const IPInfo = createLazyComponent(() => import('@/pages/IPInfo'), 'IPInfo');
const Partnership = createLazyComponent(() => import('@/pages/Partnership'), 'Partnership');

// Lazy load admin routes
const AdminRoutes = createLazyComponent(() => import('@/routes/AdminRoutes'), 'AdminRoutes');

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Preload critical resources
    const preloadResources = async () => {
      // Preload critical route components in parallel
      const criticalRoutes = Promise.all([
        import('@/pages/Index'),
        import('@/pages/Audit')
      ]);
      
      // Start preloading but don't wait for it
      criticalRoutes.catch(err => {
        console.warn('Failed to preload some routes:', err);
      });
      
      // Set a timeout to ensure we don't block the UI for too long
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    };
    
    preloadResources();
    
    // Register performance monitoring
    if ('performance' in window && 'measure' in window.performance) {
      window.addEventListener('load', () => {
        // Measure time to interactive
        const tti = performance.now();
        console.log('Time to interactive:', tti);
        
        // Report to analytics if needed
        if (window.performance && 'getEntriesByType' in window.performance) {
          const paintMetrics = window.performance.getEntriesByType('paint');
          console.log('Paint metrics:', paintMetrics);
        }
      });
    }
  }, []);
  
  if (isLoading) {
    return <FullscreenLoader text="Запуск приложения..." />;
  }
  
  return (
    <AppProviders>
      <Routes>
        {/* Critical routes - highest priority */}
        <Route path="/" element={
          <Suspense fallback={<FullscreenLoader />}>
            <HomePage />
          </Suspense>
        } />
        
        <Route path="/audit" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AuditPage />
          </Suspense>
        } />
        
        {/* Audit related routes */}
        <Route path="/site-audit" element={<SiteAudit />} />
        <Route path="/seo-optimization" element={<SeoOptimizationPage />} />
        <Route path="/audit-history" element={<AuditHistory />} />
        
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
    </AppProviders>
  );
}

export default App;
