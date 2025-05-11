
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Audit from './pages/Audit';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import About from './pages/About';
import Auth from './pages/Auth';
import OptimizationDemo from './pages/OptimizationDemo';
import PositionPricing from './pages/PositionPricing';
import OptimizationPricing from './pages/OptimizationPricing';
import SiteAudit from './pages/SiteAudit';
import Index from './pages/Index';
import Home from './pages/Home';
import AdminRoutes from './routes/AdminRoutes';
import AdminPanel from './pages/admin/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/site-audit" element={<SiteAudit />} />
        <Route path="/optimization-demo" element={<OptimizationDemo />} />
        <Route path="/position-pricing" element={<PositionPricing />} />
        <Route path="/optimization-pricing" element={<OptimizationPricing />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
