
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.info('main.tsx: Starting app initialization');

// Error boundary для всего приложения
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
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Что-то пошло не так</h1>
            <p className="text-gray-600 mb-4">Произошла ошибка при загрузке приложения</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
  console.info('Found root element, creating React root');
  const root = ReactDOM.createRoot(rootElement);
  
  console.info('main.tsx: About to render App component');
  root.render(
    <React.StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
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
