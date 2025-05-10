
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { setupQueryErrorHandler } from './lib/react-query-error-handler';

console.log("main.tsx: Starting app initialization");

// Create a new QueryClient with error handling
const queryClient = new QueryClient();
setupQueryErrorHandler(queryClient);

// Make sure we have our DOM element
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount app!");
} else {
  console.log("Found root element, creating React root");
}

const root = ReactDOM.createRoot(rootElement!);

console.log("main.tsx: About to render App component");

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

console.log("main.tsx: App rendered");
