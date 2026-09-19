import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ErrorNote, Loading, NotConnected } from '../ui';
import { dateShort, num } from '../format';
import { DAY_MS, LIVE_TASK_STATUSES, STUCK_AFTER_MS, countOf, sinceIso, useAsync } from './data';
import { H2, StatusRow } from './shared';

/**
 * Сводка — макет, строки 1876–1915: «Последние сметы» и «Очередь сканирования».
 *
 * Список конвейеров в макете (краулер, воркеры, «перезапуск в 04:00», «61 % загрузки») описывает
 * собственный сервер, которого у нас нет: обработка идёт edge-функциями Supabase, воркеров и
 * перезапусков в этой схеме не существует. Поэтому строки здесь — конвейеры, которые реально
 * пишут в базу (аудиты, съём позиций, оптимизация, заявки), а состояние выводится из их таблиц.
 */

interface Pipeline {
  live: number;
  failed24h: number;
  /** Сколько «живых» записей не двигались дольше часа — признак, что обработчик молчит. */
  stuck: number | null;
  lastAt: string | null;
}

interface SummaryData {
  audits: Pipeline;
  positions: Pipeline;
  optimization: Pipeline;
  requestsNew: number;
  requestsLastAt: string | null;
}

async function loadSummary(): Promise<SummaryData> {
  const day = sinceIso(DAY_MS);
  const stuckBefore = sinceIso(STUCK_AFTER_MS);
  const [
    tLive,
    tFailed,
    tStuck,
    tLast,
    pLive,
    pFailed,
    pStuck,
    pLast,
    oLive,
    oFailed,
    oStuck,
    oLast,
    rNew,
    rLast,
  ] = await Promise.all([
    supabase.from('audit_tasks').select('*', { count: 'exact', head: true }).in('status', LIVE_TASK_STATUSES),
    supabase.from('audit_tasks').select('*', { count: 'exact', head: true }).eq('status', 'failed').gte('updated_at', day),
    supabase
      .from('audit_tasks')
      .select('*', { count: 'exact', head: true })
      .in('status', LIVE_TASK_STATUSES)
      .lt('updated_at', stuckBefore),
    supabase.from('audit_tasks').select('updated_at').order('updated_at', { ascending: false, nullsFirst: false }).limit(1),
    // Съём позиций: running → completed | partial | failed (positions-processor).
    supabase.from('position_checks').select('*', { count: 'exact', head: true }).eq('status', 'running'),
    supabase.from('position_checks').select('*', { count: 'exact', head: true }).eq('status', 'failed').gte('created_at', day),
    supabase
      .from('position_checks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'running')
      .lt('created_at', stuckBefore),
    supabase.from('position_checks').select('created_at').order('created_at', { ascending: false }).limit(1),
    // Оптимизация: queued → processing → completed | failed; 'estimated' — строка сметы, не запуск.
    supabase.from('optimization_jobs').select('*', { count: 'exact', head: true }).in('status', ['queued', 'processing']),
    supabase.from('optimization_jobs').select('*', { count: 'exact', head: true }).eq('status', 'failed').gte('updated_at', day),
    supabase
      .from('optimization_jobs')
      .select('*', { count: 'exact', head: true })
      .in('status', ['queued', 'processing'])
      .lt('updated_at', stuckBefore),
    supabase
      .from('optimization_jobs')
      .select('updated_at')
      .neq('status', 'estimated')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_requests').select('created_at').order('created_at', { ascending: false }).limit(1),
  ]);

  for (const r of [tLast, pLast, oLast, rLast]) if (r.error) throw r.error;

  return {
    audits: {
      live: countOf(tLive),
      failed24h: countOf(tFailed),
      stuck: countOf(tStuck),
      lastAt: tLast.data?.[0]?.updated_at ?? null,
    },
    positions: {
      live: countOf(pLive),
      failed24h: countOf(pFailed),
      // У position_checks нет updated_at: «висит» считаем от старта, как уборка fail_stale_position_checks.
      stuck: countOf(pStuck),
      lastAt: pLast.data?.[0]?.created_at ?? null,
    },
    optimization: {
      live: countOf(oLive),
      failed24h: countOf(oFailed),
      stuck: countOf(oStuck),
      lastAt: oLast.data?.[0]?.updated_at ?? null,
    },
    requestsNew: countOf(rNew),
    requestsLastAt: rLast.data?.[0]?.created_at ?? null,
  };
}

function pipelineStatus(p: Pipeline): string {
  const parts = [`${num(p.live)} в работе`, `${num(p.failed24h)} ошибок за сутки`];
  if (p.stuck) parts.push(`${num(p.stuck)} без движения больше часа`);
  return parts.join(' · ');
}

const lastSub = (at: string | null) => (at ? `Последняя запись: ${dateShort(at)}` : 'Записей ещё нет');

const SummaryTab: React.FC<{ base: string }> = ({ base }) => {
  const { data, loading, error } = useAsync(loadSummary);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
        gap: 'var(--space-8)',
        alignItems: 'start',
      }}
    >
      {/* Сметы. Политика job_estimates отдаёт строку только владельцу — администратору база вернёт
          лишь его собственные сметы. Показать их как «последние сметы платформы» значит соврать,
          поэтому блок не подключён, пока в базе нет правила чтения для роли admin. */}
      <section style={{ minWidth: 0 }}>
        <H2>Последние сметы</H2>
        <NotConnected
          title="Сметы клиентов администратору не видны"
          needs={[
            'политика SELECT на job_estimates для has_role(auth.uid(), \'admin\') — сейчас строку видит только владелец',
            'статусы оплаты появятся вместе с приёмом платежей (см. вкладку «Платежи»)',
          ]}
        />
      </section>

      <section style={{ minWidth: 0 }}>
        <H2>Конвейеры</H2>
        {loading ? (
          <Loading />
        ) : error || !data ? (
          <ErrorNote>Состояние конвейеров не загрузилось: {error}</ErrorNote>
        ) : (
          <div style={{ border: '1px solid var(--color-divider)' }}>
            <StatusRow
              title={<Link to={`${base}/queue`}>Аудиты и обход</Link>}
              sub={lastSub(data.audits.lastAt)}
              status={pipelineStatus(data.audits)}
              critical={Boolean(data.audits.stuck)}
            />
            <StatusRow
              title={<Link to={`${base}/serp`}>Съём позиций</Link>}
              sub={lastSub(data.positions.lastAt)}
              status={pipelineStatus(data.positions)}
              critical={Boolean(data.positions.stuck)}
            />
            <StatusRow
              title="Оптимизация"
              sub={lastSub(data.optimization.lastAt)}
              status={pipelineStatus(data.optimization)}
              critical={Boolean(data.optimization.stuck)}
            />
            <StatusRow
              last
              title={<Link to="/admin/requests">Заявки с сайта</Link>}
              sub={lastSub(data.requestsLastAt)}
              status={`${num(data.requestsNew)} новых`}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default SummaryTab;
