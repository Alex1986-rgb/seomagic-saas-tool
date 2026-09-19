import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cell, CellGrid, ErrorNote, Loading, MONO, MUTED, NotConnected, TableFrame, Tag } from '../ui';
import { dateShort, hostOf, num, plural } from '../format';
import { DAY_MS, LIVE_TASK_STATUSES, STUCK_AFTER_MS, countOf, sinceIso, useAsync } from './data';
import { H2, KeyValue, Lead, ProgressCell } from './shared';

/**
 * Очередь — макет, строки 2020–2100.
 *
 * Источник — audit_tasks: статус, этап, прогресс, число страниц и текущий адрес пишет audit-processor.
 * Построчная очередь адресов (url_queue) администратору недоступна: у таблицы нет политик чтения,
 * её читает только service-role. Поэтому «страниц осталось» считается по задачам
 * (всего адресов − просканировано), а не по строкам очереди.
 *
 * Воркеры, память пула, «страниц в секунду», приоритеты и автомасштабирование из макета описывают
 * собственный кластер. У нас обход идёт edge-функциями Supabase, этих величин не существует —
 * блок пула «не подключён», правил очереди (переключателей, которые ничего не меняют) нет.
 */

const TASK_COLUMNS =
  'id, url, status, stage, progress, pages_scanned, total_urls, estimated_pages, current_url, error_message, created_at, updated_at';

/** Сколько живых задач выгружаем строками. Счётчики — точные, таблица — первые LIVE_LIMIT. */
const LIVE_LIMIT = 100;
const RECENT_LIMIT = 15;

