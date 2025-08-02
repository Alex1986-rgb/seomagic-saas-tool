import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple inline components
const Toaster = () => null;
const ThemeProvider = ({ children }: { children: React.ReactNode }) => children;

// Simple Index page
const Index = () => (
  <div className="min-h-screen bg-background text-foreground p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6 text-primary">SEO Market</h1>
      <p className="text-xl text-muted-foreground">
        Добро пожаловать в систему SEO анализа и оптимизации
      </p>
    </div>
  </div>
);

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