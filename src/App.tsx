
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Audit from './pages/Audit';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Auth from './pages/Auth';
import OptimizationDemo from './pages/OptimizationDemo';
import PositionPricing from './pages/PositionPricing';
import OptimizationPricing from './pages/OptimizationPricing';
import SiteAudit from './pages/SiteAudit';
import Index from './pages/Index';
import Home from './pages/Home';
import AdminRoutes from './routes/AdminRoutes';
import AdminDashboard from './pages/AdminDashboard';
import Demo from './pages/Demo';
import Documentation from './pages/Documentation';
import Features from './pages/Features';
import PositionTracking from './pages/PositionTracking';
import AllPages from './pages/AllPages';
import Channel from './pages/Channel';
import FeatureDetail from './pages/features/FeatureDetail';
import Profile from './pages/Profile';
import ProjectDetails from './pages/ProjectDetails';
import Brandbook from './pages/Brandbook';

// Feature articles imports
import SiteScanning from './pages/features/SiteScanning';
import MetadataAnalysis from './pages/features/MetadataAnalysis';
import SpeedAnalysis from './pages/features/SpeedAnalysis';
import MobileOptimization from './pages/features/MobileOptimization';
import PositionTrackingFeature from './pages/features/PositionTrackingFeature';
import CompetitorAnalysis from './pages/features/CompetitorAnalysis';
import AutoFix from './pages/features/AutoFix';
import DataSecurity from './pages/features/DataSecurity';
import CMSIntegration from './pages/features/CMSIntegration';
import PerformanceReports from './pages/features/PerformanceReports';

// Import pages
import Webinars from './pages/Webinars';
import Guides from './pages/Guides';
import ApiDocs from './pages/ApiDocs';
import Faq from './pages/Faq';
import Team from './pages/Team';
import Careers from './pages/Careers';
import Partners from './pages/Partners';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  console.log('App component rendering');
  
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/site-audit" element={<SiteAudit />} />
          <Route path="/optimization-demo" element={<OptimizationDemo />} />
          <Route path="/position-pricing" element={<PositionPricing />} />
          <Route path="/optimization-pricing" element={<OptimizationPricing />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/documentation/:tab" element={<Documentation />} />
          <Route path="/features" element={<Features />} />
          <Route path="/features/:featureId" element={<FeatureDetail />} />
          <Route path="/position-tracking" element={<PositionTracking />} />
          <Route path="/pages" element={<AllPages />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/project-details" element={<ProjectDetails />} />
          <Route path="/brandbook" element={<Brandbook />} />
          
          {/* Feature articles */}
          <Route path="/features/site-scanning" element={<SiteScanning />} />
          <Route path="/features/metadata-analysis" element={<MetadataAnalysis />} />
          <Route path="/features/speed-analysis" element={<SpeedAnalysis />} />
          <Route path="/features/mobile-optimization" element={<MobileOptimization />} />
          <Route path="/features/position-tracking-feature" element={<PositionTrackingFeature />} />
          <Route path="/features/competitor-analysis" element={<CompetitorAnalysis />} />
          <Route path="/features/auto-fix" element={<AutoFix />} />
          <Route path="/features/security" element={<DataSecurity />} />
          <Route path="/features/cms-integration" element={<CMSIntegration />} />
          <Route path="/features/performance-reports" element={<PerformanceReports />} />
          
          {/* Content pages */}
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/team" element={<Team />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/support" element={<Support />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* 404 page for any undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