interface TaskRow {
  id: string;
  url: string;
  status: string;
  stage: string | null;
  progress: number | null;
  pages_scanned: number | null;
  total_urls: number | null;
  estimated_pages: number | null;
  current_url: string | null;
  error_message: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface QueueData {
  liveCount: number;
  failed24h: number;
  stuck: number;
  live: TaskRow[];
  recent: TaskRow[];
}

async function loadQueue(): Promise<QueueData> {
  const [liveCount, failed, stuck, live, recent] = await Promise.all([
    supabase.from('audit_tasks').select('*', { count: 'exact', head: true }).in('status', LIVE_TASK_STATUSES),
    supabase.from('audit_tasks').select('*', { count: 'exact', head: true }).eq('status', 'failed').gte('updated_at', sinceIso(DAY_MS)),
    supabase
      .from('audit_tasks')
      .select('*', { count: 'exact', head: true })
      .in('status', LIVE_TASK_STATUSES)
      .lt('updated_at', sinceIso(STUCK_AFTER_MS)),
    supabase
      .from('audit_tasks')
      .select(TASK_COLUMNS)
      .in('status', LIVE_TASK_STATUSES)
      .order('created_at', { ascending: true })
      .limit(LIVE_LIMIT),
    supabase
      .from('audit_tasks')
      .select(TASK_COLUMNS)
      .not('status', 'in', `(${LIVE_TASK_STATUSES.join(',')})`)
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(RECENT_LIMIT),
  ]);
  if (live.error) throw live.error;
  if (recent.error) throw recent.error;
  return {
    liveCount: countOf(liveCount),
    failed24h: countOf(failed),
    stuck: countOf(stuck),
    live: (live.data ?? []) as TaskRow[],
    recent: (recent.data ?? []) as TaskRow[],
  };
}

/** Размер сайта: сколько адресов нашёл обход; до этого — оценка из карты сайта. */
const sizeOf = (t: TaskRow): number | null => t.total_urls ?? t.estimated_pages ?? null;

const isStuck = (t: TaskRow) =>
  LIVE_TASK_STATUSES.includes(t.status) && !!t.updated_at && Date.now() - new Date(t.updated_at).getTime() > STUCK_AFTER_MS;

const STATUS_LABEL: Record<string, string> = {
  queued: 'В очереди',
  pending: 'В очереди',
  processing: 'Обход',
  scanning: 'Обход',
  completed: 'Готово',
  failed: 'Ошибка',
  cancelled: 'Отменён',
};

/** Этапы пишет audit-processor по-английски; неизвестный показываем как есть, чтобы не терять сигнал. */
const STAGE_LABEL: Record<string, string> = {
  queued: 'ждёт обработчика',
  initialization: 'подготовка',
  crawling: 'обход страниц',
  processing: 'разбор',
  complete: 'завершён',
  cancelled: 'отменён',
};

const StatusTag: React.FC<{ t: TaskRow }> = ({ t }) => {
  if (isStuck(t)) {
    return (
      <span className="tag tag-accent" data-chip="critical">
        Без движения с {dateShort(t.updated_at)}
      </span>
    );
  }
  const label = STATUS_LABEL[t.status] ?? t.status;
  if (t.status === 'failed') {
    return (
      <span className="tag tag-accent" data-chip="critical">
        {label}
      </span>
    );
  }
  if (t.status === 'completed') return <Tag tone="accent">{label}</Tag>;
  if (t.status === 'cancelled') return <Tag tone="neutral">{label}</Tag>;
  return <Tag tone="outline">{label}</Tag>;
};

const TasksTable: React.FC<{ rows: TaskRow[] }> = ({ rows }) => (
  <TableFrame minWidth={860}>
    <thead>
      <tr>
        <th style={{ width: '20%' }}>Сайт</th>
        <th style={{ textAlign: 'right' }}>Страниц</th>
        <th style={{ width: '16%' }}>Прогресс</th>
        <th>Статус</th>
        <th style={{ width: '26%' }}>Сейчас / ошибка</th>
        <th>Обновлено</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((t) => {
        const size = sizeOf(t);
        const pct = t.progress ?? (size && t.pages_scanned !== null ? (t.pages_scanned / size) * 100 : null);
        const caption =
          t.status === 'queued' || t.status === 'pending'
            ? 'в очереди'
            : `${num(t.pages_scanned ?? 0)}${size ? ` из ${num(size)}` : ''}${pct !== null ? ` · ${Math.round(pct)} %` : ''}`;
        const failedNote = t.status === 'failed' ? t.error_message : null;
        return (
          <tr key={t.id} data-row>
            <td style={{ fontSize: 14, wordBreak: 'break-all' }}>{hostOf(t.url) || t.url}</td>
            <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 15 }}>{num(size)}</td>
            <td>
              <ProgressCell pct={pct} caption={caption} />
            </td>
            <td>
              <StatusTag t={t} />
              {t.stage && LIVE_TASK_STATUSES.includes(t.status) && (
                <span style={{ display: 'block', fontSize: 11, color: MUTED, marginTop: 3 }}>{STAGE_LABEL[t.stage] ?? t.stage}</span>
              )}
            </td>
            <td
              style={{
                fontFamily: failedNote ? undefined : MONO,
                fontSize: failedNote ? 12.5 : 11.5,
                color: MUTED,
                wordBreak: 'break-all',
              }}
            >
              {failedNote ?? t.current_url ?? '—'}
            </td>
            <td style={{ fontSize: 12.5, color: MUTED, whiteSpace: 'nowrap' }}>{dateShort(t.updated_at)}</td>
          </tr>
        );
      })}
    </tbody>
  </TableFrame>
);

