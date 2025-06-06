
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import App from './App';

console.info('main.tsx: Starting app initialization');

const queryClient = new QueryClient();
const rootElement = document.getElementById('root');

if (rootElement) {
  console.info('Found root element, creating React root');
  const root = ReactDOM.createRoot(rootElement);
  
  console.info('main.tsx: About to render App component');
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
  console.info('main.tsx: App rendered successfully');
} else {
  console.error('Root element not found! Unable to mount React application.');
}
