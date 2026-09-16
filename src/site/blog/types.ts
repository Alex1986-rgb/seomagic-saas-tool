/**
 * Типы статей блога.
 *
 * Текст внутри блоков — строка с минимальной разметкой (см. Inline.tsx):
 * **жирный**, `код`, [текст ссылки](/адрес). Отдельный язык разметки вместо JSX нужен затем,
 * чтобы статьи оставались данными: их читает и страница, и счётчик времени чтения,
 * и (через articles-meta.json) скрипт пререндера.
 */

export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | {
      type: 'table';
      /** Подпись над таблицей — как в макете, по центру. */
      caption: string;
      head: string[];
      rows: string[][];
      /** Номер строки (с нуля), выделенной фоном: «ваш случай». */
      highlight?: number;
      /** Колонки, выровненные вправо (числа, короткие ответы). */
      alignRight?: number[];
      note?: string;
      minWidth?: number;
    }
  | { type: 'callout'; title?: string; text: string }
  /** Фрагмент кода или файла (robots.txt, JSON-LD) — выводится как есть, с прокруткой по ширине. */
  | { type: 'code'; caption?: string; text: string }
  | {
      type: 'figure';
      /** Путь внутри public/ без ведущего слэша: подпуть публикации подставляет страница. */
      src: string;
      alt: string;
      caption: string;
    };

export interface ArticleSection {
  /** Якорь раздела — транслитом, по нему работает оглавление. */
  id: string;
  title: string;
  /** Короткое название для оглавления, если заголовок длинный. */
  toc?: string;
  blocks: ArticleBlock[];
}

export interface ArticleFaq {
  q: string;
  a: string;
}

/** Метаданные — общие для страницы, лендинга и scripts/prerender.cjs (articles-meta.json). */
export interface ArticleMeta {
  slug: string;
  title: string;
  /** Описание для поисковой выдачи — до 160 знаков. */
  description: string;
  lead: string;
  category: string;
  /** ISO-дата публикации. */
  date: string;
  /** id фото из src/site/photos.ts — обложка. */
  photo: string;
  /** Второй кадр карточки в ленте блога. */
  photoDetail?: string;
  /** Кадр для карусели «Читать дальше», если у статьи есть свой. */
  railPhoto?: string;
  /** Второй абзац карточки в ленте и текст карточки в карусели. */
  summary: string;
}

export interface Article extends ArticleMeta {
  /** Считается по объёму текста, а не вписывается руками — иначе расходится с самой статьёй. */
  readMinutes: number;
  sections: ArticleSection[];
  faq: ArticleFaq[];
}

export interface ArticleBody {
  sections: ArticleSection[];
  faq: ArticleFaq[];
}
