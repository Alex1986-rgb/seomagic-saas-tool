
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
import Demo from './pages/Demo';
import Documentation from './pages/Documentation';
import Features from './pages/Features';
import PositionTracking from './pages/PositionTracking';
import AllPages from './pages/AllPages';
import Channel from './pages/Channel';

// Import pages
import Webinars from './pages/Webinars';
import Guides from './pages/Guides';
import ApiDocs from './pages/ApiDocs';
import Faq from './pages/Faq';
import Team from './pages/Team';
import Careers from './pages/Careers';
import Partners from './pages/Partners';
import NotFound from './pages/NotFound';

// Client dashboard pages
import Dashboard from './pages/Dashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClientProfile from './pages/ClientProfile';
import Reports from './pages/Reports';
import AuditHistory from './pages/AuditHistory';
import Settings from './pages/Settings';

const App: React.FC = () => {
  console.log('App component rendering - starting application');
  console.log('Setting up routes and navigation');
  
  return (
    <Router>
      <div className="App">
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
          <Route path="/site-audit" element={<SiteAudit />} />
          <Route path="/optimization-demo" element={<OptimizationDemo />} />
          <Route path="/position-pricing" element={<PositionPricing />} />
          <Route path="/optimization-pricing" element={<OptimizationPricing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/documentation/:tab" element={<Documentation />} />
          <Route path="/features" element={<Features />} />
          <Route path="/position-tracking" element={<PositionTracking />} />
          <Route path="/pages" element={<AllPages />} />
          <Route path="/channel" element={<Channel />} />
          
          {/* Dashboard and client pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit-history" element={<AuditHistory />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Content pages */}
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/team" element={<Team />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/partners" element={<Partners />} />
          
          {/* Admin routes - handles all paths starting with /admin */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* 404 page for any undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
