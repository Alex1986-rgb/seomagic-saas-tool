import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import DefaultSEO from './components/seo/DefaultSEO';
import SkipLink from './components/accessibility/SkipLink';
import { PerformanceDebugger } from './components/debug';
import DemoModeBanner from './components/shared/DemoModeBanner';

// Pages
const Index = lazy(() => import('./pages/Index'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Channel = lazy(() => import('./pages/Channel'));
const Audit = lazy(() => import('./pages/Audit'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const PositionPricing = lazy(() => import('./pages/PositionPricing'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Documentation = lazy(() => import('./pages/Documentation'));
const PositionTracker = lazy(() => import('./pages/PositionTracker'));
const SiteAudit = lazy(() => import('./pages/SiteAudit'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Support = lazy(() => import('./pages/Support'));
const Team = lazy(() => import('./pages/Team'));
const Guides = lazy(() => import('./pages/Guides'));
const Webinars = lazy(() => import('./pages/Webinars'));
const Careers = lazy(() => import('./pages/Careers'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const AuditHistory = lazy(() => import('./pages/AuditHistory'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));
const Faq = lazy(() => import('./pages/Faq'));
const Partners = lazy(() => import('./pages/Partners'));
const IPInfo = lazy(() => import('./pages/IPInfo'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Demo = lazy(() => import('./pages/Demo'));
const Partnership = lazy(() => import('./pages/Partnership'));
const GuidePost = lazy(() => import('./pages/GuidePost'));
const OptimizationPricing = lazy(() => import('./pages/OptimizationPricing'));
const Checkout = lazy(() => import('./pages/Checkout'));
const BigSiteAudit = lazy(() => import('./pages/BigSiteAudit'));
const SeoText = lazy(() => import('./pages/SeoText'));
const ClientProfile = lazy(() => import('./pages/ClientProfile'));
// Feature pages
const SiteScanning = lazy(() => import('./pages/features/SiteScanning'));
const MetadataAnalysis = lazy(() => import('./pages/features/MetadataAnalysis'));
const AutoFix = lazy(() => import('./pages/features/AutoFix'));
const PositionTrackingFeature = lazy(() => import('./pages/features/PositionTrackingFeature'));
const CompetitorAnalysis = lazy(() => import('./pages/features/CompetitorAnalysis'));
const PerformanceReports = lazy(() => import('./pages/features/PerformanceReports'));
const DataSecurity = lazy(() => import('./pages/features/DataSecurity'));
const CMSIntegration = lazy(() => import('./pages/features/CMSIntegration'));
const SeoAudit = lazy(() => import('./pages/features/SeoAudit'));
const AIOptimization = lazy(() => import('./pages/features/AIOptimization'));
const PositionTracking = lazy(() => import('./pages/features/PositionTracking'));
const SpeedAnalysis = lazy(() => import('./pages/features/SpeedAnalysis'));
const MobileOptimization = lazy(() => import('./pages/features/MobileOptimization'));
const OptimizationDemo = lazy(() => import('./pages/OptimizationDemo'));
const AllPages = lazy(() => import('./pages/AllPages'));
const SeoOptimizationPage = lazy(() => import('./pages/SeoOptimizationPage'));
const OptimizationTest = lazy(() => import('./pages/OptimizationTest'));
const AuditsHistory = lazy(() => import('./pages/AuditsHistory'));
const OptimizationsHistory = lazy(() => import('./pages/OptimizationsHistory'));
const SharedEstimate = lazy(() => import('./pages/SharedEstimate'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
// Admin Routes
import AdminRoutes from './routes/AdminRoutes';



function App() {
  console.log('🚀 App component rendering');
  
  // Add debug logging to detect issues
  React.useEffect(() => {
    console.log('✅ App component mounted');
    console.log('📊 Current theme:', document.documentElement.classList.toString());
    console.log('🎨 CSS Variables test:', {
      background: getComputedStyle(document.documentElement).getPropertyValue('--background'),
      foreground: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
      primary: getComputedStyle(document.documentElement).getPropertyValue('--primary')
    });
    
    return () => {
      console.log('❌ App component unmounted');
    };
  }, []);
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="seo-market-theme">
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <SkipLink />
        <div className="App min-h-screen bg-background text-foreground" data-app="true">
          <DefaultSEO />
          <main id="main-content" role="main">
            <Suspense fallback={<div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Загрузка…</div>}>
            <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/channel" element={<Channel />} />
                    <Route path="/audit" element={<Audit />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/big-audit" element={<BigSiteAudit />} />
                    <Route path="/seo-text" element={<SeoText />} />
                    <Route path="/position-pricing" element={<PositionPricing />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/guides" element={<Guides />} />
                    <Route path="/guides/:id" element={<GuidePost />} />
                    <Route path="/webinars" element={<Webinars />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
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
                    <Route path="/position-tracking" element={<PositionTracking />} />
                    
                    {/* Speed and Mobile optimization routes */}
                    <Route path="/features/speed-analysis" element={<SpeedAnalysis />} />
                    <Route path="/features/mobile-optimization" element={<MobileOptimization />} />
                    
                    {/* Shared estimate page */}
                    <Route path="/shared-estimate/:token" element={<SharedEstimate />} />
                    
                    {/* Additional pages */}
                    <Route path="/optimization-demo" element={<OptimizationDemo />} />
                    <Route path="/optimization-test" element={<OptimizationTest />} />
                    <Route path="/optimizations" element={<OptimizationsHistory />} />
                    <Route path="/all-pages" element={<AllPages />} />
                    <Route path="/pages" element={<AllPages />} />
                    <Route path="/seo-optimization" element={<SeoOptimizationPage />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/ip-info" element={<IPInfo />} />
                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/partnership" element={<Partnership />} />
                    <Route path="/optimization-pricing" element={<OptimizationPricing />} />
                    <Route path="/client-profile" element={<ClientProfile />} />
                    
                    {/* Client and Admin Dashboard Routes */}
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/audit-history" element={<AuditHistory />} />
                    <Route path="/audits" element={<AuditsHistory />} />
                    <Route path="/client-dashboard" element={<ClientDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<AdminRoutes />} />
                    
                    {/* 404 - Must be last */}
                    <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </main>
          <Toaster />
          <DemoModeBanner />
          <PerformanceDebugger />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