const QueueTab: React.FC = () => {
  const { data, loading, error, reload } = useAsync(loadQueue);

  if (loading && !data) return <Loading label="Читаем очередь…" />;
  if (error || !data) return <ErrorNote>Очередь не загрузилась: {error}</ErrorNote>;

  const remaining = data.live.reduce((acc, t) => {
    const size = sizeOf(t);
    return size === null ? acc : acc + Math.max(0, size - (t.pages_scanned ?? 0));
  }, 0);
  const partial = data.liveCount > data.live.length;
  const biggest = data.live.reduce((m, t) => Math.max(m, sizeOf(t) ?? 0), 0);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
      <Lead>
        {data.liveCount === 0
          ? 'Сейчас ни один сайт не обходится. '
          : `${num(data.liveCount)} ${plural(data.liveCount, ['сайт', 'сайта', 'сайтов'])} в работе${
              biggest ? `, крупнейший — ${num(biggest)} ${plural(biggest, ['страница', 'страницы', 'страниц'])}` : ''
            }. `}
        Обход идёт порциями по 5 адресов за вызов обработчика, поэтому крупный каталог не занимает обработку целиком.
      </Lead>

      <CellGrid min={136}>
        <Cell label="Сайтов в работе" value={num(data.liveCount)} />
        <Cell label={partial ? `Страниц осталось, первые ${LIVE_LIMIT}` : 'Страниц осталось'} value={num(remaining)} />
        <Cell label="Ошибок за сутки" value={num(data.failed24h)} />
        {/* Порог часа — тот же, что у уборки fail_stuck_audit_tasks: дольше задача будет снята с ошибкой. */}
        <Cell label="Без движения больше часа" value={num(data.stuck)} critical={data.stuck > 0} />
      </CellGrid>

      <section style={{ minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-3)',
          }}
        >
          <h2 style={{ fontSize: 20, margin: 0 }}>Обходы в работе</h2>
          <span style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: MUTED }}>
              {partial ? `первые ${num(data.live.length)} из ${num(data.liveCount)}` : 'от старых к новым'}
            </span>
            <button type="button" className="btn btn-ghost" onClick={reload} disabled={loading}>
              {loading ? 'Обновляем…' : 'Обновить'}
            </button>
          </span>
        </div>
        {data.live.length === 0 ? (
          <p style={{ fontSize: 13, color: MUTED, margin: 0, border: '1px solid var(--color-divider)', padding: 'var(--space-4)' }}>
            Очередь пуста.
          </p>
        ) : (
          <TasksTable rows={data.live} />
        )}
        {data.stuck > 0 && (
          <p style={{ fontSize: 12, color: MUTED, margin: 'var(--space-3) 0 0' }}>
            {num(data.stuck)} {plural(data.stuck, ['задача', 'задачи', 'задач'])} без движения дольше часа — обработчик молчит.
            Уборка зависших задач переведёт их в ошибку, клиент сможет перезапустить аудит.
          </p>
        )}
      </section>

      {data.recent.length > 0 && (
        <section style={{ minWidth: 0 }}>
          <H2>Последние завершённые</H2>
          <TasksTable rows={data.recent} />
        </section>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
          gap: 'var(--space-8)',
          alignItems: 'start',
        }}
      >
        <section style={{ minWidth: 0 }}>
          <H2 size={18} mb="var(--space-4)">Пул воркеров</H2>
          <NotConnected
            title="Воркеров и памяти пула в этой схеме нет"
            needs={[
              'обработка идёт edge-функциями Supabase: число воркеров, память и скорость обхода они не отдают',
              'для показателя «страниц в секунду» нужна запись времени обработки порции в audit_tasks',
              'для «страниц в очереди» по адресам — политика чтения url_queue для роли admin',
            ]}
          />
        </section>

        {/* Параметры — константы supabase/functions/audit-processor/index.ts. Правите там — правьте здесь:
            админка не должна обещать бережность обхода, которой в коде нет. */}
        <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', minWidth: 0 }}>
          <H2 size={18}>Нагрузка на сайт клиента</H2>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: MUTED, margin: '0 0 var(--space-4)', maxWidth: '56ch' }}>
            Как обработчик ходит по сайту сейчас. Темп по времени ответа сервера не подстраивается.
          </p>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <KeyValue label="Адресов за один вызов, параллельно" value="5" />
            <KeyValue label="Тайм-аут страницы" value="8 с" />
            <KeyValue label="Глубина обхода" value="5 переходов" />
            <KeyValue label="Сбавляем темп при медленном ответе" value="нет" />
            <KeyValue label="Учитываем Crawl-delay из robots.txt" value="нет" last />
          </div>
        </section>
      </div>
    </div>
  );
};

export default QueueTab;
