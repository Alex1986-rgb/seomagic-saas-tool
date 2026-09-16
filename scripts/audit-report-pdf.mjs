#!/usr/bin/env node
/**
 * PDF-отчёт по аудиту в оформлении сайта.
 *
 * Данные берутся из базы проекта через Management API — те же, что видит
 * пользователь в интерфейсе, без пересчёта и без выдумывания.
 *
 * Запуск:
 *   node scripts/audit-report-pdf.mjs [--task <id>] [--out отчёт.pdf]
 *
 * Проект берётся из supabase/config.toml, токен — из окружения либо из
 * ~/.claude/secrets/supabase.env.
 */
import { jsPDF } from 'jspdf';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// Палитра сайта: те же токены, что в src/styles/variables.css.
const COLOR = {
  background: '#0B1020', // hsl(225 71% 8%)
  card: '#111936',
  cardEdge: '#1E2A4F',
  text: '#F7FAFC', // hsl(210 40% 98%)
  muted: '#93A1C4',
  accent: '#EC8B17', // hsl(30 85% 50%)
  good: '#22C55E',
  warn: '#F59E0B',
  bad: '#EF4444',
};

const SEVERITY = {
  high: { label: 'Критичные', genitive: 'критичных', color: COLOR.bad },
  medium: { label: 'Средние', genitive: 'средних', color: COLOR.warn },
  low: { label: 'Мелкие', genitive: 'мелких', color: COLOR.muted },
};

/** Русский счёт: 1 страница, 2 страницы, 5 страниц. */
function plural(n, [one, few, many]) {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

const pages = (n) => `${n} ${plural(Number(n), ['страница', 'страницы', 'страниц'])}`;

const ISSUE_TITLES = {
  slow_page: 'Медленная загрузка страницы',
  no_compression: 'Не включено сжатие ответа',
  missing_alt_text: 'Картинки без описания (alt)',
  high_ttfb: 'Долгий ответ сервера',
  short_description: 'Слишком короткое описание',
  long_description: 'Слишком длинное описание',
  long_title: 'Слишком длинный заголовок',
  missing_title: 'Нет заголовка страницы',
  missing_description: 'Нет описания страницы',
  missing_h1: 'Нет заголовка H1',
  thin_content: 'Мало текста на странице',
};

const ISSUE_ADVICE = {
  slow_page: 'Сжать изображения, включить кеширование, убрать лишние скрипты.',
  no_compression: 'Включить Gzip или Brotli на сервере — ответы станут в разы легче.',
  missing_alt_text: 'Добавить описания к картинкам: это и доступность, и поиск по картинкам.',
  high_ttfb: 'Ускорить ответ сервера: кеш, индексы в базе, лёгкие запросы.',
  short_description: 'Довести описание до 120–160 знаков.',
  long_description: 'Сократить описание до 120–160 знаков, иначе обрежется в выдаче.',
  long_title: 'Сократить заголовок до 50–60 знаков, иначе обрежется в выдаче.',
};

/**
 * Краулер и прайс называют одну и ту же беду по-разному: в замечаниях
 * `missing_alt_text`, в расценках `missing_image_alt`. Без этой сверки работы
 * молча выпадали бы из сметы.
 */
const PRICE_ALIASES = {
  missing_alt_text: 'missing_image_alt',
  empty_alt_text: 'empty_image_alt',
  broken_links: 'broken_link',
  page_not_indexable: 'not_indexable',
};

const CATEGORY_TITLES = {
  performance: 'Скорость и сервер',
  seo: 'Поисковая оптимизация',
  content: 'Содержание страниц',
  technical: 'Техническая часть',
  other: 'Прочие работы',
};

/** Кто исполнитель — это то, что клиент планирует в первую очередь. */
const CATEGORY_OWNERS = {
  performance: 'разработчик, системный администратор',
  seo: 'SEO-специалист',
  content: 'редактор, контент-менеджер',
  technical: 'разработчик',
  other: 'SEO-специалист',
};

// Знака рубля в системном Arial нет, поэтому пишем словом — иначе сумма
// выглядит просто числом.
const money = (value) => `${Math.round(value).toLocaleString('ru-RU')} руб.`;

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

/**
 * Доступы: из окружения, а если их там нет — из файла секретов рядом с
 * настройками Claude. Так отчёт собирается одной командой, без преамбулы
 * с экспортом переменных, и ключи по-прежнему лежат вне репозитория.
 */
function readSecretsFile() {
  const path = join(homedir(), '.claude/secrets/supabase.env');
  if (!existsSync(path)) return {};
  const values = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) values[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return values;
}

/** Ссылка на проект известна из конфигурации Supabase — спрашивать её незачем. */
function projectFromConfig() {
  const path = 'supabase/config.toml';
  if (!existsSync(path)) return null;
  const match = readFileSync(path, 'utf8').match(/^project_id\s*=\s*"([^"]+)"/m);
  return match ? match[1] : null;
}

