#!/usr/bin/env node
/**
 * Надёжное самодостаточное зеркало сайта с SEO-фиксами.
 * Резолвит ВСЕ ассеты (относительные, корне-относительные, абсолютные, srcset,
 * inline url(), CSS url(), динамические image.php), скачивает локально и переписывает
 * ссылки на демо-абсолютные пути. Применяет SEO-фиксы (title/H1/meta/canonical/og/JSON-LD).
 *
 * node scripts/site-clone.cjs <startUrl> <outDir> <demoBaseUrl> [--max N]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const START = process.argv[2];
const OUT = process.argv[3];
const DEMO = (process.argv[4] || '').replace(/\/+$/, '') + '/';
const getOpt = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const MAX = Number(getOpt('--max', 10));
const CONC = Number(getOpt('--concurrency', 10)); // конкурентность загрузки страниц/ассетов (сеть = узкое место)
if (!START || !OUT || !process.argv[4]) { console.error('node scripts/site-clone.cjs <startUrl> <outDir> <demoBaseUrl> [--max N]'); process.exit(1); }

const ORIGIN = new URL(START).origin;
const HOST = new URL(START).hostname.replace(/^www\./i, ''); // нормализованный хост (www == без www)
const sameHost = (u) => { try { return new URL(u).hostname.replace(/^www\./i, '') === HOST; } catch { return false; } };
const base = START.endsWith('/') ? START : START + '/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';
const log = (m) => process.stderr.write(m + '\n');
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rebind = (u) => { try { const x = new URL(u); return new URL(x.pathname.replace(/^\//, '') + x.search, base).toString(); } catch { return null; } };

async function fetchRaw(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ru,en;q=0.8' } });
      if ((r.status === 429 || r.status >= 500) && attempt < retries) { await new Promise((res) => setTimeout(res, 500 * (attempt + 1))); continue; }
      return { status: r.status, buf: Buffer.from(await r.arrayBuffer()), ct: r.headers.get('content-type') || '' };
    } catch (e) { if (attempt < retries) { await new Promise((res) => setTimeout(res, 500 * (attempt + 1))); continue; } return { status: 0, buf: Buffer.alloc(0), ct: '' }; }
  }
  return { status: 0, buf: Buffer.alloc(0), ct: '' };
}

const EXT_CT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg', 'text/css': '.css', 'application/javascript': '.js', 'font/woff2': '.woff2', 'font/woff': '.woff' };

// Карта: абсолютный URL ассета → локальный относительный путь
const assetMap = new Map();
function mapAsset(absUrl, ctHint) {
  if (assetMap.has(absUrl)) return assetMap.get(absUrl);
  const u = new URL(absUrl);
  let rel;
  const clean = u.pathname.replace(/^\/+/, '');
  const hasExt = /\.[a-z0-9]{2,5}$/i.test(clean);
  if (u.search || /\.php$/i.test(clean) || !hasExt) {
    const ext = EXT_CT[ctHint] || (clean.match(/\.[a-z0-9]{2,5}$/i) || ['.bin'])[0];
    rel = 'cloned-assets/' + crypto.createHash('md5').update(absUrl).digest('hex').slice(0, 16) + ext;
  } else {
    rel = clean;
  }
  assetMap.set(absUrl, rel);
  return rel;
}

const tag = (h, re) => { const m = h.match(re); return m ? m[1].trim() : null; };
function shortenTitle(t) { t = t.trim(); if (t.length <= 65) return t; for (const s of [' — ', ' | ', ' – ', ' - ', ', ']) { const i = t.indexOf(s); if (i >= 30 && i <= 60) return t.slice(0, i).trim(); } return t.slice(0, 59).replace(/\s+\S*$/, '').trim() + '…'; }

// Общий премиум-стиль SEO-блока (категории и товары). !important перекрывает inline вёрстку.
const SEO_STYLE = `<style>
  .smk-seo{max-width:1080px;margin:44px auto;padding:34px 30px;background:#fff;border:1px solid #ececec;border-radius:14px;font-family:'Helvetica Neue',Arial,sans-serif;color:#2b2b2b;line-height:1.78!important;box-shadow:0 8px 30px rgba(0,0,0,.06)}
  .smk-seo h2{font-size:28px!important;font-weight:800!important;color:#1a1a1a!important;margin:0 0 6px!important;letter-spacing:-.4px!important}
  .smk-seo .smk-kicker{color:#9c7a3c!important;font-weight:700!important;font-size:13px!important;text-transform:uppercase;letter-spacing:1.4px;margin:0 0 16px!important}
  .smk-seo h3{font-size:19px!important;font-weight:700!important;color:#1a1a1a!important;margin:28px 0 10px!important;padding-left:13px!important;border-left:3px solid #9c7a3c!important}
  .smk-seo p{margin:0 0 13px!important;color:#3a3a3a!important;font-size:15.5px!important}
  .smk-seo .smk-lead{font-size:17.5px!important;color:#222!important;font-weight:500!important}
  .smk-seo strong{color:#1a1a1a!important;font-weight:700!important}
  .smk-seo a{color:#9c7a3c!important;text-decoration:none!important;border-bottom:1px solid rgba(156,122,60,.45)!important}
  .smk-seo table{width:100%!important;border-collapse:separate!important;border-spacing:0!important;margin:18px 0!important;border:1px solid #e6e6e6!important;border-radius:10px!important;overflow:hidden!important}
  .smk-seo th{background:#1a1a1a!important;color:#fff!important;padding:12px 14px!important;text-align:left!important;font-size:12.5px!important;text-transform:uppercase!important;letter-spacing:.5px!important}
  .smk-seo td{padding:11px 14px!important;border:0!important;border-top:1px solid #eee!important;font-size:14.5px!important;color:#3a3a3a!important}
  .smk-seo tbody tr:nth-child(even) td{background:#faf8f4!important}
  .smk-seo details{border:1px solid #ececec!important;border-radius:10px!important;padding:12px 16px!important;margin:8px 0!important;background:#fafafa!important}
  .smk-seo summary{cursor:pointer!important;font-weight:600!important;color:#1a1a1a!important;list-style:none!important}
  .smk-seo summary::-webkit-details-marker{display:none}
  .smk-seo .smk-more{border:0!important;background:transparent!important;padding:0!important;margin:8px 0 0!important}
  .smk-seo .smk-more>summary{color:#9c7a3c!important;font-size:15px!important;font-weight:700!important}
  .smk-seo .smk-callout{background:#faf8f4!important;border-left:4px solid #9c7a3c!important;border-radius:8px!important;padding:14px 18px!important;margin:16px 0!important}
  .smk-seo .smk-callout p{margin:0!important;font-size:15px!important;color:#4a4030!important}
  </style>`;

// Страница товара (карточка): /catalog/<категория>/<слаг> (3+ сегмента).
function isProduct(pageUrl) {
  try { const segs = new URL(pageUrl).pathname.replace(/^\/+|\/+$/g, '').split('/'); return segs[0] === 'catalog' && segs.length >= 3 && segs[2].length > 2; }
  catch { return false; }
}

// Категории для нижнего SEO-текста товарных страниц (по 2-му сегменту URL).
const CAT_NAMES = { spalni: 'Спальни', gostinye: 'Гостиные', 'myagkaya-mebel': 'Мягкая мебель', kabinety: 'Кабинеты', prihozie: 'Прихожие', detskie: 'Детские', kuhni: 'Кухни', 'stoly-i-stulya': 'Столы и стулья', shkafy: 'Шкафы', 'mebel-dlya-kafe-i-restoranov': 'Мебель для кафе и ресторанов' };
function catTopic(pageUrl) {
  try { const s = (new URL(pageUrl).pathname.replace(/^\/+|\/+$/g, '').split('/')[1]) || ''; return CAT_NAMES[s] || (s ? s.replace(/[-_]/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'Каталог'); }
  catch { return 'Каталог'; }
}

// Парсим реальные данные карточки из родного блока good-info (материалы, габариты, наличие, текст описания).
function parseSpecs(html) {
  const out = { material: '', dims: [], availability: '', desc: '' };
  const i = html.indexOf('good-info'); if (i < 0) return out;
  const seg = html.slice(i, i + 5000);
  for (const m of seg.matchAll(/<th>([^<]+)<\/th>\s*<td>([\s\S]*?)<\/td>/gi)) {
    const k = m[1].replace(/\s+/g, ' ').trim();
    const v = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!v) continue;
    if (/материал/i.test(k)) out.material = v;
    else if (/наличие/i.test(k)) out.availability = v.replace(/\s*Как сделать заказ\?.*/i, '').trim();
    else if (/(длина|ширина|глубина|высота|диаметр)/i.test(k)) out.dims.push(`${k} — ${v}`);
  }
  const dm = seg.match(/<h2>\s*Описание\s*<\/h2>\s*<p>([\s\S]*?)<\/p>/i);
  out.desc = dm ? dm[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  return out;
}

