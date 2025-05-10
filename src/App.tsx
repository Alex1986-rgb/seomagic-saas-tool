
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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SiteAudit />} />
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
      </Routes>
    </Router>
  );
};

export default App;