const secrets = readSecretsFile();

async function query(sql) {
  const ref = arg('project', process.env.SUPABASE_PROJECT_REF || projectFromConfig());
  const token = process.env.SUPABASE_ACCESS_TOKEN || secrets.SUPABASE_ACCESS_TOKEN;
  if (!ref) throw new Error('Не понял, к какому проекту обращаться: укажите --project <ref>');
  if (!token) {
    throw new Error(
      'Нет доступа к базе: задайте SUPABASE_ACCESS_TOKEN или пропишите его '
      + 'в ~/.claude/secrets/supabase.env',
    );
  }
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) throw new Error(`База ответила ${res.status}: ${await res.text()}`);
  return await res.json();
}

/**
 * Кириллицу встроенные шрифты jsPDF не умеют, поэтому подкладываем системный.
 * Ищем по нескольким привычным путям, чтобы скрипт работал не только на этой машине.
 */
function loadFont(doc) {
  const candidates = [
    ['/System/Library/Fonts/Supplemental/Arial.ttf', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'],
    ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'],
    ['/Library/Fonts/Arial.ttf', '/Library/Fonts/Arial Bold.ttf'],
  ];
  for (const [regular, bold] of candidates) {
    if (!existsSync(regular) || !existsSync(bold)) continue;
    doc.addFileToVFS('report.ttf', readFileSync(regular).toString('base64'));
    doc.addFont('report.ttf', 'report', 'normal');
    doc.addFileToVFS('report-bold.ttf', readFileSync(bold).toString('base64'));
    doc.addFont('report-bold.ttf', 'report', 'bold');
    return true;
  }
  throw new Error('Не нашёл системный шрифт с кириллицей (Arial или DejaVu Sans)');
}

const W = 210; // A4, мм
const H = 297;
const M = 16; // поля

function paintBackground(doc) {
  doc.setFillColor(COLOR.background);
  doc.rect(0, 0, W, H, 'F');
}

function card(doc, x, y, w, h, radius = 3) {
  doc.setFillColor(COLOR.card);
  doc.setDrawColor(COLOR.cardEdge);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, radius, radius, 'FD');
}

function text(doc, value, x, y, { size = 10, color = COLOR.text, bold = false, align = 'left', maxWidth } = {}) {
  doc.setFont('report', bold ? 'bold' : 'normal');
  doc.setFontSize(size);
  doc.setTextColor(color);
  doc.text(String(value), x, y, { align, ...(maxWidth ? { maxWidth } : {}) });
}

function scoreColor(score) {
  if (score >= 80) return COLOR.good;
  if (score >= 60) return COLOR.warn;
  return COLOR.bad;
}

/** Полоса-индикатор: подпись слева, значение справа, шкала под ними. */
function scoreBar(doc, x, y, w, label, score) {
  text(doc, label, x, y, { size: 9, color: COLOR.muted });
  text(doc, `${score}/100`, x + w, y, { size: 9, bold: true, color: scoreColor(score), align: 'right' });
  doc.setFillColor(COLOR.cardEdge);
  doc.roundedRect(x, y + 2, w, 2.4, 1.2, 1.2, 'F');
  doc.setFillColor(scoreColor(score));
  doc.roundedRect(x, y + 2, Math.max((w * score) / 100, 2), 2.4, 1.2, 1.2, 'F');
}

