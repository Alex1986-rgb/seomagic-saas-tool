
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add preconnect links for external resources
const preconnectLinks = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
];

preconnectLinks.forEach(link => {
  const linkEl = document.createElement('link');
  linkEl.rel = link.rel;
  linkEl.href = link.href;
  if (link.crossOrigin) {
    linkEl.crossOrigin = link.crossOrigin;
  }
  document.head.appendChild(linkEl);
});

// Initialize the app with React 18's createRoot
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for better offline experience
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.error('ServiceWorker registration failed:', err);
      });
  });
}
