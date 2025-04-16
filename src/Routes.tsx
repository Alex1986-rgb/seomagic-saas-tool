
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Audit from '@/pages/Audit';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Reports from '@/pages/Reports';
import PositionTracker from '@/pages/PositionTracker';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import AdminPanel from '@/pages/AdminPanel';
import ClientProfile from '@/pages/ClientProfile';
import SiteAudit from '@/pages/SiteAudit';
import PositionPricing from '@/pages/PositionPricing';
import Settings from '@/pages/Settings';
import Demo from '@/pages/Demo';
import Guides from '@/pages/Guides';
import AuditHistory from '@/pages/AuditHistory';
import Blog from '@/pages/Blog';
import Support from '@/pages/Support';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';

export const Routes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <RouterRoutes>
      {/* Auth routes */}
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/auth" replace />} />
      <Route path="/client-profile" element={user ? <ClientProfile /> : <Navigate to="/auth" replace />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" replace />} />
      <Route path="/reports" element={user ? <Reports /> : <Navigate to="/auth" replace />} />
      <Route path="/audit-history" element={user ? <AuditHistory /> : <Navigate to="/auth" replace />} />
      
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/audit" element={<Audit />} />
      <Route path="/site-audit" element={<SiteAudit />} />
      <Route path="/position-tracker" element={<PositionTracker />} />
      <Route path="/position-pricing" element={<PositionPricing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/support" element={<Support />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
