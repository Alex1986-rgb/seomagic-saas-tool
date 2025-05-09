
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("main.tsx: Starting app initialization");

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
    <App />
  </React.StrictMode>
);

console.log("main.tsx: App rendered");
