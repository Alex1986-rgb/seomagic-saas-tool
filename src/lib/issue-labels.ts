/**
 * Человеческие названия и советы для типов замечаний аудита.
 *
 * Краулер записывает замечания служебными кодами (`no_compression`,
 * `missing_alt_text`), а показывать их пользователю нужно по-русски и с
 * понятным советом. Держим соответствие в одном месте: им пользуются и
 * результаты аудита, и смета, и отчёт.
 */

export interface IssueLabel {
  title: string;
  advice: string;
}

const LABELS: Record<string, IssueLabel> = {
  slow_page: {
    title: 'Медленная загрузка страницы',
    advice: 'Сжать изображения, включить кеширование, убрать лишние скрипты.',
  },
  high_ttfb: {
    title: 'Долгий ответ сервера',
    advice: 'Ускорить ответ сервера: кеш, индексы в базе, лёгкие запросы.',
  },
  no_compression: {
    title: 'Не включено сжатие ответа',
    advice: 'Включить Gzip или Brotli на сервере — ответы станут в разы легче.',
  },
  large_html: {
    title: 'Тяжёлый HTML страницы',
    advice: 'Убрать лишнюю разметку и встроенные стили, вынести скрипты.',
  },
  missing_alt_text: {
    title: 'Картинки без описания',
    advice: 'Добавить описания к картинкам: это и доступность, и поиск по картинкам.',
  },
  empty_alt_text: {
    title: 'Пустые описания картинок',
    advice: 'Заполнить описания картинок осмысленным текстом.',
  },
  missing_title: {
    title: 'Нет заголовка страницы',
    advice: 'Добавить title длиной 50–60 знаков с главным запросом.',
  },
  long_title: {
    title: 'Слишком длинный заголовок',
    advice: 'Сократить заголовок до 50–60 знаков, иначе обрежется в выдаче.',
  },
  short_title: {
    title: 'Слишком короткий заголовок',
    advice: 'Расширить заголовок до 50–60 знаков, добавив уточнение.',
  },
  duplicate_title: {
    title: 'Повторяющийся заголовок',
    advice: 'Сделать заголовки уникальными: поиск считает такие страницы дублями.',
  },
  missing_description: {
    title: 'Нет описания страницы',
    advice: 'Добавить описание на 120–160 знаков — это текст сниппета в выдаче.',
  },
  short_description: {
    title: 'Слишком короткое описание',
    advice: 'Довести описание до 120–160 знаков.',
  },
  long_description: {
    title: 'Слишком длинное описание',
    advice: 'Сократить описание до 120–160 знаков, иначе обрежется в выдаче.',
  },
  duplicate_description: {
    title: 'Повторяющееся описание',
    advice: 'Сделать описания уникальными для каждой страницы.',
  },
  missing_h1: {
    title: 'Нет заголовка H1',
    advice: 'Добавить на страницу один заголовок H1 с главным запросом.',
  },
  multiple_h1: {
    title: 'Несколько заголовков H1',
    advice: 'Оставить один H1, остальные понизить до H2.',
  },
  thin_content: {
    title: 'Мало текста на странице',
    advice: 'Дополнить страницу содержанием: поиск редко показывает пустые страницы.',
  },
  missing_canonical: {
    title: 'Нет canonical',
    advice: 'Указать canonical, чтобы поиск понимал главную версию страницы.',
  },
  wrong_canonical: {
    title: 'Неверный canonical',
    advice: 'Исправить canonical: он должен указывать на саму страницу.',
  },
  not_indexable: {
    title: 'Страница закрыта от индексации',
    advice: 'Проверить, намеренно ли закрыта страница в robots-мете.',
  },
  redirect_chain: {
    title: 'Цепочка переадресаций',
    advice: 'Сократить цепочку до одного перехода.',
  },
  broken_link: {
    title: 'Битая ссылка',
    advice: 'Починить или убрать ссылку, ведущую в никуда.',
  },
  server_error: {
    title: 'Ошибка сервера',
    advice: 'Разобраться с ответом 5xx: такие страницы выпадают из поиска.',
  },
  missing_schema: {
    title: 'Нет микроразметки',
    advice: 'Добавить разметку Schema.org — она даёт расширенный сниппет.',
  },
  invalid_schema: {
    title: 'Ошибки в микроразметке',
    advice: 'Исправить разметку: с ошибками поиск её игнорирует.',
  },
  no_internal_links: {
    title: 'Нет внутренних ссылок',
    advice: 'Связать страницу с разделами сайта — иначе она остаётся в стороне.',
  },
};

/** Название замечания по коду; незнакомый код возвращаем как есть. */
export function issueTitle(issueType: string): string {
  return LABELS[issueType]?.title ?? issueType;
}

/** Совет по замечанию; если кода нет в справочнике — пустая строка. */
export function issueAdvice(issueType: string): string {
  return LABELS[issueType]?.advice ?? '';
}

/** Строка для списка рекомендаций: что не так, на скольких страницах и что делать. */
export function issueRecommendation(issueType: string, count: number): string {
  const advice = issueAdvice(issueType);
  const where = count > 1 ? ` — ${count} ${plural(count, ['страница', 'страницы', 'страниц'])}` : '';
  return `${issueTitle(issueType)}${where}. ${advice}`.trim();
}

/** Русский счёт: 1 страница, 2 страницы, 5 страниц. */
export function plural(n: number, [one, few, many]: [string, string, string]): string {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}
