
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import PerformanceMonitor from './components/shared/performance/PerformanceMonitor';

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
root.render(
  <React.StrictMode>
    <PerformanceMonitor />
    <App />
  </React.StrictMode>
);

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
            (registration as any).sync.register('sync-data');
          } catch (err) {
            console.error('Background sync registration failed:', err);
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
  // Логирование производительности приложения
  const logPerformance = () => {
    setTimeout(() => {
      console.info('App initialized in ' + performance.now() + 'ms');
      
      // Безопасная проверка наличия memory API
      const memoryInfo = performance && 
                       'memory' in performance && 
                       (performance as any).memory ? {
        totalJSHeapSize: ((performance as any).memory.totalJSHeapSize / (1024 * 1024)).toFixed(0) + ' MB',
        usedJSHeapSize: ((performance as any).memory.usedJSHeapSize / (1024 * 1024)).toFixed(0) + ' MB'
      } : {};
      
      console.info('Memory usage:', memoryInfo);
      
      // Метрики отрисовки
      const paintMetrics = performance.getEntriesByType('paint');
      console.info('Paint metrics:', paintMetrics);
      
      // Time to Interactive (приблизительно)
      console.info('Time to interactive:', performance.now());
    }, 1000);
  };

  window.addEventListener('load', logPerformance);
}
