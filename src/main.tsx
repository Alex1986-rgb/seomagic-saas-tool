
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
    { rel: 'dns-prefetch', href: 'https://cdn.gpteng.co' },
    { rel: 'preload', href: '/images/placeholder.jpg', as: 'image' }
  ];

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
};

// Включаем IntersectionObserver polyfill для старых браузеров
const loadIntersectionObserverPolyfill = () => {
  if (!('IntersectionObserver' in window)) {
    import('intersection-observer');
  }
};

// Добавляем предзагрузку ресурсов
addPreconnectLinks();
loadIntersectionObserverPolyfill();

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

// Предзагрузка основных изображений с приоритетом
const preloadCriticalImages = () => {
  const imagesToPreload = ['/favicon.svg', '/logo.svg'];
  
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
    img.importance = 'high';
  });
};

// Отложенная предзагрузка второстепенных изображений
const preloadNonCriticalImages = () => {
  const imagesToPreload = ['/img/video-poster.jpg'];
  
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Вызываем предзагрузку важных изображений сразу
preloadCriticalImages();

// Вызываем предзагрузку второстепенных изображений с отложенным выполнением
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(() => {
    preloadNonCriticalImages();
  });
} else {
  setTimeout(preloadNonCriticalImages, 1000);
}
