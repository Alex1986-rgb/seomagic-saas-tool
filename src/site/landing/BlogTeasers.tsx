import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Tag } from 'lucide-react';
import type { ArticleMeta } from '@/site/blog/types';
import articlesMeta from '@/site/blog/articles-meta.json';
import { Corners, MUTED, SECTION, SectionHead } from './parts';

/**
 * «Разбираем, как это работает» — шесть анонсов блога.
 *
 * Карточки берутся из src/site/blog/articles-meta.json — общих метаданных статей, которые читают
 * страница статьи, пререндер и главная. Своих заголовков и лидов здесь нет: переименовали статью
 * в блоге — анонс на главной поменялся сам, а ссылка /blog/<slug> не разойдётся со статьёй.
 * Время чтения не показываем: оно считается по тексту статьи, а в метаданных его нет.
 *
 * Порядок — от «что такое аудит» к деньгам: так анонсы повторяют путь клиента по главной.
 */

const PICK = ['chto-delaem', 'dubli', 'uskorenie-sajta', 'indeks', 'perelinkovka', 'cena'];

const ALL = articlesMeta as ArticleMeta[];
const bySlug = new Map(ALL.map((a) => [a.slug, a]));
const picked = PICK.map((s) => bySlug.get(s)).filter((a): a is ArticleMeta => Boolean(a));
// Если какую-то статью переименовали — добираем до шести из остальных, а не показываем дыру.
const POSTS = [...picked, ...ALL.filter((a) => !PICK.includes(a.slug))].slice(0, 6);

function dateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
}

export const BlogTeasers: React.FC = () => (
  <section id="blog" style={SECTION}>
    <SectionHead
      eyebrow="07 · Блог"
      title="Разбираем, как это работает"
      titleMargin="0 0 32px"
      aside={
        <Link to="/blog" style={{ fontSize: 13 }}>
          Все статьи →
        </Link>
      }
    />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(290px,100%),1fr))',
        gap: 'clamp(20px,2.5vw,32px)',
      }}
    >
      {POSTS.map((p) => (
        <Link
          key={p.slug}
          to={`/blog/${p.slug}`}
          data-post
          className="blueprint"
          style={{
            padding: 'var(--space-6)',
            textDecoration: 'none',
            color: 'inherit',
            display: 'grid',
            gap: 10,
            alignContent: 'start',
          }}
        >
          <Corners />
          <span
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              alignItems: 'center',
              fontSize: 11,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-700)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}
            >
              <Tag size={14} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
              {p.category}
            </span>
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 21,
              lineHeight: 1.2,
              margin: 0,
              transition: 'color .15s ease',
            }}
          >
            {p.title}
          </h3>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.55,
              margin: 0,
              color: 'color-mix(in srgb,var(--color-text) 72%,transparent)',
            }}
          >
            {p.lead}
          </p>
          {p.date && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                fontSize: 12,
                color: MUTED,
                marginTop: 2,
              }}
            >
              <CalendarDays size={14} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
              {dateLabel(p.date)}
            </span>
          )}
        </Link>
      ))}
    </div>
  </section>
);
