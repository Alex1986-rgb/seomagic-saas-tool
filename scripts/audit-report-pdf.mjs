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
 * Нужны переменные SUPABASE_ACCESS_TOKEN и SUPABASE_PROJECT_REF
 * (или --project <ref>).
 */
import { jsPDF } from 'jspdf';
import { readFileSync, existsSync } from 'node:fs';

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

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function query(sql) {
  const ref = arg('project', process.env.SUPABASE_PROJECT_REF);
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!ref || !token) {
    throw new Error('Нужны SUPABASE_PROJECT_REF и SUPABASE_ACCESS_TOKEN');
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

function buildDocument({ result, issues, generatedAt }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  loadFont(doc);

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

  footer(doc, 1, 2);

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

  footer(doc, 2, 2);
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

const doc = buildDocument({
  result: resultRows[0],
  issues: Array.isArray(issues) ? issues : [],
  generatedAt: new Date(),
});
doc.save(out);
console.log(`Готово: ${out}`);
