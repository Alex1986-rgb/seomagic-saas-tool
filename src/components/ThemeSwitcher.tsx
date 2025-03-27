
import React, { memo } from "react";
import { Moon, Sun } from "lucide-react";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ThemeSwitcherIcon theme={theme} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className="h-4 w-4 mr-2">🖥️</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// Separate the icon component to optimize rendering
const ThemeSwitcherIcon = memo(function ThemeSwitcherIcon({ theme }: { theme: string }) {
  if (theme === "dark") {
    return <Moon className="h-5 w-5" />;
  }
  
  if (theme === "light") {
    return <Sun className="h-5 w-5" />;
  }
  
  // For system theme, check client-side only
  if (typeof window !== 'undefined') {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  }
  
  // Default fallback
  return <Sun className="h-5 w-5" />;
});

export { ThemeSwitcherIcon };
