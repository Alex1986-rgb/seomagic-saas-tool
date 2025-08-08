
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProviders from './providers/AppProviders';
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
        <div className="min-h-screen flex items-center justify-center" style={{
          background: 'hsl(225, 71%, 5%)',
          color: 'hsl(210, 40%, 98%)'
        }}>
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4" style={{color: 'hsl(0, 84%, 60%)'}}>Что-то пошло не так</h1>
            <p className="mb-4" style={{color: 'hsl(215, 16%, 57%)'}}>Произошла ошибка при загрузке приложения</p>
            <div className="mb-4 p-3 rounded bg-gray-800 text-left text-sm">
              <code style={{color: 'hsl(210, 40%, 98%)'}}>{this.state.error?.message || 'Unknown error'}</code>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 rounded"
              style={{
                background: 'hsl(30, 85%, 50%)',
                color: 'hsl(210, 40%, 98%)'
              }}
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

const rootElement = document.getElementById('root');

if (rootElement) {
  console.info('✅ Found root element, creating React root');
  
  // Скрыть fallback если он есть
  const loadingFallback = document.getElementById('loading-fallback');
  if (loadingFallback) {
    setTimeout(() => {
      loadingFallback.style.opacity = '0';
      setTimeout(() => loadingFallback.remove(), 300);
    }, 100);
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  console.info('🚀 main.tsx: About to render App component');
  root.render(
    <React.StrictMode>
      <AppErrorBoundary>
        <AppProviders>
          <App />
        </AppProviders>
      </AppErrorBoundary>
    </React.StrictMode>
  );
  console.info('✅ main.tsx: App rendered successfully');
  
  // Add timeout to check if app loaded
  setTimeout(() => {
    const appContent = document.querySelector('.App, [data-app="true"], main, [class*="layout"]');
    if (!appContent) {
      console.error('❌ App content not found after 3 seconds!');
      console.log('🔍 Available DOM elements:', document.body.innerHTML.slice(0, 500));
      
      // Show fallback UI if React didn't mount
      rootElement.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: Arial, sans-serif; background: hsl(225, 71%, 5%); color: hsl(210, 40%, 98%);">
          <div style="text-align: center; padding: 2rem;">
            <h1 style="color: hsl(0, 84%, 60%); margin-bottom: 1rem; font-size: 1.5rem;">Ошибка загрузки React</h1>
            <p style="margin-bottom: 2rem; color: hsl(215, 16%, 57%);">Приложение не смогло запуститься.</p>
            <button onclick="window.location.reload()" style="background: hsl(30, 85%, 50%); color: hsl(210, 40%, 98%); border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
              Перезагрузить
            </button>
          </div>
        </div>
      `;
    } else {
      console.info('✅ App content successfully loaded');
    }
  }, 3000);
} else {
  console.error('Root element not found! Unable to mount React application.');
  
  // Fallback HTML if React fails to mount
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui; background: hsl(225, 71%, 5%); color: hsl(210, 40%, 98%);">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem; color: hsl(0, 84%, 60%);">Ошибка загрузки</h1>
        <p style="margin-bottom: 1rem; color: hsl(215, 16%, 57%);">Не удалось найти корневой элемент для React приложения.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: hsl(30, 85%, 50%); color: hsl(210, 40%, 98%); border: none; border-radius: 0.375rem; cursor: pointer;">
          Перезагрузить
        </button>
      </div>
    </div>
  `;
}
