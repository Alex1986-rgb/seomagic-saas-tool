
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from '@/components/SEO';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import AuditPage from '@/pages/AuditPage';
import SeoAuditPage from '@/components/seo-audit/SeoAuditPage';
import AdminPage from '@/pages/AdminPage';
import PositionTrackerPage from '@/pages/PositionTrackerPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/seo-audit" element={<SeoAuditPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/position-tracker" element={<PositionTrackerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
