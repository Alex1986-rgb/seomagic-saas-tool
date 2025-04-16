import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import './App.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Lazy-loaded pages for better performance
const Index = React.lazy(() => import('./pages/Index'));
const About = React.lazy(() => import('./pages/About'));
const Features = React.lazy(() => import('./pages/Features'));
const FeatureDetail = React.lazy(() => import('./pages/features/FeatureDetail'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const PositionPricing = React.lazy(() => import('./pages/PositionPricing'));
const PositionTracker = React.lazy(() => import('./pages/PositionTracker'));
const Demo = React.lazy(() => import('./pages/Demo'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Auth = React.lazy(() => import('./pages/Auth'));
const SiteAudit = React.lazy(() => import('./pages/SiteAudit'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ClientProfile = React.lazy(() => import('./pages/ClientProfile'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Support = React.lazy(() => import('./pages/Support'));
const AuditHistory = React.lazy(() => import('./pages/AuditHistory'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Guides = React.lazy(() => import('./pages/Guides'));
const PositionTracking = React.lazy(() => import('./pages/PositionTracking'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

// Loading fallback for lazy-loaded components
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="w-12 h-12" />
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={
                <Layout>
                  <Outlet />
                </Layout>
              }>
                <Route index element={<Index />} />
                <Route path="about" element={<About />} />
                <Route path="features" element={<Features />} />
                <Route path="features/:featureSlug" element={<FeatureDetail />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="position-pricing" element={<PositionPricing />} />
                <Route path="position-tracker" element={<PositionTracker />} />
                <Route path="demo" element={<Demo />} />
                <Route path="contact" element={<Contact />} />
                <Route path="auth" element={<Auth />} />
                <Route path="audit" element={<SiteAudit />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<ClientProfile />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
                <Route path="audit-history" element={<AuditHistory />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:postId" element={<BlogPost />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="guides" element={<Guides />} />
                <Route path="position-tracking" element={<PositionTracking />} />
                <Route path="admin" element={<AdminPanel />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
