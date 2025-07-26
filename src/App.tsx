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
import Channel from './pages/Channel';
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
import Team from './pages/Team';
import Guides from './pages/Guides';
import Webinars from './pages/Webinars';
import Careers from './pages/Careers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AuditHistory from './pages/AuditHistory';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApiDocs from './pages/ApiDocs';
import Faq from './pages/Faq';
import Partners from './pages/Partners';
import IPInfo from './pages/IPInfo';

// Feature pages
import SiteScanning from './pages/features/SiteScanning';
import MetadataAnalysis from './pages/features/MetadataAnalysis';
import AutoFix from './pages/features/AutoFix';
import PositionTrackingFeature from './pages/features/PositionTrackingFeature';
import CompetitorAnalysis from './pages/features/CompetitorAnalysis';
import PerformanceReports from './pages/features/PerformanceReports';
import DataSecurity from './pages/features/DataSecurity';
import CMSIntegration from './pages/features/CMSIntegration';
import SeoAudit from './pages/features/SeoAudit';
import AIOptimization from './pages/features/AIOptimization';
import PositionTracking from './pages/features/PositionTracking';
import SpeedAnalysis from './pages/features/SpeedAnalysis';
import MobileOptimization from './pages/features/MobileOptimization';
import OptimizationDemo from './pages/OptimizationDemo';
import AllPages from './pages/AllPages';
import SeoOptimizationPage from './pages/SeoOptimizationPage';

// Admin Routes
import AdminRoutes from './routes/AdminRoutes';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  console.log('🚀 App component rendering');
  
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
                  <Route path="/channel" element={<Channel />} />
                  <Route path="/audit" element={<Audit />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/position-pricing" element={<PositionPricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/webinars" element={<Webinars />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/docs" element={<Documentation />} />
                  <Route path="/documentation" element={<Documentation />} />
                  <Route path="/position-tracker" element={<PositionTracker />} />
                  <Route path="/site-audit" element={<SiteAudit />} />
                  <Route path="/project-details" element={<ProjectDetails />} />
                  
                  {/* Feature pages - Russian URLs */}
                  <Route path="/features/полное-сканирование-сайта" element={<SiteScanning />} />
                  <Route path="/features/site-scanning" element={<SiteScanning />} />
                  <Route path="/features/metadata-analysis" element={<MetadataAnalysis />} />
                  <Route path="/features/автоматическое-исправление" element={<AutoFix />} />
                  <Route path="/features/auto-fix" element={<AutoFix />} />
                  <Route path="/features/отслеживание-позиций" element={<PositionTrackingFeature />} />
                  <Route path="/features/анализ-конкурентов" element={<CompetitorAnalysis />} />
                  <Route path="/features/competitor-analysis" element={<CompetitorAnalysis />} />
                  <Route path="/features/отчеты-производительности" element={<PerformanceReports />} />
                  <Route path="/features/performance-reports" element={<PerformanceReports />} />
                  <Route path="/features/безопасность-данных" element={<DataSecurity />} />
                  <Route path="/features/data-security" element={<DataSecurity />} />
                  <Route path="/features/интеграция-cms" element={<CMSIntegration />} />
                  <Route path="/features/cms-integration" element={<CMSIntegration />} />
                  
                  {/* New feature pages - English URLs */}
                  <Route path="/features/seo-audit" element={<SeoAudit />} />
                  <Route path="/features/ai-optimization" element={<AIOptimization />} />
                  <Route path="/features/position-tracking" element={<PositionTracking />} />
                  
                  {/* Speed and Mobile optimization routes */}
                  <Route path="/features/speed-analysis" element={<SpeedAnalysis />} />
                  <Route path="/features/mobile-optimization" element={<MobileOptimization />} />
                  
                  {/* Additional pages */}
                  <Route path="/optimization-demo" element={<OptimizationDemo />} />
                  <Route path="/all-pages" element={<AllPages />} />
                  <Route path="/pages" element={<AllPages />} />
                  <Route path="/seo-optimization" element={<SeoOptimizationPage />} />
                  <Route path="/api-docs" element={<ApiDocs />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/ip-info" element={<IPInfo />} />
                  
                  {/* Client and Admin Dashboard Routes */}
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/audit-history" element={<AuditHistory />} />
                  <Route path="/client-dashboard" element={<ClientDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={<AdminRoutes />} />
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
