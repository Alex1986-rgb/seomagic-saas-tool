
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppErrorBoundary } from './components/ErrorBoundary';

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
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);

// Register service worker after app load for faster startup
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Simple registration without background sync to avoid errors
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.error('ServiceWorker registration failed:', err);
      });
  });
}
