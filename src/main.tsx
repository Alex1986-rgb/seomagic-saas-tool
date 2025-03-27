
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NetworkStatus from './components/NetworkStatus';
import './index.css';

// Функция для добавления предзагрузки внешних ресурсов
const addPreconnectLinks = () => {
  const preconnectLinks = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'dns-prefetch', href: 'https://cdn.gpteng.co' }
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
};

// Добавляем предзагрузку ресурсов
addPreconnectLinks();

// Инициализируем приложение с React 18's createRoot
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
    <NetworkStatus />
  </React.StrictMode>
);

// Регистрируем service worker для лучшего оффлайн-опыта
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
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

// Предзагрузка основных изображений
const preloadImages = () => {
  const imagesToPreload = ['/favicon.svg', '/logo.svg', '/img/video-poster.jpg'];
  
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Вызываем предзагрузку изображений с отложенным выполнением
setTimeout(preloadImages, 1000);