function header(doc, site, dateLabel) {
  doc.setFillColor(COLOR.accent);
  doc.rect(0, 0, W, 1.6, 'F');
  text(doc, 'SeoMarket', M, 16, { size: 17, bold: true });
  text(doc, 'Отчёт по SEO-аудиту', M, 23, { size: 10, color: COLOR.muted });
  text(doc, site, W - M, 16, { size: 11, bold: true, color: COLOR.accent, align: 'right' });
  text(doc, dateLabel, W - M, 22, { size: 9, color: COLOR.muted, align: 'right' });
}

function footer(doc, page, total) {
  text(doc, 'seomarket.ru — аудит и оптимизация сайтов', M, H - 10, { size: 8, color: COLOR.muted });
  text(doc, `${page} / ${total}`, W - M, H - 10, { size: 8, color: COLOR.muted, align: 'right' });
}

/**
 * Смета из расценок проекта: сколько стоит закрыть каждую группу замечаний.
 * Работы, которых нет в прайсе, не выкидываем, а выносим отдельно — иначе
 * итог выглядел бы меньше, чем он есть.
 */
function buildEstimate(issues, priceRules) {
  const byType = new Map(priceRules.map((rule) => [rule.issue_type, rule]));
  const lines = [];
  const unpriced = [];

  for (const issue of issues) {
    const key = PRICE_ALIASES[issue.issue_type] ?? issue.issue_type;
    const rule = byType.get(key);
    const count = Number(issue.n);
    if (!rule) {
      unpriced.push({ ...issue, count });
      continue;
    }
    const unit = Number(rule.price_per_item);
    lines.push({
      category: rule.category ?? 'other',
      title: ISSUE_TITLES[issue.issue_type] ?? rule.rule_name ?? issue.issue_type,
      severity: issue.severity,
      count,
      unit,
      sum: unit * count,
    });
  }

  const groups = new Map();
  for (const line of lines) {
    if (!groups.has(line.category)) groups.set(line.category, []);
    groups.get(line.category).push(line);
  }
  for (const list of groups.values()) list.sort((a, b) => b.sum - a.sum);

  const total = lines.reduce((sum, line) => sum + line.sum, 0);
  return { groups, total, unpriced };
}

