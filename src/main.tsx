
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("main.tsx: Starting app initialization");

const root = ReactDOM.createRoot(document.getElementById('root')!);

console.log("main.tsx: Rendering App");

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("main.tsx: App rendered");
