import { useLayoutEffect, useState } from 'react';
import './industry.css';

/**
 * Дизайн-система Industry: подключение стилей и темы.
 *
 * Общая для кабинета (/app) и публичного сайта. Класс ds-industry и data-theme ставятся на <html>,
 * а не на обёртку: порталы (диалоги, тосты) рендерятся в body. При размонтировании всё снимается —
 * страницы, ещё не переведённые на Industry, не должны унаследовать её токены.
 * useLayoutEffect — чтобы до первой отрисовки не мигнула старая тёмная тема сайта.
 */

export type IndustryTheme = 'light' | 'dark';

export function useIndustryDocument(theme: IndustryTheme) {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.classList.add('ds-industry');
    el.setAttribute('data-theme', theme);
    return () => {
      el.classList.remove('ds-industry');
      el.removeAttribute('data-theme');
    };
  }, [theme]);
}

const THEME_KEY = 'seomarket-cabinet-theme';

function readTheme(): IndustryTheme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* нет хранилища */
  }
  // Первый вход — светлая тема: Industry проектировалась от светлого фона, тёмная — перекрытие.
  return 'light';
}

/** Тема кабинета с переключателем; выбор помнится в браузере. Публичный сайт — всегда светлый, как в макете. */
export function useCabinetTheme() {
  const [theme, setTheme] = useState<IndustryTheme>(readTheme);
  useIndustryDocument(theme);
  const toggle = () =>
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* нет хранилища */
      }
      return next;
    });
  return { theme, toggle };
}
