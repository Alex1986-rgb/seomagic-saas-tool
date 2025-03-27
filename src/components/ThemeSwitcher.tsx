
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// Simple theme detection function that doesn't rely on context
const detectTheme = (): 'dark' | 'light' => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') return 'dark';
  if (savedTheme === 'light') return 'light';
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

// Simple theme toggle function that doesn't rely on context
const toggleThemeManually = (currentTheme: 'light' | 'dark'): 'light' | 'dark' => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Update DOM
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Save to localStorage
  localStorage.setItem('theme', newTheme);
  
  return newTheme;
};

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Initialize theme on mount
    setTheme(detectTheme());
  }, []);
  
  const handleToggle = () => {
    setTheme(toggleThemeManually(theme));
  };

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        checked={isDark}
        onCheckedChange={handleToggle}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export const ThemeSwitcherIcon: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Initialize theme on mount
    setTheme(detectTheme());
  }, []);
  
  const handleToggle = () => {
    setTheme(toggleThemeManually(theme));
  };

  const isDark = theme === 'dark';

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleToggle} 
      className="rounded-full"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};
