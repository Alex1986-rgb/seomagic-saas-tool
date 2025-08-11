
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
      console.error('❌ App content not found after 2 seconds!');
      console.log('🔍 Available DOM elements:', document.body.innerHTML.slice(0, 500));

      // Inject visible safety overlay to help users recover
      const existing = document.getElementById('app-fallback-overlay');
      if (!existing) {
        const overlay = document.createElement('div');
        overlay.id = 'app-fallback-overlay';
        overlay.setAttribute('role', 'alert');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.zIndex = '9999';
        overlay.style.background = '#0b1020'; // dark navy
        overlay.style.color = '#f8fafc'; // near white
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.padding = '24px';
        overlay.innerHTML = `
          <div style="max-width: 720px; width: 100%; text-align: center;">
            <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">Что-то пошло не так</h1>
            <p style="opacity: 0.8; margin-bottom: 16px;">Интерфейс не загрузился корректно. Попробуйте перезагрузить страницу.</p>
            <button id="app-fallback-reload" style="padding: 10px 16px; border-radius: 8px; border: 1px solid #94a3b8; background: transparent; color: inherit; cursor: pointer;">Перезагрузить</button>
          </div>
        `;
        document.body.appendChild(overlay);
        const btn = document.getElementById('app-fallback-reload');
        btn?.addEventListener('click', () => window.location.reload());
      }
    } else {
      console.info('✅ App content successfully loaded');
    }
  }, 2000);
} else {
  console.error('Root element not found! Unable to mount React application.');
  
  // Fallback HTML if React fails to mount
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
