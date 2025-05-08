
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Start measuring initial load performance
const startTime = performance.now();

// Add preconnect links for external resources
const preconnectLinks = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
  { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
  { rel: 'preload', href: '/images/placeholder.jpg', as: 'image' }
];

// Add DNS prefetch and preconnect for faster loading
preconnectLinks.forEach(link => {
  const linkEl = document.createElement('link');
  linkEl.rel = link.rel;
  linkEl.href = link.href;
  if (link.crossOrigin) {
    linkEl.crossOrigin = link.crossOrigin;
  }
  if (link.as) {
    linkEl.setAttribute('as', link.as);
  }
  document.head.appendChild(linkEl);
});

// Initialize the app with React 18's createRoot
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Create a custom performance marker
if (window.performance && 'mark' in window.performance) {
  window.performance.mark('react-init-start');
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Mark end of initial render
if (window.performance && 'mark' in window.performance) {
  window.addEventListener('load', () => {
    window.performance.mark('react-init-end');
    
    try {
      // Measure between marks
      window.performance.measure('react-init', 'react-init-start', 'react-init-end');
      
      // Log timing info
      const loadTime = performance.now() - startTime;
      console.log(`App initialized in ${Math.round(loadTime)}ms`);
      
      // Log memory usage if available
      if (performance.memory) {
        console.log('Memory usage:', {
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
        });
      }
    } catch (e) {
      console.error('Error measuring performance:', e);
    }
  });
}

// Register service worker after app load for faster startup
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
        
        // Enable background sync if supported
        if ('sync' in registration) {
          try {
            // TypeScript doesn't know about the sync API by default
            // Using type assertion to tell TypeScript that we know what we're doing
            (registration as any).sync.register('sync-data')
              .catch(err => console.error('Background sync registration failed:', err));
          } catch (err) {
            console.error('Background sync error:', err);
          }
        }
      })
      .catch(err => {
        console.error('ServiceWorker registration failed:', err);
      });
  });
}

// Add performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Report Web Vitals
  const reportWebVitals = () => {
    const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';
    const reportVital = ({ id, name, value }: any) => {
      fetch(vitalsUrl, {
        body: JSON.stringify({
          dsn: '', // Add your analytics DSN here
          id,
          page: window.location.pathname,
          href: window.location.href,
          event_name: name,
          value: Math.round(name === 'CLS' ? value * 1000 : value),
          speed: navigator.connection?.effectiveType || ''
        }),
        method: 'POST',
        keepalive: true
      }).catch(err => {
        console.error('Error reporting web vitals:', err);
      });
    };

    try {
      // We need to import the web-vitals library to use these functions
      // Since they're not imported, we'll comment them out for now
      // If you want to use web-vitals, uncomment this and add the library
      
      /*
      webVitals.getCLS(reportVital);
      webVitals.getFID(reportVital);
      webVitals.getLCP(reportVital);
      webVitals.getFCP(reportVital);
      webVitals.getTTFB(reportVital);
      */
      
      console.log('Web vitals reporting is disabled. Import web-vitals to enable.');
    } catch (err) {
      console.error('Error reporting web vitals:', err);
    }
  };

  reportWebVitals();
}
