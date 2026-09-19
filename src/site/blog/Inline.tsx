import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Строчная разметка статей: **жирный**, `код`, [текст](адрес).
 *
 * Без dangerouslySetInnerHTML: текст статьи — данные, и разбирать его как HTML незачем.
 * Внутренние адреса (с «/») идут через Link — иначе переход перезагружал бы приложение
 * и терял подпуть публикации на GitHub Pages.
 */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

export const Inline: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('`') && part.endsWith('`'))
          return (
            <code key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '.86em', overflowWrap: 'anywhere' }}>
              {part.slice(1, -1)}
            </code>
          );
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const [, label, href] = link;
          return href.startsWith('/') ? (
            <Link key={i} to={href}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

