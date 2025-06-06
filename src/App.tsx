
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AppErrorBoundary } from './components/ErrorBoundary';
import NetworkStatus from './components/NetworkStatus';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Team from './pages/Team';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import FeaturePageTemplate from './pages/features/FeaturePageTemplate';
import ArticlePage from './pages/articles/ArticlePage';
import Audit from './pages/Audit';
import PositionTracker from './pages/PositionTracker';
import PositionPricing from './pages/PositionPricing';
import Guides from './pages/Guides';
import Demo from './pages/Demo';
import Documentation from './pages/Documentation';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <AppErrorBoundary>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <Router>
              <div className="App">
                <NetworkStatus />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/features/:featureId" element={<FeaturePageTemplate />} />
                  <Route path="/articles/:slug" element={<ArticlePage />} />
                  <Route path="/audit" element={<Audit />} />
                  <Route path="/position-tracker" element={<PositionTracker />} />
                  <Route path="/position-pricing" element={<PositionPricing />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/documentation" element={<Documentation />} />
                </Routes>
                <Toaster 
                  position="top-right" 
                  toastOptions={{
                    style: {
                      background: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                  }}
                />
              </div>
            </Router>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </AppErrorBoundary>
  );
}

export default App;
