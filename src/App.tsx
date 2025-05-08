
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { FullscreenLoader } from '@/components/ui/loading';
import { createLazyComponent } from '@/components/shared/performance/LazyLoadWrapper';

// Import lazily loaded pages
const HomePage = createLazyComponent(() => import('./pages/Home.tsx'), 'HomePage');
const SiteAudit = createLazyComponent(() => import('./pages/SiteAudit'), 'SiteAudit');
const SeoAuditPage = createLazyComponent(() => import('./pages/SeoAuditPage'), 'SeoAuditPage');
const Dashboard = createLazyComponent(() => import('./pages/Dashboard'), 'Dashboard');
const Settings = createLazyComponent(() => import('./pages/Settings'), 'Settings');
const NotFound = createLazyComponent(() => import('./pages/NotFound'), 'NotFound');
const Documentation = createLazyComponent(() => import('./pages/Documentation'), 'Documentation');

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Suspense fallback={<FullscreenLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/audit" element={<SiteAudit />} />
            <Route path="/seo-audit" element={<SeoAuditPage />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/docs/*" element={<Documentation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
