
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
    if (mediaQuery.addListener && !mediaQuery.addEventListener) {
      mediaQuery.addListener(listener);
    } else {
      mediaQuery.addEventListener('change', listener);
    }
    
    // Очистка
    return () => {
      if (mediaQuery.removeListener && !mediaQuery.removeEventListener) {
        mediaQuery.removeListener(listener);
      } else {
        mediaQuery.removeEventListener('change', listener);
      }
    };
  }, [query]);

  return matches;
}

export function useMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

// Для обратной совместимости
export const useIsTablet = () => useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
