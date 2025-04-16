
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Index from '@/pages/Index';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Features from '@/pages/Features';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Support from '@/pages/Support';
import Guides from '@/pages/Guides';
import Audit from '@/pages/Audit';
import SiteAudit from '@/pages/SiteAudit';
import PositionTracker from '@/pages/PositionTracker';
import PositionTracking from '@/pages/PositionTracking';
import PositionPricing from '@/pages/PositionPricing';
import AdminPanel from '@/pages/AdminPanel';
import ClientProfile from '@/pages/ClientProfile';
import AuditHistory from '@/pages/AuditHistory';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Demo from '@/pages/Demo';

export const Routes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/support" element={<Support />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/audit" element={<Audit />} />
      <Route path="/site-audit" element={<SiteAudit />} />
      <Route path="/position-tracker" element={<PositionTracker />} />
      <Route path="/position-pricing" element={<PositionPricing />} />
      <Route path="/demo" element={<Demo />} />

      {/* Auth Routes */}
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/position-tracking" element={user ? <PositionTracking /> : <Navigate to="/auth" replace />} />
      <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/auth" replace />} />
      <Route path="/profile" element={user ? <ClientProfile /> : <Navigate to="/auth" replace />} />
      <Route path="/history" element={user ? <AuditHistory /> : <Navigate to="/auth" replace />} />
      <Route path="/reports" element={user ? <Reports /> : <Navigate to="/auth" replace />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" replace />} />
      
      {/* Catch All - 404 */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
