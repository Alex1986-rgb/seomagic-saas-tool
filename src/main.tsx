
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';

console.info('main.tsx: Starting app initialization');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById('root');

if (rootElement) {
  console.info('Found root element, creating React root');
  const root = ReactDOM.createRoot(rootElement);
  
  console.info('main.tsx: About to render App component');
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
  console.info('main.tsx: App rendered successfully');
} else {
  console.error('Root element not found! Unable to mount React application.');
  
  // Fallback HTML если React не смог запуститься
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui; background: white;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #1f2937;">Ошибка загрузки</h1>
        <p style="margin-bottom: 1rem; color: #6b7280;">Не удалось загрузить приложение</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Перезагрузить
        </button>
      </div>
    </div>
  `;
}