// Продолжение РОДНОГО описания под картинкой: детальные абзацы с реальными данными. Блендится со стилем сайта.
function productContinuation(topic, real, pageUrl) {
  const segs = (() => { try { return new URL(pageUrl).pathname.replace(/^\/+|\/+$/g, '').split('/'); } catch { return []; } })();
  const slug = (segs[2] || '').split('-');
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  const type = (topic.split(/\s+/)[0] || 'Изделие').replace(/[^А-Яа-яA-Za-z]/g, '') || 'Изделие';
  const brand = cap(slug[1] || '') || 'итальянской фабрики';
  const seed = pageUrl || topic;
  const L = (href, t) => `<a href="${DEMO}${String(href).replace(/^\//, '')}">${t}</a>`;
  const isSoft = /диван|кроват|кресл|тахта|пуф|банкет/i.test(type);
  const upholstery = pick(['натуральная кожа премиум-класса', 'мягкая экокожа', 'износостойкий велюр', 'фактурная рогожка', 'шенилл'], seed, 2);
  const filling = pick(['независимый пружинный блок', 'высокоэластичный ППУ', 'натуральный пух и гусиное перо', 'холлофайбер'], seed + 'f', 2);
  const mech = pick(['еврокнижка', 'дельфин', 'аккордеон', 'выкатной'], seed + 'm', 1)[0];
  const finish = pick(['ручная патина', 'золочение поталью', 'художественная резьба', 'лаковое покрытие'], seed + 'd', 2);
  const style = pick(['классика', 'неоклассика', 'ар-деко', 'модерн', 'прованс'], seed + 's', 1)[0];
  const mat = real.material || 'массив дерева';
  const dimsLine = real.dims.length ? `Габариты модели: ${real.dims.map(esc).join(', ')}. ` : '';
  const h = 'style="margin:20px 0 7px;font-size:17px;color:#1a1a1a"';

  return `<div data-seomarket="desc" style="margin-top:14px;border-top:1px solid #eee;padding-top:6px">
  <p>Модель «${esc(topic)}» — изделие от ${esc(brand)} (Италия) в стиле ${esc(style)}. Это продуманное сочетание выразительного дизайна, качественных материалов и эргономики: ${esc(type.toLowerCase())} становится смысловым акцентом интерьера и при бережной эксплуатации служит долгие годы.</p>
  <h3 ${h}>Дизайн и материалы</h3>
  <p>Каркас изделия выполнен из материала «${esc(mat)}», что обеспечивает прочность и устойчивость конструкции. ${isSoft ? `Обивка — ${esc(upholstery.join(', '))}; она приятна на ощупь, износостойка и доступна в разных цветах под ваш интерьер.` : `Отделка выполнена в техниках ${esc(finish.join(', '))}, придающих изделию благородный, статусный вид.`} Каждый элемент проходит контроль качества, а материалы сертифицированы и безопасны для дома.</p>
  ${isSoft ? `<h3 ${h}>Наполнение и комфорт</h3><p>Внутреннее наполнение — ${esc(filling.join(' и '))}: оно обеспечивает правильную поддержку, сохраняет форму и дарит комфорт при ежедневном использовании. ${mech ? `Доступен механизм трансформации «${esc(mech)}» для удобного спального места.` : ''}</p>` : `<h3 ${h}>Конструкция и фурнитура</h3><p>Применяется надёжная фурнитура с доводчиками и плавным ходом ящиков и дверей. Продуманная конструкция и системы хранения делают изделие практичным в повседневной эксплуатации.</p>`}
  <h3 ${h}>Размеры и размещение</h3>
  <p>${dimsLine}Перед покупкой сопоставьте габариты с планировкой помещения и проходами. При необходимости возможно изготовление в других размерах и вариантах отделки — уточните у менеджера. Грамотный подбор по размеру обеспечивает удобство и гармоничный вид интерьера.</p>
  <h3 ${h}>В интерьере и сочетания</h3>
  <p>«${esc(topic)}» легко комбинируется с другими предметами коллекции. Для целостного образа подберите изделия того же стиля и палитры. Смотрите также: ${L('/catalog/' + (segs[1] || 'spalni'), esc(catTopic(pageUrl).toLowerCase()))}, ${L('/catalog/myagkaya-mebel', 'мягкая мебель')} и наши ${L('/projects', 'реализованные проекты')}.</p>
  <h3 ${h}>Преимущества модели</h3>
  <p>Среди ключевых достоинств «${esc(topic)}» — узнаваемый дизайн фабрики ${esc(brand)}, качественные материалы (${esc(mat)}${isSoft ? ', ' + esc(upholstery[0]) : ', ' + esc(finish[0])}), надёжная сборка и внимание к деталям. Изделие одинаково уместно как самостоятельный акцент и как часть продуманного ансамбля, а проверенные комплектующие обеспечивают долгий срок службы без потери внешнего вида.</p>
  <h3 ${h}>Уход и эксплуатация</h3>
  <p>Чтобы изделие служило долго, берегите его от прямых солнечных лучей и избыточной влажности, проводите регулярную сухую чистку, а для ${isSoft ? 'кожи и текстиля используйте подходящие средства' : 'деревянных поверхностей — специальные полироли'}. Соблюдение простых правил ухода сохранит первоначальный вид «${esc(topic)}» на годы.</p>
  <h3 ${h}>Доставка, гарантия и заказ</h3>
  <p>Доставляем по всей России; возможны подъём и профессиональная сборка силами нашей бригады. ${real.availability ? `Наличие: ${esc(real.availability)}. ` : ''}На изделие действует официальная гарантия. Оформить заказ и узнать стоимость можно через менеджера в разделе ${L('/contacts', 'контакты')} — поможем с выбором и подскажем сроки.</p>
  </div>`;
}