function buildDocument({ result, issues, priceRules, generatedAt }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  loadFont(doc);

  const estimate = buildEstimate(issues, priceRules);
  const site = String(result.url).replace(/^https?:\/\//, '').replace(/\/$/, '');
  const dateLabel = generatedAt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const global = Number(result.global_score ?? 0);

  // ---------- Страница 1: общая картина ----------
  paintBackground(doc);
  header(doc, site, dateLabel);

  // Крупная оценка и что она значит.
  card(doc, M, 30, W - 2 * M, 46);
  const cx = M + 30;
  const cy = 53;
  doc.setDrawColor(COLOR.cardEdge);
  doc.setLineWidth(3);
  doc.circle(cx, cy, 15, 'S');
  doc.setDrawColor(scoreColor(global));
  doc.setLineWidth(3);
  // Дуга рисуется отрезками: полнота круга — это и есть оценка.
  const SEGMENTS = 180;
  const steps = Math.max(1, Math.round((global / 100) * SEGMENTS));
  for (let i = 0; i < steps; i++) {
    const a1 = -Math.PI / 2 + (i / SEGMENTS) * 2 * Math.PI;
    const a2 = -Math.PI / 2 + ((i + 1) / SEGMENTS) * 2 * Math.PI;
    doc.line(cx + 15 * Math.cos(a1), cy + 15 * Math.sin(a1), cx + 15 * Math.cos(a2), cy + 15 * Math.sin(a2));
  }
  text(doc, global, cx, cy + 2, { size: 20, bold: true, align: 'center', color: scoreColor(global) });
  text(doc, 'из 100', cx, cy + 8, { size: 7, color: COLOR.muted, align: 'center' });

  const verdict = global >= 90 ? 'Сайт в хорошей форме'
    : global >= 70 ? 'Есть что улучшить'
    : 'Требуется серьёзная работа';
  text(doc, verdict, M + 55, 44, { size: 13, bold: true });
  text(doc, `Проверено: ${pages(result.page_count)}`, M + 55, 52, { size: 9, color: COLOR.muted });
  const total = issues.reduce((sum, i) => sum + Number(i.n), 0);
  text(doc, `Найдено замечаний: ${total}`, M + 55, 58, { size: 9, color: COLOR.muted });
  const high = issues.filter((i) => i.severity === 'high').reduce((s, i) => s + Number(i.n), 0);
  text(doc, high > 0 ? `Из них критичных: ${high}` : 'Критичных замечаний нет', M + 55, 64,
    { size: 9, color: high > 0 ? COLOR.bad : COLOR.good });
  text(doc, `Стоимость работ: ${money(estimate.total)}`, M + 55, 70, { size: 9, bold: true, color: COLOR.accent });

  // Оценки по направлениям.
  card(doc, M, 82, W - 2 * M, 50);
  text(doc, 'Оценки по направлениям', M + 6, 92, { size: 11, bold: true });
  const bars = [
    ['Поисковая оптимизация', Number(result.seo_score ?? 0)],
    ['Техническое состояние', Number(result.technical_score ?? 0)],
    ['Содержание страниц', Number(result.content_score ?? 0)],
    ['Скорость работы', Number(result.performance_score ?? 0)],
  ];
  bars.forEach(([label, score], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    scoreBar(doc, M + 6 + col * 88, 104 + row * 14, 78, label, score);
  });

  // Сколько замечаний какой важности.
  card(doc, M, 138, W - 2 * M, 34);
  text(doc, 'Замечания по важности', M + 6, 148, { size: 11, bold: true });
  ['high', 'medium', 'low'].forEach((sev, i) => {
    const count = issues.filter((x) => x.severity === sev).reduce((s, x) => s + Number(x.n), 0);
    const x = M + 6 + i * 60;
    doc.setFillColor(SEVERITY[sev].color);
    doc.circle(x + 2, 159, 2, 'F');
    text(doc, count, x + 7, 161, { size: 15, bold: true, color: SEVERITY[sev].color });
    text(doc, SEVERITY[sev].genitive, x + 7 + String(count).length * 4 + 4, 161, { size: 9, color: COLOR.muted });
  });

  // Что делать в первую очередь.
  card(doc, M, 178, W - 2 * M, 90);
  text(doc, 'Что сделать в первую очередь', M + 6, 188, { size: 11, bold: true });
  const priority = [...issues]
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity] || Number(b.n) - Number(a.n);
    })
    .slice(0, 5);

  let y = 198;
  priority.forEach((issue, idx) => {
    doc.setFillColor(SEVERITY[issue.severity].color);
    doc.circle(M + 9, y - 1.2, 1.6, 'F');
    text(doc, `${idx + 1}. ${ISSUE_TITLES[issue.issue_type] ?? issue.issue_type}`, M + 14, y, { size: 10, bold: true });
    text(doc, pages(issue.n), W - M - 6, y, { size: 9, color: COLOR.muted, align: 'right' });
    const advice = ISSUE_ADVICE[issue.issue_type] ?? issue.recommendation ?? '';
    text(doc, advice, M + 14, y + 5, { size: 8.5, color: COLOR.muted, maxWidth: W - 2 * M - 26 });
    y += 15;
  });

  footer(doc, 1, 3);

  // ---------- Страница 2: полный список ----------
  doc.addPage();
  paintBackground(doc);
  header(doc, site, dateLabel);

  card(doc, M, 30, W - 2 * M, 12 + issues.length * 16);
  text(doc, 'Все найденные замечания', M + 6, 40, { size: 11, bold: true });

  y = 52;
  issues.forEach((issue) => {
    doc.setFillColor(SEVERITY[issue.severity].color);
    doc.roundedRect(M + 6, y - 4, 22, 5.5, 1.5, 1.5, 'F');
    text(doc, SEVERITY[issue.severity].label, M + 17, y - 0.2, { size: 6.5, bold: true, color: '#0B1020', align: 'center' });

    text(doc, ISSUE_TITLES[issue.issue_type] ?? issue.issue_type, M + 32, y, { size: 10, bold: true });
    text(doc, pages(issue.n), W - M - 6, y, { size: 9, color: COLOR.accent, align: 'right' });
    const advice = ISSUE_ADVICE[issue.issue_type] ?? issue.recommendation ?? '';
    text(doc, advice, M + 32, y + 5, { size: 8.5, color: COLOR.muted, maxWidth: W - 2 * M - 44 });
    y += 16;
  });

  // Пояснение про метод.
  const noteY = Math.min(y + 6, H - 40);
  card(doc, M, noteY, W - 2 * M, 26);
  text(doc, 'Как считалась оценка', M + 6, noteY + 9, { size: 10, bold: true });
  text(
    doc,
    'Страницы взвешены по глубине: главная важнее вложенных, каждый уровень вглубь снижает вес. '
      + 'Поэтому замечание на главной влияет на оценку сильнее, чем такое же на глубокой странице.',
    M + 6,
    noteY + 15,
    { size: 8.5, color: COLOR.muted, maxWidth: W - 2 * M - 12 },
  );

  footer(doc, 2, 3);

  // ---------- Страница 3: смета и план ----------
  doc.addPage();
  paintBackground(doc);
  header(doc, site, dateLabel);

  const groupCount = estimate.groups.size;
  const lineCount = [...estimate.groups.values()].reduce((n, list) => n + list.length, 0);
  const estimateHeight = 26 + groupCount * 9 + lineCount * 6 + 24;

  card(doc, M, 30, W - 2 * M, estimateHeight);
  text(doc, 'Смета работ', M + 6, 40, { size: 11, bold: true });
  text(doc, 'Расчёт по расценкам за исправление одной страницы', M + 6, 45.5, { size: 8, color: COLOR.muted });

  // Шапка таблицы.
  let ey = 54;
  text(doc, 'Работа', M + 6, ey, { size: 7.5, color: COLOR.muted });
  text(doc, 'Объём', W - M - 62, ey, { size: 7.5, color: COLOR.muted, align: 'right' });
  text(doc, 'Цена', W - M - 34, ey, { size: 7.5, color: COLOR.muted, align: 'right' });
  text(doc, 'Сумма', W - M - 6, ey, { size: 7.5, color: COLOR.muted, align: 'right' });
  doc.setDrawColor(COLOR.cardEdge);
  doc.setLineWidth(0.3);
  doc.line(M + 6, ey + 2, W - M - 6, ey + 2);
  ey += 8;

  for (const [category, lines] of estimate.groups) {
    const groupSum = lines.reduce((sum, line) => sum + line.sum, 0);
    text(doc, CATEGORY_TITLES[category] ?? category, M + 6, ey, { size: 9, bold: true, color: COLOR.accent });
    text(doc, money(groupSum), W - M - 6, ey, { size: 9, bold: true, color: COLOR.accent, align: 'right' });
    text(doc, CATEGORY_OWNERS[category] ?? '', M + 6, ey + 4, { size: 7, color: COLOR.muted });
    ey += 9;

    for (const line of lines) {
      text(doc, line.title, M + 10, ey, { size: 8.5 });
      text(doc, String(line.count), W - M - 62, ey, { size: 8.5, color: COLOR.muted, align: 'right' });
      text(doc, money(line.unit), W - M - 34, ey, { size: 8.5, color: COLOR.muted, align: 'right' });
      text(doc, money(line.sum), W - M - 6, ey, { size: 8.5, align: 'right' });
      ey += 6;
    }
    ey += 2;
  }

  doc.setDrawColor(COLOR.cardEdge);
  doc.line(M + 6, ey - 2, W - M - 6, ey - 2);
  text(doc, 'Итого', M + 6, ey + 5, { size: 11, bold: true });
  text(doc, money(estimate.total), W - M - 6, ey + 5, { size: 13, bold: true, color: COLOR.accent, align: 'right' });

  let py = 30 + estimateHeight + 8;

  // Работы без расценки — показываем честно, а не прячем.
  if (estimate.unpriced.length > 0) {
    const h = 14 + estimate.unpriced.length * 5;
    card(doc, M, py, W - 2 * M, h);
    text(doc, 'Считается отдельно', M + 6, py + 8, { size: 9, bold: true });
    let uy = py + 14;
    for (const item of estimate.unpriced) {
      text(doc, `${ISSUE_TITLES[item.issue_type] ?? item.issue_type} — ${pages(item.count)}`, M + 6, uy,
        { size: 8, color: COLOR.muted });
      uy += 5;
    }
    py += h + 8;
  }

  // Порядок работ: от того, что мешает сильнее, к тому, что накапливается.
  const roadmapHeight = 42;
  card(doc, M, py, W - 2 * M, roadmapHeight);
  text(doc, 'Порядок работ', M + 6, py + 9, { size: 11, bold: true });
  const stages = [
    ['Первый месяц', 'Скорость и ответ сервера: сжатие, кеш, тяжёлые страницы'],
    ['Второй-третий', 'Заголовки, описания, подписи к картинкам'],
    ['Далее', 'Повторная проверка и наблюдение за позициями'],
  ];
  stages.forEach(([when, what], i) => {
    const sy = py + 18 + i * 8;
    doc.setFillColor(COLOR.accent);
    doc.circle(M + 9, sy - 1.2, 1.4, 'F');
    text(doc, when, M + 14, sy, { size: 8.5, bold: true });
    text(doc, what, M + 45, sy, { size: 8.5, color: COLOR.muted, maxWidth: W - 2 * M - 52 });
  });
  py += roadmapHeight + 8;

  // По чему судить о результате.
  card(doc, M, py, W - 2 * M, 34);
  text(doc, 'По чему проверять результат', M + 6, py + 9, { size: 11, bold: true });
  const metrics = [
    'Время ответа сервера и скорость загрузки',
    'Доля страниц со сжатием ответа',
    'Позиции по ключевым запросам',
    'Органический трафик и страницы входа',
  ];
  metrics.forEach((metric, i) => {
    const mx = M + 6 + (i % 2) * 88;
    const my = py + 18 + Math.floor(i / 2) * 7;
    text(doc, `— ${metric}`, mx, my, { size: 8.5, color: COLOR.muted });
  });

  text(
    doc,
    `Источник данных: обход ${pages(result.page_count)} сайта ${site} собственным краулером, `
      + `${dateLabel} Цены — из справочника работ проекта.`,
    M,
    H - 18,
    { size: 7.5, color: COLOR.muted, maxWidth: W - 2 * M },
  );

  footer(doc, 3, 3);
  return doc;
}

