/**
 * Чистая модель экрана «Позиции» (и таблицы «Где вы отстаёте» на «Конкурентах»).
 *
 * Вынесена из экрана без обращений к базе, чтобы расчёт динамики, сортировки и сводки ТОП
 * проверялся тестом: это места, где легко перепутать знак (в SEO меньшая позиция — лучше).
 *
 * Данные — строки position_results, которые пишет positions-processor по выдаче поставщика
 * (XMLRiver). Позиция 0 в базе означает «в просмотренной выдаче домена нет», а не первое место.
 */

export type Engine = 'yandex' | 'google';

/** Регионы из макета. Яндекс принимает числовой код lr, Google — только страну. */
export type RegionKey = 'msk' | 'spb' | 'ru';

export const REGIONS: { value: RegionKey; label: string; lr: string }[] = [
  { value: 'msk', label: 'Москва', lr: '213' },
  { value: 'spb', label: 'Санкт-Петербург', lr: '2' },
  { value: 'ru', label: 'Россия', lr: '225' },
];

/** Код Яндекса по умолчанию, если проверка записана без региона (так делает serp.ts). */
const YANDEX_DEFAULT_LR = '213';

/**
 * Старый экран трекера отправлял регион текстом («Москва»). Такие проверки узнаём по названию,
 * иначе они выпали бы из истории при выборе региона.
 */
const REGION_ALIASES: Record<string, string> = {
  москва: '213',
  msk: '213',
  'санкт-петербург': '2',
  спб: '2',
  петербург: '2',
  россия: '225',
  ru: '225',
};

export function normalizeYandexRegion(region: string | null | undefined): string | null {
  const raw = (region ?? '').trim().toLowerCase();
  if (!raw) return YANDEX_DEFAULT_LR;
  if (/^\d+$/.test(raw)) return raw;
  return REGION_ALIASES[raw] ?? null;
}

