
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

export function useMobile() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    // Для обратной совместимости
    ...{ [Symbol.toPrimitive]: () => isMobile }
  };
}
