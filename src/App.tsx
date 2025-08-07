import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import PositionPricing from './pages/PositionPricing';
import OptimizationPricing from './pages/OptimizationPricing';
import Auth from './pages/Auth';
import ClientProfile from './pages/ClientProfile';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuditHistory from './pages/AuditHistory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import OptimizationDemo from './pages/OptimizationDemo';
import AdminPanel from './pages/admin/AdminPanel';

// Simple inline components
const Toaster = () => null;
const ThemeProvider = ({ children }: { children: React.ReactNode }) => children;

function App() {
  console.log('🚀 App component rendering');
  
  React.useEffect(() => {
    console.log('✅ App component mounted');
    return () => {
      console.log('❌ App component unmounted');
    };
  }, []);
  
  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-background text-foreground" data-app="true">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/position-pricing" element={<PositionPricing />} />
            <Route path="/optimization-pricing" element={<OptimizationPricing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ClientProfile />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/audits" element={<AuditHistory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/optimization-demo" element={<OptimizationDemo />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;