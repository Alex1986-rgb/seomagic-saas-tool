
import React, { memo, useCallback } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeSwitcher = memo(function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  const handleSetTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
  }, [setTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Изменить тему"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          <ThemeSwitcherIcon theme={theme} />
          <span className="sr-only">Переключить тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSetTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          <span>Светлая</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          <span>Тёмная</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("system")}>
          <Laptop className="h-4 w-4 mr-2" />
          <span>Системная</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// Отдельный компонент для иконок, чтобы оптимизировать рендеринг
const ThemeSwitcherIcon = memo(function ThemeSwitcherIcon({ theme }: { theme: string }) {
  if (theme === "dark") {
    return <Moon className="h-5 w-5" />;
  }
  
  if (theme === "light") {
    return <Sun className="h-5 w-5" />;
  }
  
  // Для системной темы, проверяем только на клиенте
  if (typeof window !== 'undefined') {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  }
  
  // Дефолт
  return <Sun className="h-5 w-5" />;
});

// Добавляем displayName для отладки
ThemeSwitcherIcon.displayName = 'ThemeSwitcherIcon';

export { ThemeSwitcherIcon };
