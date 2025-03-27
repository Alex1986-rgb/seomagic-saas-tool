
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      // Check if user has previously selected a theme
      const savedTheme = localStorage.getItem('theme');
      // Check user's system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        return 'dark';
      }
      
      return 'light';
    }
    
    // Default to light if window is not available (SSR)
    return 'light';
  });

  useEffect(() => {
    // Update the document class when theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a fallback implementation if used outside provider
    return {
      theme: (typeof window !== 'undefined' && 
        (localStorage.getItem('theme') === 'dark' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches)) 
        ? 'dark' : 'light',
      toggleTheme: () => {
        const current = localStorage.getItem('theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
  }
  return context;
}
