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
if (!START || !OUT || !process.argv[4]) { console.error('node scripts/site-clone.cjs <startUrl> <outDir> <demoBaseUrl> [--max N]'); process.exit(1); }

const ORIGIN = new URL(START).origin;
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
  const L = (href, t) => `<a href="${href}" style="color:#c0142b">${t}</a>`;

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
    ['Сколько стоит доставка и есть ли сборка?', `Доставка по городу и в регионы России, стоимость рассчитывается при оформлении. Доступны профессиональный подъём и сборка. Подробности — в разделе ${L((pageUrl ? '/dostavka-raschet' : '#'), 'доставки')}.`],
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

  const style = `<style>
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

function seoFix(pageUrl, html) {
  let title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || '';
  const topic = (title.split(/[—|–\-,]/)[0] || 'Каталог').trim() || 'Каталог';
  if (!title) { title = `${topic}`; html = html.replace(/<head([^>]*)>/i, `<head$1><title>${esc(title)}</title>`); }
  else if (title.length > 65) html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(shortenTitle(title))}</title>`);
  if (!/<meta[^>]+name=["']description["']/i.test(html)) html = html.replace(/<\/title>/i, `</title>\n<meta name="description" content="${esc(topic)} — каталог, цены, доставка.">`);
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) html = html.replace(/<\/head>/i, `<link rel="canonical" href="${esc(pageUrl)}">\n</head>`);
  if (!/<meta[^>]+property=["']og:/i.test(html)) html = html.replace(/<\/head>/i, `<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:url" content="${esc(pageUrl)}">\n</head>`);
  if (!/application\/ld\+json/i.test(html)) html = html.replace(/<\/head>/i, `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: topic, item: pageUrl }] })}</script>\n</head>`);
  // H1 (sr-only, accessibility-стандарт, НЕ клоакинг -9999px) только при отсутствии, идемпотентно
  if ((html.match(/<h1[\s>]/gi) || []).length === 0 && !/data-seomarket="h1"/.test(html)) {
    html = html.replace(/<body([^>]*)>/i, `<body$1><h1 data-seomarket="h1" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${esc(topic)}</h1>`);
  }
  // Оптимизация картинок (image SEO): добавляем alt тем <img>, где его нет/пустой
  html = html.replace(/<img\b([^>]*)>/gi, (m, attrs) => {
    if (/\balt\s*=\s*["'][^"']*\S[^"']*["']/i.test(attrs)) return m; // уже есть непустой alt
    const src = (attrs.match(/\bsrc=["']([^"']+)["']/i) || [, ''])[1];
    let name = src.split('/').pop().split('?')[0].replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
    if (/^[a-f0-9]{8,}$/i.test(name) || name.length < 3) name = '';
    const alt = esc(topic + (name ? ' — ' + name : ''));
    const cleaned = attrs.replace(/\s*\balt\s*=\s*["'][^"']*["']/i, '');
    return `<img${cleaned} alt="${alt}">`;
  });
  // Контент-блок (уникальный SEO-текст + таблицы + FAQ + перелинковка) перед </body>, идемпотентно
  if (!/data-seomarket="content"/.test(html)) {
    html = html.replace(/<\/body>/i, `${contentBlock(topic, html, pageUrl)}\n</body>`);
  }
  return html;
}

// Переписываем ссылку: resolve относительно pageUrl, если наш хост — на демо-абсолютный локальный путь
function rewriteRef(ref, pageUrl) {
  const t = ref.trim();
  if (!t || t.startsWith('data:') || t.startsWith('#') || t.startsWith('mailto:') || t.startsWith('tel:') || t.startsWith('javascript:')) return null;
  let abs; try { abs = new URL(t, pageUrl).toString(); } catch { return null; }
  if (new URL(abs).origin !== ORIGIN) {
    // внешние ассеты: апгрейд http→https, оставляем как есть
    return abs.replace(/^http:\/\//i, 'https://');
  }
  const rel = mapAsset(abs);
  return DEMO + rel;
}

function processHtmlRefs(html, pageUrl) {
  // lazy-load: поднимаем data-src/data-original/data-lazy-src → src, data-srcset → srcset
  // (реальный src ставит JS оригинала, которого офлайн нет → без этого картинки не появятся)
  html = html.replace(/\bdata-(?:src|original|lazy-src)=(["'])([^"']+)\1/gi, (m, q, u) => `src=${q}${u}${q} data-was-lazy="1"`);
  html = html.replace(/\bdata-srcset=(["'])([^"']+)\1/gi, (m, q, u) => `srcset=${q}${u}${q}`);
  // src / href (кроме якорей навигации оставляем для ассетов; страничные ссылки тоже резолвим, но не качаем как ассет — пусть ведут на демо/оригинал)
  html = html.replace(/(<(?:img|script|source|link)\b[^>]*?\b(?:src|href)=)(["'])([^"']+)\2/gi, (m, pre, q, url) => {
    const nu = rewriteRef(url, pageUrl); return nu ? `${pre}${q}${nu}${q}` : m;
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
  if (!urls.length) urls = [START];
  log(`Страниц: ${urls.length}`);

  // 1) страницы: fetch → SEO-фикс → переписать ассеты → сохранить (конкурентно)
  await pool(urls, 6, async (u) => {
    const r = await fetchRaw(u);
    if (r.status < 200 || r.status >= 400) { log(`  ✗ ${u} (${r.status})`); return; }
    let html = seoFix(u, r.buf.toString('utf8'));
    html = processHtmlRefs(html, u);
    const pu = new URL(u); let p = pu.pathname.replace(/^\/+/, ''); if (p === '' || p.endsWith('/')) p += 'index.html'; else if (!/\.html?$/i.test(p)) p += '/index.html';
    const out = path.join(OUT, p); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
  });
  log(`Ассетов к скачиванию: ${assetMap.size}`);

  // 2) скачиваем ассеты
  await pool([...assetMap.keys()], 8, async (absUrl) => {
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

  const saved = fs.existsSync(OUT) ? require('child_process').execSync(`find ${OUT} -type f | wc -l`).toString().trim() : '0';
  console.log(JSON.stringify({ pages: urls.length, assets: assetMap.size, files: saved }));
})();