const taskFilter = arg('task');
const out = arg('out', 'audit-report.pdf');

const resultRows = await query(
  `select r.page_count, r.seo_score, r.technical_score, r.content_score, r.performance_score,
          r.global_score, t.url, t.created_at
     from audit_results r
     join audit_tasks t on t.id = r.task_id
    ${taskFilter ? `where r.task_id = '${taskFilter}'` : ''}
    order by r.created_at desc
    limit 1`,
);
if (!Array.isArray(resultRows) || resultRows.length === 0) {
  console.error('Завершённых аудитов в базе нет — отчёт делать не из чего.');
  process.exit(1);
}

const issues = await query(
  `select severity, issue_type, count(*) n, max(recommendation) recommendation
     from issues
    group by severity, issue_type
    order by case severity when 'high' then 1 when 'medium' then 2 else 3 end, n desc`,
);

const priceRules = await query(
  `select issue_type, rule_name, category, price_per_item
     from pricing_rules
    where is_active and not is_bundle
    order by category, sort_order`,
);

const doc = buildDocument({
  result: resultRows[0],
  issues: Array.isArray(issues) ? issues : [],
  priceRules: Array.isArray(priceRules) ? priceRules : [],
  generatedAt: new Date(),
});
doc.save(out);
console.log(`Готово: ${out}`);
