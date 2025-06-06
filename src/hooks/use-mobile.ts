
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Безопасная проверка на серверной стороне
    if (typeof window === 'undefined') return false;
    
    try {
      return window.matchMedia(query).matches;
    } catch (error) {
      console.warn('MediaQuery not supported:', error);
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let mediaQuery: MediaQueryList;
    
    try {
      mediaQuery = window.matchMedia(query);
    } catch (error) {
      console.warn('MediaQuery not supported:', error);
      return;
    }
    
    // Начальная проверка
    setMatches(mediaQuery.matches);
    
    // Обработчик изменений
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Добавляем слушатель с поддержкой старых браузеров
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(listener);
    }
    
    // Очистка
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

export function useMobile() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  return {
    isMobile,
    isTablet,
    isDesktop
  };
}
