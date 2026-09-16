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
