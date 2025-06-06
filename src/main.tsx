
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import App from './App';

console.info('main.tsx: Starting app initialization');

// Error boundary for the entire app
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Что-то пошло не так</h1>
            <p className="text-muted-foreground mb-4">Произошла ошибка при загрузке приложения</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
      <AppErrorBoundary>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </AppErrorBoundary>
    </React.StrictMode>
  );
  console.info('main.tsx: App rendered');
} else {
  console.error('Root element not found! Unable to mount React application.');
  
  // Fallback HTML if React fails to mount
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
      <div style="text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">Ошибка загрузки</h1>
        <p style="margin-bottom: 1rem;">Не удалось загрузить приложение</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Перезагрузить
        </button>
      </div>
    </div>
  `;
}
