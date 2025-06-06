
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';

// Импорт страниц
import Index from './pages/Index';
import About from './pages/About';
import Audit from './pages/Audit';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import ProjectDetails from './pages/ProjectDetails';
import SeoElementsPage from './pages/SeoElementsPage';
import KeywordsPage from './pages/KeywordsPage';

// Ленивая загрузка некритичных страниц
const LazyNotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  console.log("App component rendering");
  
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/seo-elements" element={<SeoElementsPage />} />
          <Route path="/keywords" element={<KeywordsPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project-details" element={<ProjectDetails />} />
          <Route path="*" element={
            <React.Suspense fallback={<div>Загрузка...</div>}>
              <LazyNotFound />
            </React.Suspense>
          } />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
