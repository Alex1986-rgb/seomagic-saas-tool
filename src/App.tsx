import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';

// Simple inline components
const Toaster = () => null;
const ThemeProvider = ({ children }: { children: React.ReactNode }) => children;

function App() {
  console.log('🚀 App component rendering');
  
  React.useEffect(() => {
    console.log('✅ App component mounted');
    return () => {
      console.log('❌ App component unmounted');
    };
  }, []);
  
  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-background text-foreground" data-app="true">
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;