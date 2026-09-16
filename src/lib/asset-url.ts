/**
 * Пути к файлам из папки public.
 *
 * Сайт публикуется на GitHub Pages в подпапке (/seomagic-saas-tool/), а в коде
 * картинки и видео были записаны от корня домена: «/img/video-poster.jpg».
 * В собранной версии браузер шёл за ними на example.com/img/... вместо
 * example.com/seomagic-saas-tool/img/... и получал 404 — картинки и постеры
 * видео не открывались. Здесь к пути приклеивается тот адрес, с которым сайт
 * собран (import.meta.env.BASE_URL), поэтому один и тот же код работает и в
 * подпапке, и на своём домене.
 */

const isExternal = (path: string): boolean =>
  /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path);

/** Путь к файлу из public с учётом адреса публикации. */
export function assetUrl(path: string): string {
  if (!path) return path;
  // Ссылки на чужие домены, data: и blob: трогать нельзя.
  if (isExternal(path)) return path;

  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/**
 * Полный адрес файла вместе с доменом.
 *
 * Нужен разметке schema.org и тегам og:image: поисковики и соцсети читают их
 * в отрыве от страницы, относительный путь там не годится.
 */
export function absoluteAssetUrl(path: string): string {
  if (!path) return path;
  if (isExternal(path)) return path;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${assetUrl(path)}`;
}

/**
 * Полный адрес страницы сайта вместе с доменом и подпутём публикации.
 *
 * Разметка schema.org собирала адреса как `${window.location.origin}/pricing`
 * и теряла подпуть: на github.io/seomagic-saas-tool/ хлебные крошки, адреса
 * статей, услуг и организации вели на корень github.io, где этих страниц нет.
 * `path` — путь маршрута, как в <Link to>: «/pricing», «/#organization».
 */
export function absolutePageUrl(path = '/'): string {
  if (isExternal(path)) return path;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  return `${origin}${base}/${path.replace(/^\/+/, '')}`;
}

/**
 * Адрес открытой страницы для canonical и og:url — без query-параметров и якоря.
 *
 * Раньше брался window.location.href целиком, и /pricing?utm_source=tg или
 * /audit?url=site.ru объявляли каноничными сами себя: каждая метка и каждый
 * проверенный адрес становились отдельной страницей-дублем. pathname уже
 * содержит подпуть публикации, поэтому BASE_URL здесь не добавляется.
 */
export function currentPageUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`;
}
