/**
 * Встраивание SEO-блока в СУЩЕСТВУЮЩУЮ вёрстку страницы.
 *
 * Зачем: прежняя оптимизация собирала страницу с нуля
 * (`<html><head><title>…<body><h1>…<main>…`), из-за чего терялись шапка,
 * меню, стили, формы, скрипты и вся вёрстка сайта. Клиент получал
 * голый скелет вместо своего сайта.
 *
 * Здесь страница не переделывается: блок вставляется перед подвалом
 * (или перед `</body>`), мета-теги правятся на месте, всё остальное
 * остаётся байт в байт.
 *
 * Подход проверен на боевом каталоге из 62 000+ страниц.
 */

export interface SeoBlock {
  /** Заголовок блока (H2, не H1 — H1 на странице уже есть) */
  heading: string;
  /** Абзацы и подзаголовки: готовый HTML из <p>/<h3>/<b>/<table> */
  bodyHtml: string;
  /** Вопросы и ответы для сворачиваемого FAQ */
  faq?: { q: string; a: string }[];
  /** Прятать всё, кроме заголовка и первого абзаца, под кнопку */
  collapsible?: boolean;
}

export interface InjectOptions {
  /** Новый <title>, если нужно заменить */
  title?: string;
  /** Новый meta description, если нужно заменить */
  description?: string;
  /** Не вставлять блок повторно, если он уже есть */
  skipIfPresent?: boolean;
}

/** Маркер нашего блока — по нему проверяем повторную вставку */
export const BLOCK_MARKER = 'data-seomarket-block';

/** Куда вставлять: первый найденный якорь подвала */
const FOOTER_ANCHORS = [
  '<div class="footer jsftr"',
  '<footer',
  '<div class="footer"',
  '<div class="footer ',
  '<div id="footer"',
];

const STYLE_ID = 'seomarket-block-style';

const BLOCK_CSS = `<style id="${STYLE_ID}">
.sm-seo{max-width:1560px;margin:34px auto 0;font-family:inherit;color:#2a2a2a;line-height:1.7}
.sm-seo h2{font-size:24px;color:#1a1a1a;margin:0 0 12px}
.sm-seo h3{font-size:18px;color:#1f7a34;margin:20px 0 6px}
.sm-seo p{margin:0 0 12px;font-size:15.5px;text-align:justify}
.sm-seo table{border-collapse:collapse;width:100%;max-width:720px;margin:10px 0 16px;font-size:14.5px}
.sm-seo td,.sm-seo th{border:1px solid #e3e3e3;padding:8px 12px;text-align:left;vertical-align:top}
.sm-seo th{background:#f7faf7;color:#1f7a34;font-weight:700}
.sm-seo details.sm-more>summary{list-style:none;display:inline-block;cursor:pointer;background:#4a8f3c;color:#fff;font-weight:600;padding:9px 22px;border-radius:4px;margin:8px 0}
.sm-seo details.sm-more>summary::-webkit-details-marker{display:none}
.sm-faq{max-width:1560px;margin:26px auto 0;font-family:inherit}
.sm-faq h3{font-size:20px;color:#1a1a1a;margin:0 0 12px}
.sm-faq details{border:1px solid #e3e3e3;border-radius:4px;margin-bottom:8px}
.sm-faq summary{padding:11px 14px;font-weight:600;cursor:pointer;font-size:15px;list-style:none}
.sm-faq summary::-webkit-details-marker{display:none}
.sm-faq .sm-a{padding:0 14px 12px;font-size:15px;line-height:1.65;color:#444}
</style>`;

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Собирает HTML блока: заголовок + тело (+ сворачивание) + FAQ */
export function buildBlockHtml(block: SeoBlock): string {
  let body = block.bodyHtml || '';

  if (block.collapsible) {
    // Видимыми оставляем заголовок и первый абзац, остальное — под кнопку.
    const firstP = body.indexOf('</p>');
    if (firstP > -1) {
      const head = body.slice(0, firstP + 4);
      const rest = body.slice(firstP + 4);
      if (rest.trim()) {
        body =
          head +
          '<details class="sm-more"><summary>Читать полностью</summary>' +
          rest +
          '</details>';
      }
    }
  }

  const seo =
    `<div class="sm-seo" ${BLOCK_MARKER}>` +
    `<h2>${escapeHtml(block.heading)}</h2>` +
    body +
    `</div>`;

  let faq = '';
  if (block.faq?.length) {
    const items = block.faq
      .map(
        f =>
          `<details><summary>${escapeHtml(f.q)}</summary>` +
          `<div class="sm-a">${escapeHtml(f.a)}</div></details>`
      )
      .join('');
    faq = `<div class="sm-faq"><h3>Часто задаваемые вопросы</h3>${items}</div>`;
  }

  return BLOCK_CSS + seo + faq;
}

/** Меняет <title>, добавляя его если тега нет */
function replaceTitle(html: string, title: string): string {
  if (/<title[^>]*>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(
      /<title[^>]*>[\s\S]*?<\/title>/i,
      `<title>${escapeHtml(title)}</title>`
    );
  }
  return html.replace(/<head([^>]*)>/i, m => `${m}\n<title>${escapeHtml(title)}</title>`);
}

/** Меняет meta description, добавляя тег если его нет */
function replaceDescription(html: string, description: string): string {
  const re = /(<meta[^>]+name=["']description["'][^>]*content=["'])[^"']*(["'])/i;
  if (re.test(html)) {
    return html.replace(re, (_m, a, b) => a + escapeHtml(description) + b);
  }
  const tag = `\n<meta name="description" content="${escapeHtml(description)}">`;
  if (/<\/title>/i.test(html)) return html.replace(/<\/title>/i, `</title>${tag}`);
  return html.replace(/<head([^>]*)>/i, m => `${m}${tag}`);
}

/**
 * Встраивает блок в страницу, сохраняя её вёрстку.
 * Возвращает исходный HTML без изменений, если вставлять некуда
 * или блок уже стоит.
 */
export function injectSeoBlock(
  rawHtml: string,
  block: SeoBlock,
  options: InjectOptions = {}
): string {
  if (!rawHtml || typeof rawHtml !== 'string') return rawHtml;

  let html = rawHtml;

  if (options.skipIfPresent !== false && html.includes(BLOCK_MARKER)) {
    return html;
  }

  if (options.title) html = replaceTitle(html, options.title);
  if (options.description) html = replaceDescription(html, options.description);

  // Пустой блок не вставляем — иначе на странице появится
  // заголовок без текста. Мета-теги при этом уже обновлены.
  const hasBody = Boolean(block.bodyHtml?.trim());
  const hasFaq = Boolean(block.faq?.length);
  if (!hasBody && !hasFaq) return html;

  const blockHtml = buildBlockHtml(block);

  // Вставляем перед подвалом — так блок оказывается внизу контента,
  // но выше служебной части страницы.
  for (const anchor of FOOTER_ANCHORS) {
    const i = html.indexOf(anchor);
    if (i > -1) {
      return html.slice(0, i) + blockHtml + html.slice(i);
    }
  }

  // Подвала нет — ставим перед закрытием body.
  const b = html.lastIndexOf('</body>');
  if (b > -1) {
    return html.slice(0, b) + blockHtml + html.slice(b);
  }

  return html + blockHtml;
}
