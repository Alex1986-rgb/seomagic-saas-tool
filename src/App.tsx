
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { GlobalErrorBoundary } from './components/ui/error-handler';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Index from './pages/Index';
import Home from './pages/Home';
import About from './pages/About';
import Audit from './pages/Audit';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import PositionPricing from './pages/PositionPricing';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Documentation from './pages/Documentation';
import PositionTracker from './pages/PositionTracker';
import SiteAudit from './pages/SiteAudit';
import ProjectDetails from './pages/ProjectDetails';
import Support from './pages/Support';

// Feature pages
import SiteScanning from './pages/features/SiteScanning';
import AutoFix from './pages/features/AutoFix';
import PositionTrackingFeature from './pages/features/PositionTrackingFeature';
import CompetitorAnalysis from './pages/features/CompetitorAnalysis';
import PerformanceReports from './pages/features/PerformanceReports';
import DataSecurity from './pages/features/DataSecurity';
import CMSIntegration from './pages/features/CMSIntegration';
import SeoAudit from './pages/features/SeoAudit';
import AIOptimization from './pages/features/AIOptimization';
import PositionTracking from './pages/features/PositionTracking';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="seo-market-theme">
        <GlobalErrorBoundary>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/position-pricing" element={<PositionPricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/docs" element={<Documentation />} />
                <Route path="/position-tracker" element={<PositionTracker />} />
                <Route path="/site-audit" element={<SiteAudit />} />
                <Route path="/project-details" element={<ProjectDetails />} />
                
                {/* Feature pages - Russian URLs */}
                <Route path="/features/полное-сканирование-сайта" element={<SiteScanning />} />
                <Route path="/features/автоматическое-исправление" element={<AutoFix />} />
                <Route path="/features/отслеживание-позиций" element={<PositionTrackingFeature />} />
                <Route path="/features/анализ-конкурентов" element={<CompetitorAnalysis />} />
                <Route path="/features/отчеты-производительности" element={<PerformanceReports />} />
                <Route path="/features/безопасность-данных" element={<DataSecurity />} />
                <Route path="/features/интеграция-cms" element={<CMSIntegration />} />
                
                {/* New feature pages - English URLs */}
                <Route path="/features/seo-audit" element={<SeoAudit />} />
                <Route path="/features/ai-optimization" element={<AIOptimization />} />
                <Route path="/features/position-tracking" element={<PositionTracking />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </GlobalErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