export interface CheckRow {
  id: string;
  domain: string;
  search_engine: string;
  region: string | null;
  depth: number;
  status: string;
  keywords_total: number;
  keywords_checked: number;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ResultRow {
  check_id: string;
  keyword: string;
  search_engine: string;
  position: number;
  url: string | null;
  checked_at: string;
}

export interface SeriesPoint {
  at: string;
  position: number;
}

export interface EngineCell {
  /** 1..depth; 0 — домена нет в просмотренной выдаче. */
  position: number;
  /** Позиция в предыдущей проверке; null — предыдущей проверки по запросу нет. */
  previous: number | null;
  depth: number;
  url: string | null;
  checkedAt: string;
  /** Все проверки по запросу, от старых к новым. */
  series: SeriesPoint[];
}

export interface KeywordRow {
  keyword: string;
  ya: EngineCell | null;
  gg: EngineCell | null;
}

/**
 * Какие результаты относятся к выбранному региону.
 *
 * Google регион по городу не принимает (serp.ts передаёт только страну), поэтому его
 * результаты от переключателя не зависят. Для Яндекса сравниваем код lr проверки.
 */
function resultMatchesRegion(engine: string, check: CheckRow, region: RegionKey): boolean {
  if (engine === 'google') return true;
  const lr = REGIONS.find((r) => r.value === region)?.lr;
  return normalizeYandexRegion(check.region) === lr;
}

/**
 * Строки таблицы: по каждому запросу последняя и предыдущая позиция в каждой системе.
 *
 * Набор запросов — из последней проверки каждой системы, а не весь накопленный: запрос,
 * который убрали из трекера месяц назад, не должен висеть в таблице с устаревшей позицией.
 * Динамика — между двумя последними проверками (так, как её пишет и processor), а не
 * «за период»: период управляет только линией на спарклайне.
 */
export function buildKeywordRows(checks: CheckRow[], results: ResultRow[], region: RegionKey): KeywordRow[] {
  const checkById = new Map(checks.map((c) => [c.id, c]));
  const byKey = new Map<string, { check: CheckRow; row: ResultRow }[]>();
  // Последняя проверка каждой системы именно в выбранном регионе.
  const latestCheckAt: Partial<Record<Engine, number>> = {};
  const latestCheckId: Partial<Record<Engine, string>> = {};

  for (const row of results) {
    const check = checkById.get(row.check_id);
    if (!check) continue;
    const engine = row.search_engine === 'google' ? 'google' : row.search_engine === 'yandex' ? 'yandex' : null;
    if (!engine) continue;
    if (!resultMatchesRegion(engine, check, region)) continue;
    const key = `${engine}::${row.keyword}`;
    const list = byKey.get(key) ?? [];
    list.push({ check, row });
    byKey.set(key, list);
    const at = Date.parse(check.created_at);
    if (latestCheckAt[engine] === undefined || at > latestCheckAt[engine]!) {
      latestCheckAt[engine] = at;
      latestCheckId[engine] = check.id;
    }
  }

  const keywords = new Set<string>();
  for (const row of results) {
    const engine = row.search_engine as Engine;
    if (latestCheckId[engine] && row.check_id === latestCheckId[engine]) keywords.add(row.keyword);
  }

  const cellFor = (engine: Engine, keyword: string): EngineCell | null => {
    const list = byKey.get(`${engine}::${keyword}`);
    if (!list || list.length === 0) return null;
    // Одна точка на проверку: при повторе запроса в проверке берём лучшую позицию.
    const perCheck = new Map<string, { check: CheckRow; row: ResultRow }>();
    for (const item of list) {
      const prev = perCheck.get(item.check.id);
      if (!prev || rank(item.row.position) < rank(prev.row.position)) perCheck.set(item.check.id, item);
    }
    const ordered = Array.from(perCheck.values()).sort(
      (a, b) => Date.parse(a.check.created_at) - Date.parse(b.check.created_at),
    );
    const last = ordered[ordered.length - 1];
    // Запрос есть в истории, но не в последней проверке системы — позиция устарела, не показываем.
    if (last.check.id !== latestCheckId[engine]) return null;
    const before = ordered.length > 1 ? ordered[ordered.length - 2] : null;
    return {
      position: last.row.position,
      previous: before ? before.row.position : null,
      depth: last.check.depth,
      url: last.row.url,
      checkedAt: last.row.checked_at,
      series: ordered.map((o) => ({ at: o.check.created_at, position: o.row.position })),
    };
  };

  return Array.from(keywords).map((keyword) => ({
    keyword,
    ya: cellFor('yandex', keyword),
    gg: cellFor('google', keyword),
  }));
}

/** Позиция для сравнения: «не найден» хуже любой найденной. */
function rank(position: number | null | undefined): number {
  return position && position > 0 ? position : Number.POSITIVE_INFINITY;
}

export type SortKey = 'kw' | 'ya' | 'gg';

/**
 * Сортировка как в макете: первый щелчок по запросу — по алфавиту, по позиции — от лучшей
 * (меньшей) к худшей; повторный щелчок разворачивает. Запросы без позиции всегда внизу в
 * обоих направлениях — иначе при развороте «нет в выдаче» всплывало бы наверх как «лучшее».
 */
export function sortRows(rows: KeywordRow[], key: SortKey, dir: 1 | -1): KeywordRow[] {
  return rows.slice().sort((a, b) => {
    if (key === 'kw') return a.keyword.localeCompare(b.keyword, 'ru') * dir;
    const ra = rank(a[key]?.position);
    const rb = rank(b[key]?.position);
    const aMissing = !Number.isFinite(ra);
    const bMissing = !Number.isFinite(rb);
    if (aMissing && bMissing) return a.keyword.localeCompare(b.keyword, 'ru');
    if (aMissing) return 1;
    if (bMissing) return -1;
    return (ra - rb) * dir || a.keyword.localeCompare(b.keyword, 'ru');
  });
}

export interface Delta {
  label: string;
  /** Рост позиции — акцентом, падение и без изменений — приглушённо (как в макете). */
  up: boolean;
}

/**
 * Динамика между двумя последними проверками. Отрицательная разница позиции — рост, поэтому
 * стрелка вверх при уменьшении номера.
 */
export function positionDelta(cell: EngineCell | null): Delta | null {
  if (!cell || cell.previous === null) return null;
  const now = cell.position;
  const before = cell.previous;
  if (now > 0 && before > 0) {
    const d = now - before;
    if (d === 0) return { label: '→0', up: false };
    return d < 0 ? { label: `↑${-d}`, up: true } : { label: `↓${d}`, up: false };
  }
  if (now > 0 && before === 0) return { label: '↑ вошёл', up: true };
  if (now === 0 && before > 0) return { label: '↓ выпал', up: false };
  return null;
}

/** Подпись позиции в ячейке: «—» нет данных, «>100» — домена нет в просмотренной выдаче. */
export function positionLabel(cell: EngineCell | null): string {
  if (!cell) return '—';
  return cell.position > 0 ? String(cell.position) : `>${cell.depth}`;
}

/**
 * Точки спарклайна 80×22 за период. Лучшая позиция — вверху (меньший y), «нет в выдаче» —
 * у нижнего края. Одна точка линию не образует — возвращаем пустую строку.
 */
export function sparkPoints(series: SeriesPoint[], sinceMs: number): string {
  const pts = series.filter((p) => Date.parse(p.at) >= sinceMs);
  if (pts.length < 2) return '';
  const found = pts.filter((p) => p.position > 0).map((p) => p.position);
  const min = found.length ? Math.min(...found) : 1;
  const max = found.length ? Math.max(...found) : 1;
  const top = 3;
  const bottom = 19;
  const step = 80 / (pts.length - 1);
  return pts
    .map((p, i) => {
      let y: number;
      if (p.position <= 0) y = 21;
      else if (max === min) y = (top + bottom) / 2;
      else y = top + ((p.position - min) / (max - min)) * (bottom - top);
      return `${Math.round(i * step * 10) / 10},${Math.round(y * 10) / 10}`;
    })
    .join(' ');
}

export interface TopCounts {
  engine: Engine | null;
  top3: number;
  top10: number;
  top50: number;
  tracked: number;
}

/**
 * Сводка ТОП по одной системе: Яндекс, если по нему есть проверка в регионе, иначе Google.
 * Складывать системы нельзя — один запрос посчитался бы дважды.
 */
export function topCounts(rows: KeywordRow[]): TopCounts {
  const hasYa = rows.some((r) => r.ya);
  const hasGg = rows.some((r) => r.gg);
  const engine: Engine | null = hasYa ? 'yandex' : hasGg ? 'google' : null;
  const counts: TopCounts = { engine, top3: 0, top10: 0, top50: 0, tracked: 0 };
  if (!engine) return counts;
  for (const r of rows) {
    const cell = engine === 'yandex' ? r.ya : r.gg;
    if (!cell) continue;
    counts.tracked += 1;
    const p = cell.position;
    if (p <= 0) continue;
    if (p <= 3) counts.top3 += 1;
    if (p <= 10) counts.top10 += 1;
    if (p <= 50) counts.top50 += 1;
  }
  return counts;
}

/** Путь целевой страницы без домена — так колонка помещается, как в макете. */
export function pathOf(url: string | null | undefined): string {
  if (!url) return '—';
  try {
    const u = new URL(url);
    return `${u.pathname}${u.search}` || '/';
  } catch {
    return url;
  }
}

/** Ключевые слова из поля ввода: по строке, без пустых и повторов (регистр не важен). */
export function parseKeywords(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of text.split(/[\n;]+/)) {
    const kw = line.trim().replace(/\s+/g, ' ');
    if (!kw) continue;
    const key = kw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(kw);
  }
  return out;
}
