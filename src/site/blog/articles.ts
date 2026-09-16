import META from './articles-meta.json';
import type { Article, ArticleBlock, ArticleBody, ArticleMeta } from './types';
import { plainText } from './text';
import { dubli, perelinkovka, plotnost, uskorenie } from './content/part-1';
import { chtoDelaem, indeks, ssylki, teksty } from './content/part-2';
import { cena, robots, schema } from './content/part-3';

export type { Article, ArticleBlock, ArticleMeta } from './types';

/**
 * Статьи блога.
 *
 * Метаданные (slug, заголовок, описание, дата, фото) лежат в articles-meta.json, а не здесь:
 * тот же файл читает scripts/prerender.cjs, чтобы положить dist/blog/<slug>/index.html с
 * настоящим title и описанием и внести адрес в sitemap. Две копии заголовков разошлись бы.
 *
 * Порядок — как в ленте макета: первая статья идёт в главный блок /blog.
 * Контракт для лендинга: { slug, title, lead, category, readMinutes, photo } — не менять.
 */

const BODIES: Record<string, ArticleBody> = {
  'uskorenie-sajta': uskorenie,
  dubli,
  plotnost,
  perelinkovka,
  ssylki,
  teksty,
  'chto-delaem': chtoDelaem,
  indeks,
  schema,
  robots,
  cena,
};

function blockText(b: ArticleBlock): string {
  switch (b.type) {
    case 'paragraph':
      return b.text;
    case 'list':
      return b.items.join(' ');
    case 'table':
      return [b.caption, ...b.head, ...b.rows.flat(), b.note ?? ''].join(' ');
    case 'callout':
      return `${b.title ?? ''} ${b.text}`;
    case 'code':
      return `${b.caption ?? ''} ${b.text}`;
    case 'figure':
      return b.caption;
  }
}

/**
 * Время чтения — из объёма текста: ~1200 знаков в минуту (технический текст с таблицами
 * читается медленнее обычного). Раньше в макете минуты стояли руками и не совпадали со статьями.
 */
function readMinutes(meta: ArticleMeta, body: ArticleBody): number {
  const chars = [
    meta.lead,
    ...body.sections.flatMap((s) => [s.title, ...s.blocks.map(blockText)]),
    ...body.faq.flatMap((f) => [f.q, f.a]),
  ]
    .map(plainText)
    .join(' ').length;
  return Math.max(3, Math.round(chars / 1200));
}

export const ARTICLES: Article[] = (META as ArticleMeta[]).map((meta) => {
  const body = BODIES[meta.slug];
  // Статья без текста — ошибка сборки данных, а не повод молча показать пустую страницу.
  if (!body) throw new Error(`Блог: нет текста статьи ${meta.slug}`);
  return { ...meta, ...body, readMinutes: readMinutes(meta, body) };
});

export const getArticle = (slug: string | undefined): Article | undefined =>
  slug ? ARTICLES.find((a) => a.slug === slug) : undefined;

/** Дата для людей: «12 сентября 2026». */
export function formatArticleDate(iso: string, withYear = true): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('ru-RU', withYear ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'long' }).replace(/\s*г\.$/, '');
}

/**
 * Похожие статьи: сначала той же рубрики, затем самые свежие из остальных.
 * Текущая статья в список не попадает.
 */
export function relatedArticles(current: Article, count = 3): Article[] {
  const others = ARTICLES.filter((a) => a.slug !== current.slug);
  const same = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category).sort((a, b) => b.date.localeCompare(a.date));
  return [...same, ...rest].slice(0, count);
}