// Извлекаем сигналы со страницы для уникализации текста: товары/подкатегории, бренды.
function extractInfo(html, topic) {
  const names = new Set();
  // заголовки h2/h3 и тексты ссылок каталога/карточек
  for (const m of html.matchAll(/<(?:h2|h3)[^>]*>([^<]{3,60})<\/(?:h2|h3)>/gi)) names.add(m[1].trim());
  for (const m of html.matchAll(/<a[^>]+class=["'][^"']*(?:product|item|catalog|card|name|title)[^"']*["'][^>]*>([^<]{3,60})<\/a>/gi)) names.add(m[1].trim());
  for (const m of html.matchAll(/<img[^>]+alt=["']([^"']{4,60})["']/gi)) names.add(m[1].trim());
  const clean = [...names].map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s && !/^(меню|поиск|корзина|каталог|главная|войти|контакты|©|\d+)$/i.test(s) && s.toLowerCase() !== topic.toLowerCase())
    .slice(0, 8);
  return clean;
}

// Хэш URL → детерминированный выбор вариаций (псевдо-уникальность без AI)
function pick(arr, seed, n) { const out = []; let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0; const a = [...arr]; while (a.length && out.length < n) { out.push(a.splice(h % a.length, 1)[0]); h = (h * 1103515245 + 12345) >>> 0; } return out; }

// Профессиональный SEO-текст ~10000 знаков, уникализированный по теме/товарам, с перелинковкой,
// раскрытием по стрелке (первый абзац виден, далее весь текст). Мебельная конкретика.
function contentBlock(topic, html, pageUrl) {
  const tl = topic.toLowerCase();
  const items = extractInfo(html || '', topic);
  const seed = (pageUrl || topic);
  const td = 'border:1px solid #ddd;padding:9px 13px;text-align:left;font-size:14px';
  const th = td + ';background:#f5f5f5;font-weight:600';
  const L = (href, t) => `<a href="${DEMO}${String(href).replace(/^\//, '')}" style="color:#c0142b">${t}</a>`;

  const upholstery = pick(['натуральная кожа премиум-класса', 'мягкая экокожа', 'износостойкий велюр', 'фактурная рогожка', 'практичный шенилл', 'классический гобелен', 'бархатистый микровелюр'], seed, 4);
  const fillings = pick(['пружинный блок «боннель»', 'независимый пружинный блок', 'высокоэластичный ППУ', 'холлофайбер', 'комфортный синтепон', 'натуральный пух и гусиное перо', 'мемори-пена'], seed + 'f', 4);
  const mechanisms = pick(['еврокнижка', 'дельфин', 'аккордеон', 'клик-кляк', 'выкатной', 'седафлекс (американская раскладушка)', 'пума'], seed + 'm', 4);
  const woods = pick(['массив дуба', 'массив бука', 'массив ореха', 'массив ясеня', 'натуральный шпон'], seed + 'w', 3);
  const finishes = pick(['ручная патина', 'золочение поталью', 'художественная резьба', 'лаковое покрытие', 'браширование'], seed + 'd', 3);
  const styles = pick(['классика', 'неоклассика', 'барокко', 'прованс', 'модерн', 'лофт', 'ар-деко'], seed + 's', 4);

  const itemsLine = items.length ? `<p>В этом разделе представлены, в частности: <strong>${items.map(esc).join(', ')}</strong> и другие модели — каждую можно подобрать под размер помещения, стиль интерьера и бюджет.</p>` : '';

  const faqs = [
    [`Какое наполнение лучше для «${tl}»?`, `Выбор зависит от сценария: ${esc(fillings[0])} и ${esc(fillings[1])} дают упругую поддержку и долговечность, а ${esc(fillings[2])} обеспечивает мягкий комфорт. Для премиум-моделей применяется ${esc(fillings[3] || 'натуральный пух и перо')}.`],
    [`Какая обивка практичнее?`, `Для активной эксплуатации подойдут ${esc(upholstery[0])} и ${esc(upholstery[1])}; для уюта — ${esc(upholstery[2])} и ${esc(upholstery[3] || 'велюр')}. Все материалы устойчивы к истиранию и просты в уходе.`],
    [`Какие механизмы трансформации доступны?`, `В ассортименте механизмы ${esc(mechanisms.join(', '))} — для ежедневного сна и периодического использования. Менеджер поможет выбрать оптимальный под вашу задачу.`],
    [`Из какого дерева изготовлен каркас и отделка?`, `Используются ${esc(woods.join(', '))}, а декор выполняется в техниках ${esc(finishes.join(', '))} — это придаёт изделию статусный вид и долговечность.`],
    ['Можно ли заказать по индивидуальным размерам?', `Да, доступно изготовление «${esc(tl)}» на заказ — по вашим габаритам, цвету обивки и конфигурации, включая нестандартные решения и единый стиль интерьера.`],
    ['Сколько стоит доставка и есть ли сборка?', `Доставка по городу и в регионы России, стоимость рассчитывается при оформлении. Доступны профессиональный подъём и сборка. Подробности уточняйте в разделе ${L('/contacts', 'контактов')}.`],
    ['Действует ли гарантия?', 'Да, на всю продукцию распространяется официальная гарантия производителя; срок и условия указаны в карточке товара и документах.'],
    ['Как оформить заказ и оплатить?', `Добавьте товар в корзину или свяжитесь с менеджером. Оплата — наличными, картой, в рассрочку или по счёту для юрлиц. Подобрать модель поможем в разделе ${L('/contacts', 'контактов')}.`],
  ];
  const faqItem = ([q, a]) => `<details style="border-bottom:1px solid #eee;padding:9px 0"><summary style="cursor:pointer;font-weight:600;color:#1a1a1a">${q}</summary><p style="margin:7px 0 0;color:#555">${a}</p></details>`;
  const col1 = faqs.slice(0, 4).map(faqItem).join('');
  const col2 = faqs.slice(4, 8).map(faqItem).join('');

  const intro = `<p class="smk-lead"><strong>${esc(topic)}</strong> — это сочетание продуманной эргономики, качественных материалов и выразительного дизайна. Мы помогаем оформить интерьер целостно: подбираем «${esc(tl)}» под площадь помещения, стиль и бюджет, с доставкой по всей России, профессиональной сборкой и гарантией.</p>`;

  const full = `
  ${itemsLine}
  <p>Ассортимент раздела «${esc(topic)}» охватывает решения для разных задач и стилей — от лаконичных современных моделей до статусной классики. Грамотный выбор по габаритам, материалам и функциональности напрямую влияет на удобство ежедневного использования и срок службы изделия. Ниже разобрали ключевые критерии, чтобы покупка «${esc(tl)}» была осознанной и выгодной.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Материалы обивки</h3>
  <p>Обивка определяет внешний вид, тактильность и долговечность. В наших моделях используются ${esc(upholstery.join(', '))}. ${esc(upholstery[0][0].toUpperCase() + upholstery[0].slice(1))} подойдёт ценителям премиальной фактуры и простого ухода, тогда как тканевые варианты дарят тепло и уют. Все материалы проходят проверку на износостойкость (тест Мартиндейла) и безопасность, устойчивы к выцветанию и подходят для семей с детьми и животными.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Наполнение и комфорт</h3>
  <p>Комфорт «${esc(tl)}» зависит от наполнения. Мы применяем ${esc(fillings.join(', '))}. Зависимые и независимые пружинные блоки обеспечивают ортопедическую поддержку, высокоэластичный ППУ держит форму, а натуральный пух и гусиное перо создают мягкость премиум-класса. Комбинация слоёв подбирается под желаемую жёсткость — от мягкой до упругой.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Механизмы трансформации</h3>
  <p>Если требуется спальное место, обратите внимание на механизмы: ${esc(mechanisms.join(', '))}. Для ежедневного сна оптимальны еврокнижка и дельфин — они надёжны и просты в раскладывании; аккордеон и клик-кляк экономят пространство. Менеджер подскажет ресурс механизма и подходящий вариант под нагрузку.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Каркас, дерево и отделка</h3>
  <p>Долговечность обеспечивает прочный каркас. В производстве используются ${esc(woods.join(', '))}, а художественная отделка выполняется в техниках ${esc(finishes.join(', '))}. Ручная патина и золочение поталью придают классическим моделям благородный, статусный вид, а массив и шпон гарантируют прочность на десятилетия.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Стили и сочетания</h3>
  <p>В каталоге представлены стили ${esc(styles.join(', '))}. Классика и неоклассика уместны в просторных гостиных и спальнях, прованс добавляет лёгкости, лофт и модерн подойдут современным интерьерам. Мы поможем собрать единый ансамбль «${esc(tl)}» и сопутствующих предметов, чтобы интерьер выглядел гармонично.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Цветовая палитра и сочетания</h3>
  <p>Актуальная палитра для «${esc(tl)}» включает ${esc(pick(['тёплый беж и карамель', 'графит и антрацит', 'изумруд и бутылочный зелёный', 'пыльно-розовый и пудра', 'глубокий синий', 'кофе с молоком', 'слоновую кость и крем'], seed + 'c', 4).join(', '))}. Нейтральные тона делают интерьер просторнее и легко комбинируются, а акцентные цвета добавляют характер. Мы поможем подобрать оттенок обивки и отделки так, чтобы «${esc(tl)}» гармонично вписались в существующий интерьер и подчеркнули его стиль.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Размеры, планировка и эргономика</h3>
  <p>Перед покупкой важно снять замеры и учесть проходы, расстановку и сценарии использования. Для небольших помещений подойдут компактные и трансформируемые модели, для просторных — крупные комплекты и модульные решения. Правильная эргономика «${esc(tl)}» обеспечивает удобство каждый день: продуманная высота, глубина посадки и системы хранения экономят место.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Для дома и бизнеса (HoReCa, офис)</h3>
  <p>Мы поставляем «${esc(tl)}» как для частных интерьеров, так и для бизнеса — кафе, ресторанов, гостиниц и офисов. Для коммерческих помещений важны повышенная износостойкость обивки, прочные каркасы и пожарная безопасность материалов. Возможны поставки партиями, единый стиль для сети и изготовление по техническому заданию.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Экологичность и безопасность</h3>
  <p>Применяемые материалы сертифицированы и безопасны: гипоаллергенные наполнители, экологичные клеи и покрытия с низкой эмиссией. Это важно для спален и детских. Качество «${esc(tl)}» подтверждается документами и гарантией, а долговечные материалы бережнее к бюджету и окружающей среде.</p>

  <h3 style="font-size:19px;margin:24px 0 8px;color:#1a1a1a">Ключевые параметры выбора</h3>
  <table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr><th style="${th}">Параметр</th><th style="${th}">Варианты</th><th style="${th}">Почему важно</th></tr></thead><tbody>
  <tr><td style="${td}">Обивка</td><td style="${td}">${esc(upholstery.join(', '))}</td><td style="${td}">Внешний вид, износ, уход</td></tr>
  <tr><td style="${td}">Наполнение</td><td style="${td}">${esc(fillings.join(', '))}</td><td style="${td}">Комфорт и поддержка</td></tr>
  <tr><td style="${td}">Механизм</td><td style="${td}">${esc(mechanisms.join(', '))}</td><td style="${td}">Спальное место, ресурс</td></tr>
  <tr><td style="${td}">Каркас/отделка</td><td style="${td}">${esc(woods.join(', '))}; ${esc(finishes.join(', '))}</td><td style="${td}">Прочность и статус</td></tr></tbody></table>

  <h3 style="font-size:19px;margin:24px 0 8px;color:#1a1a1a">Доставка, сборка и оплата</h3>
  <table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr><th style="${th}">Услуга</th><th style="${th}">Условия</th></tr></thead><tbody>
  <tr><td style="${td}">Доставка</td><td style="${td}">По городу и в регионы РФ, расчёт при оформлении</td></tr>
  <tr><td style="${td}">Подъём и сборка</td><td style="${td}">Профессиональная бригада</td></tr>
  <tr><td style="${td}">Оплата</td><td style="${td}">Наличные, карта, рассрочка, по счёту для юрлиц</td></tr>
  <tr><td style="${td}">На заказ</td><td style="${td}">Индивидуальные размеры, обивка, конфигурация</td></tr></tbody></table>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Уход и эксплуатация</h3>
  <p>Чтобы «${esc(tl)}» служили долго, берегите изделия от прямых солнечных лучей и избыточной влажности, регулярно проводите сухую чистку, для кожи используйте специальные средства, а тканевую обивку очищайте мягкими составами. При правильном уходе мебель сохраняет вид и свойства на долгие годы.</p>

  <h3 style="font-size:19px;margin:22px 0 8px;color:#1a1a1a">Почему выбирают нас</h3>
  <p>Большой ассортимент, честные цены без переплат, профессиональная консультация и доставка по всей России. Смотрите также: ${L('/catalog/myagkaya-mebel', 'мягкая мебель')}, ${L('/catalog/spalni', 'спальни')}, ${L('/catalog/gostinye', 'гостиные')}, наши ${L('/projects', 'реализованные проекты')} и ${L('/about', 'о компании')}. Остались вопросы — мы поможем подобрать «${esc(tl)}» под вашу задачу и бюджет.</p>

  <h3 style="font-size:19px;margin:24px 0 12px;color:#1a1a1a">Часто задаваемые вопросы</h3>
  <div style="display:flex;flex-wrap:wrap;gap:0 40px"><div style="flex:1;min-width:280px">${col1}</div><div style="flex:1;min-width:280px">${col2}</div></div>`;

  const style = SEO_STYLE;
  const callout = `<div class="smk-callout"><p><strong>Кратко:</strong> ${esc(topic)} — премиальные материалы (${esc(woods[0])}, ${esc(upholstery[0])}), наполнение (${esc(fillings[0])}, ${esc(fillings[1])}), изготовление на заказ, доставка по РФ и официальная гарантия.</p></div>`;
  return `${style}<section data-seomarket="content" class="smk-seo">
  <div class="smk-kicker">Каталог · Экспертный гид</div>
  <h2>${esc(topic)}: материалы, механизмы и как выбрать</h2>
  ${intro}
  ${callout}
  <details data-seomarket="more" class="smk-more"><summary>Читать полностью ▾</summary>${full}</details>
  </section>`;
}

// (старый contentBlock ниже не используется)
function contentBlockOld(topic) {
  const tl = topic.toLowerCase();
  const faqs = [
    [`Как выбрать «${tl}»?`, `Отталкивайтесь от площади помещения, стиля интерьера и сценариев использования. Оцените материал, габариты, эргономику и наличие нужных механизмов. Наши консультанты помогут подобрать «${tl}» под ваш бюджет и задачи.`],
    ['Из каких материалов изготовлены изделия?', 'В ассортименте — массив дерева, МДФ, ЛДСП, качественный текстиль и экокожа. Все материалы сертифицированы, безопасны и устойчивы к ежедневной эксплуатации.'],
    ['Сколько стоит доставка?', 'Доставка осуществляется по городу и в регионы России. Точная стоимость зависит от габаритов и адреса и рассчитывается при оформлении заказа; возможны подъём и сборка.'],
    ['Действует ли гарантия?', 'Да, на всю продукцию распространяется официальная гарантия производителя. Срок и условия указаны в карточке товара и сопроводительных документах.'],
    ['Можно ли заказать по индивидуальным размерам?', 'Да, доступно изготовление на заказ — по вашим размерам, цвету и конфигурации. Это удобно для нестандартных помещений и единых интерьерных решений.'],
    ['Какие способы оплаты доступны?', 'Принимаем наличный и безналичный расчёт, оплату банковской картой и рассрочку. Для юридических лиц возможна оплата по счёту с закрывающими документами.'],
    ['Как оформить заказ?', 'Добавьте товар в корзину или свяжитесь с менеджером по телефону либо через форму на сайте — поможем с выбором, рассчитаем стоимость и оформим заказ.'],
    ['Есть ли самовывоз и шоурум?', 'Да, доступен самовывоз со склада, а ознакомиться с моделями вживую можно в шоуруме. Адреса и режим работы уточняйте у менеджера или в разделе «Контакты».'],
  ];
  const td = 'border:1px solid #ddd;padding:9px 13px;text-align:left;font-size:14px';
  const th = td + ';background:#f5f5f5;font-weight:600';
  const faqItem = ([q, a]) => `<details style="border-bottom:1px solid #eee;padding:9px 0"><summary style="cursor:pointer;font-weight:600;color:#1a1a1a">${esc(q)}</summary><p style="margin:7px 0 0;color:#555">${esc(a)}</p></details>`;
  const col1 = faqs.slice(0, 4).map(faqItem).join('');
  const col2 = faqs.slice(4, 8).map(faqItem).join('');
  return `<section data-seomarket="content" style="max-width:1100px;margin:40px auto;padding:28px 16px;border-top:2px solid #eee;font-family:Arial,Helvetica,sans-serif;line-height:1.7;color:#333">
  <h2 style="font-size:25px;margin:0 0 16px;color:#1a1a1a">${esc(topic)}: как выбрать и купить выгодно</h2>
  <p>Раздел «${esc(topic)}» — это тщательно подобранный ассортимент для тех, кто ценит качество, комфорт и продуманный дизайн. Мы помогаем оформить интерьер целостно: от отдельных предметов до комплексных решений под конкретное помещение, стиль и бюджет.</p>
  <p>При производстве используются проверенные материалы и фурнитура надёжных поставщиков, поэтому изделия сохраняют внешний вид и функциональность долгие годы. Грамотный подбор «${tl}» по габаритам, эргономике и материалам напрямую влияет на удобство ежедневного использования.</p>
  <p>Покупая у нас, вы получаете честные цены без переплат, профессиональную консультацию и доставку по всей России. Менеджеры подскажут оптимальные модели под вашу задачу, рассчитают стоимость с доставкой и сборкой и помогут оформить заказ удобным способом.</p>
  <p>Если у вас нестандартное помещение или особые требования к дизайну — доступно изготовление на заказ по индивидуальным размерам и конфигурации. Это позволяет получить идеально подходящее решение и единый стиль во всём интерьере.</p>
  <h3 style="font-size:19px;margin:24px 0 8px;color:#1a1a1a">Ключевые параметры выбора</h3>
  <table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr><th style="${th}">Параметр</th><th style="${th}">На что обратить внимание</th><th style="${th}">Почему важно</th></tr></thead><tbody>
  <tr><td style="${td}">Материал</td><td style="${td}">Массив, МДФ, ЛДСП, текстиль</td><td style="${td}">Долговечность и внешний вид</td></tr>
  <tr><td style="${td}">Габариты</td><td style="${td}">Соответствие площади</td><td style="${td}">Удобство и эргономика</td></tr>
  <tr><td style="${td}">Функциональность</td><td style="${td}">Механизмы, хранение</td><td style="${td}">Практичность в быту</td></tr>
  <tr><td style="${td}">Гарантия</td><td style="${td}">Срок и условия</td><td style="${td}">Спокойствие покупателя</td></tr></tbody></table>
  <h3 style="font-size:19px;margin:24px 0 8px;color:#1a1a1a">Доставка, сборка и оплата</h3>
  <table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr><th style="${th}">Услуга</th><th style="${th}">Условия</th></tr></thead><tbody>
  <tr><td style="${td}">Доставка</td><td style="${td}">По городу и в регионы РФ, расчёт при оформлении</td></tr>
  <tr><td style="${td}">Подъём и сборка</td><td style="${td}">Профессиональная бригада, по договорённости</td></tr>
  <tr><td style="${td}">Оплата</td><td style="${td}">Наличные, карта, рассрочка, по счёту для юрлиц</td></tr>
  <tr><td style="${td}">Изготовление на заказ</td><td style="${td}">Индивидуальные размеры и конфигурация</td></tr></tbody></table>
  <h3 style="font-size:19px;margin:24px 0 12px;color:#1a1a1a">Часто задаваемые вопросы</h3>
  <div style="display:flex;flex-wrap:wrap;gap:0 40px">
    <div style="flex:1;min-width:280px">${col1}</div>
    <div style="flex:1;min-width:280px">${col2}</div>
  </div>
  </section>`;
}

// Гарантируем валидную структуру head/body на ЛЮБОМ сайте — иначе SEO-теги некуда вставлять.
function ensureStructure(html) {
  if (!/<head[\s>]/i.test(html)) {
    if (/<html[^>]*>/i.test(html)) html = html.replace(/(<html[^>]*>)/i, '$1\n<head></head>');
    else if (/<body[\s>]/i.test(html)) html = html.replace(/(<body[^>]*>)/i, '<head></head>\n$1');
    else html = '<head></head>\n' + html;
  }
  if (!/<\/head>/i.test(html)) {
    if (/<body[\s>]/i.test(html)) html = html.replace(/(<body[\s>])/i, '</head>\n$1');
    else html = html.replace(/(<head[^>]*>)/i, '$1</head>');
  }
  if (!/<body[\s>]/i.test(html)) html = /<\/head>/i.test(html) ? html.replace(/(<\/head>)/i, '$1\n<body>') : html + '\n<body>';
  if (!/<\/body>/i.test(html)) html = /<\/html>/i.test(html) ? html.replace(/(<\/html>)/i, '</body>\n$1') : html + '\n</body>';
  return html;
}

// Чистый текст первого осмысленного абзаца (для description-фолбэка).
function firstParagraph(html) {
  for (const m of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (t.length >= 60) return t.slice(0, 300);
  }
  return '';
}

function seoFix(pageUrl, html) {
  html = ensureStructure(html);
  let title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || '';
  if (!title) {
    // Уникальный title при отсутствии: имя из тела (рус.) → из URL-слага → запасной вариант (НЕ общий «Каталог»).
    const fromBody = (tag(html, /<div class="good-popup-name">[«"]?([^«»"<]{3,90})/i)
      || tag(html, /<h1[^>]*>([^<]{3,90})<\/h1>/i)
      || tag(html, /<h2[^>]*>([^<]{3,90})<\/h2>/i) || '').replace(/[«»"]/g, '').replace(/\s+/g, ' ').trim();
    let seg = '';
    try { seg = decodeURIComponent((new URL(pageUrl).pathname.replace(/\/+$/, '').split('/').pop()) || '').replace(/-[a-z0-9]{1,8}$/i, '').replace(/[-_]+/g, ' ').trim(); } catch {}
    title = fromBody || (seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : 'Каталог');
    html = html.replace(/<head([^>]*)>/i, `<head$1><title>${esc(title)}</title>`);
  } else if (title.length > 65) html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(shortenTitle(title))}</title>`);
  const topic = (title.split(/[—|–\-,]/)[0] || 'Каталог').trim() || 'Каталог';
  if (!/<meta[^>]+name=["']description["']/i.test(html)) {
    const fp = firstParagraph(html);
    const dsc = (fp ? `${topic} — ${fp}` : `${topic} — каталог, цены, доставка.`).slice(0, 200);
    html = html.replace(/<\/title>/i, `</title>\n<meta name="description" content="${esc(dsc)}">`);
  }
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) html = html.replace(/<\/head>/i, `<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>`);
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) html = html.replace(/<\/head>/i, `<link rel="canonical" href="${esc(pageUrl)}">\n</head>`);
  if (!/<meta[^>]+property=["']og:/i.test(html)) html = html.replace(/<\/head>/i, `<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:url" content="${esc(pageUrl)}">\n</head>`);
  if (!/application\/ld\+json/i.test(html)) html = html.replace(/<\/head>/i, `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: topic, item: pageUrl }] })}</script>\n</head>`);
  // H1 (sr-only, accessibility-стандарт, НЕ клоакинг -9999px) только при отсутствии, идемпотентно
  if ((html.match(/<h1[\s>]/gi) || []).length === 0 && !/data-seomarket="h1"/.test(html)) {
    html = html.replace(/<body([^>]*)>/i, `<body$1><h1 data-seomarket="h1" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${esc(topic)}</h1>`);
  }
  // Оптимизация картинок: описательный alt (image SEO) + lazy + async. Для товара — название + материал/размеры.
  let altBase = topic;
  if (isProduct(pageUrl)) {
    const rs = parseSpecs(html);
    const extra = [rs.material, ...rs.dims.slice(0, 2)].filter(Boolean).join(', ');
    if (extra) altBase = `${topic} — ${extra}`.slice(0, 120);
  }
  let imgIdx = 0;
  html = html.replace(/<img\b([^>]*)>/gi, (m, attrs) => {
    imgIdx++;
    let out = attrs;
    // alt при отсутствии/пустом
    if (!/\balt\s*=\s*["'][^"']*\S[^"']*["']/i.test(out)) {
      const src = (out.match(/\bsrc=["']([^"']+)["']/i) || [, ''])[1];
      let name = src.split('/').pop().split('?')[0].replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
      if (/^[a-f0-9]{4,}$/i.test(name) || name.length < 3) name = '';
      out = out.replace(/\s*\balt\s*=\s*["'][^"']*["']/i, '') + ` alt="${esc(altBase + (name ? ' — ' + name : ''))}"`;
    }
    // lazy/async (первая картинка — eager, она обычно LCP); не дублируем, если уже задано
    if (!/\bloading\s*=/i.test(out)) out += imgIdx <= 1 ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
    if (!/\bdecoding\s*=/i.test(out)) out += ' decoding="async"';
    return `<img${out}>`;
  });
  // Вставка контента, идемпотентно.
  //  • Товар: продолжаем РОДНОЕ описание под картинкой (с реальными данными) + SEO-текст внизу (в seo-text-box).
  //  • Категория: SEO-текст внизу (в seo-text-box, иначе перед </body>).
  if (!/data-seomarket="content"/.test(html) && !/data-seomarket="desc"/.test(html)) {
    if (isProduct(pageUrl)) {
      const real = parseSpecs(html);
      const cont = productContinuation(topic, real, pageUrl);
      if (/<h2>\s*Описание\s*<\/h2>\s*<p>[\s\S]*?<\/p>/i.test(html)) html = html.replace(/(<h2>\s*Описание\s*<\/h2>\s*<p>[\s\S]*?<\/p>)/i, `$1${cont}`);
      else if (/<h2>\s*Характеристики\s*<\/h2>/i.test(html)) html = html.replace(/(<h2>\s*Характеристики\s*<\/h2>)/i, `${cont}$1`);
      else html = injectIntoSeoBox(html, cont);
      html = injectIntoSeoBox(html, contentBlock(catTopic(pageUrl), html, pageUrl));
    } else {
      html = injectIntoSeoBox(html, contentBlock(topic, html, pageUrl));
    }
  }
  return html;
}

// Кладём блок в родной seo-text-box (перед футером); если его нет — перед </body>.
function injectIntoSeoBox(html, block) {
  if (/<div class="seo-text-box">/.test(html)) return html.replace(/<div class="seo-text-box">/, `<div class="seo-text-box">${block}`);
  return html.replace(/<\/body>/i, `${block}\n</body>`);
}

// Переписываем ссылку: resolve относительно pageUrl, если наш хост — на демо-абсолютный локальный путь
// Не-навигационные/потенциально опасные схемы — пропускаем (сравнение без учёта регистра).
const SKIP_SCHEMES = new Set(['javascript', 'vbscript', 'data', 'blob', 'mailto', 'tel', 'about']);
function rewriteRef(ref, pageUrl) {
  const t = ref.trim();
  if (!t || t.startsWith('#')) return null;
  const scheme = (t.match(/^([a-z][a-z0-9+.-]*):/i) || [, ''])[1].toLowerCase();
  if (SKIP_SCHEMES.has(scheme)) return null;
  let abs; try { abs = new URL(t, pageUrl).toString(); } catch { return null; }
  if (!sameHost(abs)) {
    // внешние ассеты: апгрейд http→https, оставляем как есть
    return abs.replace(/^http:\/\//i, 'https://');
  }
  const rel = mapAsset(abs);
  return DEMO + rel;
}

// Переписываем НАВИГАЦИОННУЮ <a>-ссылку: наш хост (вкл. www) → на DEMO-страницу; внешние оставляем.
function rewritePageLink(href, pageUrl) {
  const t = href.trim();
  if (!t || t.startsWith('#')) return null;
  const scheme = (t.match(/^([a-z][a-z0-9+.-]*):/i) || [, ''])[1].toLowerCase();
  if (SKIP_SCHEMES.has(scheme)) return null;
  let abs; try { abs = new URL(t, pageUrl).toString(); } catch { return null; }
  if (!sameHost(abs)) return abs.replace(/^http:\/\//i, 'https://'); // внешняя ссылка — не трогаем (только https)
  const u = new URL(abs);
  return DEMO + u.pathname.replace(/^\/+/, '') + (u.hash || ''); // без query, локально на демо
}

function processHtmlRefs(html, pageUrl) {
  // lazy-load: поднимаем data-src/data-original/data-lazy-src → src, data-srcset → srcset
  // (реальный src ставит JS оригинала, которого офлайн нет → без этого картинки не появятся)
  html = html.replace(/\bdata-(?:src|original|lazy-src)=(["'])([^"']+)\1/gi, (m, q, u) => `src=${q}${u}${q} data-was-lazy="1"`);
  html = html.replace(/\bdata-srcset=(["'])([^"']+)\1/gi, (m, q, u) => `srcset=${q}${u}${q}`);
  // ассеты (img/script/source/link) src/href → локальные демо-пути
  html = html.replace(/(<(?:img|script|source|link)\b[^>]*?\b(?:src|href)=)(["'])([^"']+)\2/gi, (m, pre, q, url) => {
    const nu = rewriteRef(url, pageUrl); return nu ? `${pre}${q}${nu}${q}` : m;
  });
  // навигационные <a href> → на DEMO-страницы (чтобы не уводило на исходный сайт)
  html = html.replace(/(<a\b[^>]*?\bhref=)(["'])([^"']+)\2/gi, (m, pre, q, url) => {
    const nu = rewritePageLink(url, pageUrl); return nu ? `${pre}${q}${nu}${q}` : m;
  });
  // srcset
  html = html.replace(/\bsrcset=(["'])([^"']+)\1/gi, (m, q, val) => {
    const fixed = val.split(',').map((part) => { const [u, d] = part.trim().split(/\s+/); const nu = rewriteRef(u, pageUrl); return (nu || u) + (d ? ' ' + d : ''); }).join(', ');
    return `srcset=${q}${fixed}${q}`;
  });
  // inline style url()
  html = html.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, q, url) => { const nu = rewriteRef(url, pageUrl); return nu ? `url(${q}${nu}${q})` : m; });
  return html;
}

async function pool(items, n, fn) { let i = 0, done = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { await fn(items[i++]); if (++done % 30 === 0) log(`  ${done}/${items.length}`); } })); }

(async () => {
  let urls;
  const urlsOpt = getOpt('--urls', '');
  if (urlsOpt) {
    // Явный список URL (через запятую) — для демо конкретных страниц (категории + карточки товаров)
    urls = urlsOpt.split(',').map((u) => rebind(u.trim())).filter(Boolean);
    urls = Array.from(new Set(urls)).slice(0, MAX);
  } else {
    const sm = await fetchRaw(new URL('sitemap.xml', base).toString());
    urls = Array.from(sm.buf.toString().matchAll(/<loc>(.*?)<\/loc>/g), (m) => rebind(m[1].trim())).filter(Boolean);
    urls = Array.from(new Set(urls)).slice(0, MAX);
  }
  const ASSET_RE = /\.(jpe?g|png|gif|webp|svg|css|js|mjs|woff2?|ttf|eot|ico|pdf|zip|rar|7z|mp4|webm|avi|mov|xml|json|txt)(\?|$)/i;
  urls = urls.filter((u) => !ASSET_RE.test(u));
  if (!urls.length) urls = [START];

  // 1) BFS-обход: seed из sitemap + переход по внутренним <a>-ссылкам → клонируем ВСЕ достижимые страницы.
  //    Дедуп по path (без query — фильтры/варианты схлопываются в каноническую страницу). Отключается --no-bfs.
  const BFS = process.argv.indexOf('--no-bfs') < 0;
  const seen = new Set(); const queue = [];
  const pathKey = (u) => { try { return new URL(u).pathname.replace(/\/+$/, '') || '/'; } catch { return u; } };
  const enqueue = (href, from) => {
    let abs; try { abs = new URL(href, from || base).toString(); } catch { return; }
    if (!sameHost(abs) || /[?#]/.test(abs) || ASSET_RE.test(abs)) return;
    const r = rebind(abs); if (!r) return;
    const k = pathKey(r); if (seen.has(k)) return; seen.add(k); queue.push(r);
  };
  for (const u of urls) enqueue(u, base);
  // Доп-seed: страницы, на которые ссылаются наши SEO-тексты (могут не быть в sitemap/ссылках сайта).
  for (const p of ['contacts', 'about', 'projects', 'catalog/spalni', 'catalog/gostinye', 'catalog/myagkaya-mebel']) enqueue(p, base);
  log(`Seed-страниц: ${queue.length} (sitemap+доп), BFS=${BFS ? 'вкл' : 'выкл'}`);

  let brokenSrc = 0; const brokenList = []; let processed = 0;
  while (queue.length && processed < MAX) {
    const batch = queue.splice(0, CONC);
    await Promise.all(batch.map(async (u) => {
      const r = await fetchRaw(u);
      if (r.status < 200 || r.status >= 400) { log(`  ✗ ${u} (${r.status})`); return; }
      const raw = r.buf.toString('utf8');
      if (/Fatal error|Uncaught exception|such alias does not exist/i.test(raw) || (!/<\/head>/i.test(raw) && raw.length < 2500)) {
        brokenSrc++; if (brokenList.length < 1000) brokenList.push(u); return; // битая страница источника — не клонируем
      }
      // BFS: ставим в очередь внутренние ссылки ДО переписывания (из сырого html)
      if (BFS && processed < MAX) for (const m of raw.matchAll(/<a\b[^>]*?\bhref=["']([^"'#]+)["']/gi)) enqueue(m[1], u);
      let html = seoFix(u, raw);
      html = processHtmlRefs(html, u);
      const pu = new URL(u); let p = pu.pathname.replace(/^\/+/, ''); if (p === '' || p.endsWith('/')) p += 'index.html'; else if (!/\.html?$/i.test(p)) p += '/index.html';
      const out = path.join(OUT, p); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
      processed++;
    }));
    if (processed % 100 < CONC) log(`  обход: сохранено ${processed}, в очереди ${queue.length}`);
  }
  log(`Всего сохранено страниц: ${processed}`);
  if (brokenSrc) { try { fs.writeFileSync(path.join(OUT, '_broken-source-pages.json'), JSON.stringify({ count: brokenSrc, urls: brokenList }, null, 2)); } catch {} log(`Битых страниц источника пропущено: ${brokenSrc}`); }

  // 1b) Дедуп title: товары-варианты с ОДИНАКОВЫМ названием → вставляем артикул из URL (+счётчик-гарант).
  {
    const walkH = (d, acc = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walkH(p, acc); else if (/\.html?$/i.test(e.name)) acc.push(p); } return acc; };
    const htmls = walkH(OUT);
    const groups = {};
    for (const f of htmls) { const t = ((fs.readFileSync(f, 'utf8').match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1] || '').replace(/\s+/g, ' ').trim(); (groups[t] = groups[t] || []).push(f); }
    const seen = new Set();
    for (const [t, files] of Object.entries(groups)) if (t && files.length === 1) seen.add(t); // уникальные резервируем
    let deduped = 0;
    // Вставка различителя: перед " | " (если есть) либо в конец; артикул из последнего сегмента URL.
    const insert = (title, suf) => title.includes(' | ') ? title.replace(' | ', ` ${suf} | `) : `${title} — ${suf}`;
    for (const [t, files] of Object.entries(groups)) {
      if (!t || files.length < 2) continue;
      for (const f of files) {
        const seg = (path.relative(OUT, f).replace(/[\\/]index\.html?$/i, '').split(/[\\/]/).pop() || '');
        const code = (seg.match(/(\d[a-z0-9_-]*)$/i) || [, ''])[1] || (seg.match(/[-_]([a-z0-9]{2,14})$/i) || [, ''])[1] || seg.replace(/[-_]+/g, ' ').trim();
        let cand = shortenTitle(insert(t, code)); let k = 1;
        while (seen.has(cand) && k < 60) cand = shortenTitle(insert(t, `${code} ${++k}`));
        if (seen.has(cand)) cand = `${code}-${deduped + 1} ${t}`.slice(0, 64); // фолбэк: уникальный префикс
        seen.add(cand);
        let h = fs.readFileSync(f, 'utf8');
        h = h.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(cand)}</title>`)
             .replace(/(<meta[^>]+property=["']og:title["'][^>]+content=["'])[^"']*(["'])/i, `$1${esc(cand)}$2`);
        fs.writeFileSync(f, h); deduped++;
      }
    }
    if (deduped) log(`Дедуп title: уникализировано ${deduped} страниц`);
  }
  log(`Ассетов к скачиванию: ${assetMap.size}`);

  // 2) скачиваем ассеты
  await pool([...assetMap.keys()], CONC, async (absUrl) => {
    const rel = assetMap.get(absUrl); const out = path.join(OUT, rel);
    if (fs.existsSync(out)) return;
    const r = await fetchRaw(absUrl); if (r.status < 200 || r.status >= 400 || !r.buf.length) return;
    fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, r.buf);
  });

  // 3) обрабатываем скачанные CSS: их url() → демо-абсолютные, докачиваем
  const cssUrls = [...assetMap.entries()].filter(([, rel]) => rel.endsWith('.css'));
  for (const [absUrl, rel] of cssUrls) {
    const out = path.join(OUT, rel); if (!fs.existsSync(out)) continue;
    let css = fs.readFileSync(out, 'utf8');
    css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, q, url) => { const nu = rewriteRef(url, absUrl); return nu ? `url(${q}${nu}${q})` : m; });
    css = css.replace(/@import\s+(['"])([^'"]+)\1/gi, (m, q, url) => { const nu = rewriteRef(url, absUrl); return nu ? `@import ${q}${nu}${q}` : m; });
    fs.writeFileSync(out, css);
  }
  // докачиваем новые (из CSS) ассеты
  await pool([...assetMap.keys()].filter((u) => !fs.existsSync(path.join(OUT, assetMap.get(u)))), 8, async (absUrl) => {
    const out = path.join(OUT, assetMap.get(absUrl)); const r = await fetchRaw(absUrl); if (r.status >= 200 && r.status < 400 && r.buf.length) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, r.buf); }
  });

  // 4) Адаптивные картинки: WebP (главный + варианты srcset 480/768/1200) + width/height (анти-CLS).
  //    Ссылки → .webp, <img> получают srcset/sizes/width/height. Отключается --no-img-opt.
  let imgOpt = { files: 0, converted: 0, variants: 0, before: 0, after: 0 };
  if (process.argv.indexOf('--no-img-opt') < 0) {
    const cp = require('child_process');
    const hasCwebp = (() => { try { cp.execFileSync('cwebp', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();
    const hasIdentify = (() => { try { cp.execFileSync('magick', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();
    if (hasCwebp) {
      const pexec = require('util').promisify(cp.execFile);
      const walk = (d, acc = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, acc); else acc.push(p); } return acc; };
      const dims = async (f) => { if (!hasIdentify) return [0, 0]; try { const { stdout } = await pexec('magick', ['identify', '-format', '%w %h', f + '[0]']); return stdout.trim().split(/\s+/).map(Number); } catch { return [0, 0]; } };
      const imgs = walk(OUT).filter((f) => /\.(jpe?g|png)$/i.test(f));
      imgOpt.files = imgs.length;
      const Q = Number(getOpt('--img-quality', 80));
      const SIZES = [480, 768, 1200];
      const MAX_DIM = Number(getOpt('--img-max', 1600));
      const IMG_CONC = Number(getOpt('--img-concurrency', Math.min(6, Math.max(2, require('os').cpus().length - 2))));
      const manifest = {}; // relNoExt -> {w,h, main, srcset:[[w,rel],...]}
      let imgDone = 0;
      // Параллельная конвертация (пул воркеров cwebp) — главный ускоритель полного прогона.
      await pool(imgs, IMG_CONC, async (f) => {
        const relNoExt = path.relative(OUT, f).replace(/\.(jpe?g|png)$/i, '');
        const wf = path.join(OUT, relNoExt + '.webp');
        let ob = 0; try { ob = fs.statSync(f).size; } catch {}
        imgOpt.before += ob;
        const [W, H] = await dims(f);
        const mainArgs = ['-quiet', '-q', String(Q)];
        if (W > MAX_DIM) mainArgs.push('-resize', String(MAX_DIM), '0');
        try { await pexec('cwebp', [...mainArgs, f, '-o', wf]); } catch {}
        let nb = 0; try { nb = fs.existsSync(wf) ? fs.statSync(wf).size : 0; } catch {}
        if (++imgDone % 50 === 0) log(`  webp ${imgDone}/${imgs.length}`);
        if (!(nb > 0 && nb < ob)) { if (nb > 0) { try { fs.unlinkSync(wf); } catch {} } imgOpt.after += ob; return; }
        imgOpt.after += nb; imgOpt.converted++;
        const mainW = W > MAX_DIM ? MAX_DIM : (W || 0);
        const srcset = [];
        for (const s of SIZES) {
          if (W && s < W && s < mainW) {
            const vrel = `${relNoExt}-${s}w.webp`; const vout = path.join(OUT, vrel);
            try { await pexec('cwebp', ['-quiet', '-q', String(Q), '-resize', String(s), '0', f, '-o', vout]); imgOpt.variants++; srcset.push([s, vrel]); } catch {}
          }
        }
        srcset.push([mainW || (SIZES[SIZES.length - 1]), relNoExt + '.webp']);
        manifest[relNoExt] = { w: W, h: H, main: relNoExt + '.webp', srcset };
      });
      // переписываем HTML: <img> → webp src + srcset/sizes/width/height; затем общий своп .png/.jpg→.webp
      const DESC = DEMO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reExt = new RegExp('(' + DESC + '[^"\'\\s)]+?)\\.(png|jpe?g)\\b', 'gi');
      const relOf = (url) => { try { return decodeURIComponent(url.slice(DEMO.length)); } catch { return url.slice(DEMO.length); } };
      // Глобальный og:image по умолчанию (для страниц вообще без картинок) — самый «широкий» webp (обычно лого/баннер).
      const globalOg = (Object.values(manifest).sort((a, b) => (b.w || 0) - (a.w || 0))[0] || {}).main || '';
      for (const tf of walk(OUT).filter((x) => /\.html?$/i.test(x))) {
        let c = fs.readFileSync(tf, 'utf8');
        let bestImg = null; // самая крупная картинка страницы (для Product/ImageObject)
        c = c.replace(/<img\b[^>]*>/gi, (tag) => {
          const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1];
          if (!src || src.indexOf(DEMO) !== 0) return tag;
          const info = manifest[relOf(src).replace(/\.(png|jpe?g|webp)$/i, '')];
          if (!info) return tag;
          if (!bestImg || (info.w || 0) > (bestImg.w || 0)) bestImg = info;
          let t = tag.replace(/\bsrc=["'][^"']+["']/i, `src="${DEMO}${info.main}"`);
          if (info.srcset.length > 1 && !/\bsrcset=/i.test(t)) {
            const ss = info.srcset.map(([w, rel]) => `${DEMO}${rel} ${w}w`).join(', ');
            t = t.replace(/<img/i, `<img srcset="${ss}" sizes="(max-width:768px) 100vw, 1200px"`);
          }
          if (info.w && info.h && !/\bwidth=/i.test(t)) t = t.replace(/<img/i, `<img width="${info.w}" height="${info.h}"`);
          return t;
        });
        c = c.replace(reExt, (m, baseUrl) => fs.existsSync(path.join(OUT, relOf(baseUrl) + '.webp')) ? baseUrl + '.webp' : m);
        // Product/ImageObject JSON-LD для карточек товара (/catalog/cat/slug/index.html)
        const rp = tf.replace(/\\/g, '/');
        if (/\/catalog\/[^/]+\/[^/]+\/index\.html$/i.test(rp) && bestImg && !/"@type":"Product"/.test(c)) {
          const m2 = rp.match(/\/catalog\/[^/]+\/([^/]+)\/index\.html$/i);
          const brand = (m2 ? (m2[1].split('-')[1] || '') : '').replace(/^./, (x) => x.toUpperCase());
          const name = ((c.match(/<title[^>]*>([^<]+)/i) || [, ''])[1].split(/[—|–\-,]/)[0] || 'Товар').trim();
          const ld = { '@context': 'https://schema.org', '@type': 'Product', name, image: [DEMO + bestImg.main], ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}) };
          c = c.replace(/<\/body>/i, `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n</body>`);
        }
        // og:image (абсолютный webp) — для соцсетей и SEO; bestImg, иначе глобальный фолбэк; гарантируем на КАЖДОЙ странице
        const ogMain = (bestImg && bestImg.main) || globalOg;
        if (ogMain && !/property=["']og:image["']/i.test(c)) c = c.replace(/<\/head>/i, `<meta property="og:image" content="${DEMO}${ogMain}">\n</head>`);
        fs.writeFileSync(tf, c);
      }
      // CSS: фоновые url() → webp
      for (const tf of walk(OUT).filter((x) => /\.css$/i.test(x))) {
        let c = fs.readFileSync(tf, 'utf8'); let changed = false;
        c = c.replace(reExt, (m, baseUrl) => { if (fs.existsSync(path.join(OUT, relOf(baseUrl) + '.webp'))) { changed = true; return baseUrl + '.webp'; } return m; });
        if (changed) fs.writeFileSync(tf, c);
      }

      // 4b) Говорящие имена webp (image SEO): хеш-файлы → слаг из alt (транслит). Переименовываем main+варианты, чинаем ссылки.
      if (process.argv.indexOf('--no-rename-img') < 0) {
        const RU = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
        const slugify = (s) => (s || '').toLowerCase().split('').map((c) => (RU[c] !== undefined ? RU[c] : c)).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
        // alt по каждому webp (берём самый длинный)
        const altByRel = {};
        for (const tf of walk(OUT).filter((x) => /\.html?$/i.test(x))) {
          const c = fs.readFileSync(tf, 'utf8');
          for (const im of c.matchAll(/<img\b[^>]*>/gi)) {
            const src = (im[0].match(/\bsrc=["']([^"']+)["']/i) || [])[1];
            if (!src || src.indexOf(DEMO) !== 0 || !/\.webp$/i.test(src)) continue;
            const rel = relOf(src); const alt = (im[0].match(/\balt=["']([^"']*)["']/i) || [, ''])[1];
            if (alt && (!altByRel[rel] || alt.length > altByRel[rel].length)) altByRel[rel] = alt;
          }
        }
        const used = new Set(); const refMap = {}; let renamed = 0;
        for (const rel of Object.keys(altByRel)) {
          const base = path.basename(rel).replace(/\.webp$/i, ''); const dir = path.dirname(rel);
          if (!/^[a-f0-9]{4,}$/i.test(base) && !rel.startsWith('cloned-assets/')) continue; // только обезличенные/хеши
          let slug = slugify(altByRel[rel]) || 'image'; let cand = slug, n = 1;
          while (used.has(cand)) cand = `${slug}-${++n}`; used.add(cand);
          const oldBase = (dir === '.' ? '' : dir + '/') + base; const newBase = (dir === '.' ? '' : dir + '/') + cand;
          for (const suf of ['', '-480w', '-768w', '-1200w']) {
            const o = oldBase + suf + '.webp', nw = newBase + suf + '.webp';
            if (fs.existsSync(path.join(OUT, o))) { try { fs.renameSync(path.join(OUT, o), path.join(OUT, nw)); refMap[o] = nw; renamed++; } catch {} }
          }
        }
        if (Object.keys(refMap).length) {
          const reW = new RegExp('(' + DESC + ')([^"\'\\s)]+?\\.webp)', 'gi');
          for (const tf of walk(OUT).filter((x) => /\.(html?|css)$/i.test(x))) {
            let c = fs.readFileSync(tf, 'utf8'); let ch = false;
            c = c.replace(reW, (m, d, rel) => { let r; try { r = decodeURIComponent(rel); } catch { r = rel; } if (refMap[r]) { ch = true; return d + refMap[r]; } return m; });
            if (ch) fs.writeFileSync(tf, c);
          }
          log(`Говорящих имён webp: ${renamed} файлов`);
        }
      }
    } else { log('  (cwebp не найден — оптимизация картинок пропущена)'); }
  }

  // 5) Image sitemap — помогает индексации картинок в Google/Яндекс Картинках.
  try {
    const walkS = (d, acc = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walkS(p, acc); else if (/\.html?$/i.test(e.name)) acc.push(p); } return acc; };
    const entries = [];
    const allLocs = [];
    for (const f of walkS(OUT)) {
      const rel = path.relative(OUT, f).replace(/index\.html?$/i, '');
      allLocs.push(DEMO + rel);
      const c = fs.readFileSync(f, 'utf8'); const imgs = []; const seen = new Set();
      for (const m of c.matchAll(/<img\b[^>]*>/gi)) {
        const src = (m[0].match(/\bsrc=["']([^"']+)["']/i) || [, ''])[1];
        if (src.indexOf(DEMO) !== 0 || !/\.(webp|jpe?g|png)$/i.test(src) || seen.has(src)) continue;
        seen.add(src); imgs.push({ src, alt: (m[0].match(/\balt=["']([^"']*)["']/i) || [, ''])[1] });
      }
      if (imgs.length) entries.push({ loc: DEMO + rel, imgs: imgs.slice(0, 25) });
    }
    // Обычный sitemap.xml (все страницы, live-URL) — для отправки в Я.Вебмастер/Google Search Console.
    fs.writeFileSync(path.join(OUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + allLocs.sort().map((l) => `<url><loc>${esc(l)}</loc></url>`).join('\n') + '\n</urlset>');
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
      + entries.map((e) => `<url><loc>${esc(e.loc)}</loc>` + e.imgs.map((i) => `<image:image><image:loc>${esc(i.src)}</image:loc>${i.alt ? `<image:title>${esc(i.alt)}</image:title>` : ''}</image:image>`).join('') + '</url>').join('\n')
      + '\n</urlset>';
    fs.writeFileSync(path.join(OUT, 'sitemap-images.xml'), xml);
    log(`sitemap: ${allLocs.length} URL · image-sitemap: ${entries.length} страниц`);
  } catch (e) { log('sitemap пропущен: ' + e.message); }

  const saved = fs.existsSync(OUT) ? require('child_process').execSync(`find ${OUT} -type f | wc -l`).toString().trim() : '0';
  const kb = (n) => Math.round(n / 1024);
  console.log(JSON.stringify({ pages: processed, broken_source: brokenSrc, assets: assetMap.size, files: saved, img_opt: { files: imgOpt.files, converted: imgOpt.converted, variants: imgOpt.variants, kb_before: kb(imgOpt.before), kb_after: kb(imgOpt.after), saved_pct: imgOpt.before ? Math.round((1 - imgOpt.after / imgOpt.before) * 100) : 0 } }));
})();
