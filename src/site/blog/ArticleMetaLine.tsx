import React from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { formatArticleDate } from './articles';
import type { Article } from './types';

/**
 * Строка «рубрика · минуты · дата» — одинаковая в ленте блога, карусели и шапке статьи.
 * Дата выводится <time>, чтобы её читали и люди, и роботы без разметки.
 */
export const ArticleMetaLine: React.FC<{
  article: Pick<Article, 'category' | 'readMinutes' | 'date'>;
  showDate?: boolean;
  withYear?: boolean;
  style?: React.CSSProperties;
}> = ({ article, showDate = true, withYear = false, style }) => (
  <span
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--space-1) var(--space-4)',
      fontSize: 11.5,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'color-mix(in srgb,var(--color-text) 68%,transparent)',
      ...style,
    }}
  >
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
      <Tag size={14} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
      {article.category}
    </span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
      <Clock size={14} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
      {article.readMinutes} мин
    </span>
    {showDate && (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <Calendar size={14} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
        <time dateTime={article.date}>{formatArticleDate(article.date, withYear)}</time>
      </span>
    )}
  </span>
);
