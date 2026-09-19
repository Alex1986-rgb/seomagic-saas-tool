import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Blueprint, Cell, CellGrid, ErrorNote, Loading, MUTED, NotConnected, Seg, TableFrame, Tag } from '../ui';
import { dateShort, num } from '../format';
import { DAY_MS, countOf, sinceIso, useAsync } from './data';
import { Lead, MissingCell } from './shared';

/**
 * Поставщик выдачи — на месте вкладки «Прокси» макета (строки 2102–2138).
 *
 * Пула прокси в проекте нет и не будет: позиции снимает edge-функция positions-check /
 * positions-processor через поставщика выдачи (supabase/functions/_shared/serp.ts). Поставщик
 * выбирается секретами функций (SERP_PROVIDER, XMLRIVER_USER + XMLRIVER_KEY и др.), браузеру они
 * не видны — поэтому «какой поставщик» здесь берётся из того, что функция записала в
 * position_checks.provider при последних проверках, а не из настроек.
 *
 * Статусы проверки: running → completed | partial | failed (positions-processor).
 * Баланс у поставщика функции не запрашивают — ячейка «не подключена», без чисел.
 */

type Filter = 'all' | 'ok' | 'errors' | 'running';

const LIST_LIMIT = 50;

interface CheckRow {
  id: string;
  domain: string;
  search_engine: string;
  region: string | null;
  depth: number;
  keywords_checked: number;
  keywords_total: number;
  provider: string | null;
  status: string;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

const CHECK_COLUMNS =
  'id, domain, search_engine, region, depth, keywords_checked, keywords_total, provider, status, error, created_at, completed_at';

interface SerpData {
  provider: string | null;
  providerAt: string | null;
  checks24h: number;
  failed24h: number;
  running: number;
  rows: CheckRow[];
}

async function loadSerp(filter: Filter): Promise<SerpData> {
  const day = sinceIso(DAY_MS);
  // Фильтр статуса — в запросе, а не на клиенте: иначе «С ошибкой» искал бы только среди последних 50.
  let list = supabase.from('position_checks').select(CHECK_COLUMNS);
  if (filter === 'ok') list = list.eq('status', 'completed');
  if (filter === 'errors') list = list.in('status', ['failed', 'partial']);
  if (filter === 'running') list = list.eq('status', 'running');

  const [lastProvider, total, failed, running, rows] = await Promise.all([
    supabase
      .from('position_checks')
      .select('provider, created_at')
      .not('provider', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase.from('position_checks').select('*', { count: 'exact', head: true }).gte('created_at', day),
    supabase
      .from('position_checks')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', day)
      .in('status', ['failed', 'partial']),
    supabase.from('position_checks').select('*', { count: 'exact', head: true }).eq('status', 'running'),
    list.order('created_at', { ascending: false }).limit(LIST_LIMIT),
  ]);
  if (lastProvider.error) throw lastProvider.error;
  if (rows.error) throw rows.error;

  return {
    provider: lastProvider.data?.[0]?.provider ?? null,
    providerAt: lastProvider.data?.[0]?.created_at ?? null,
    checks24h: countOf(total),
    failed24h: countOf(failed),
    running: countOf(running),
    rows: (rows.data ?? []) as CheckRow[],
  };
}

/** Имена поставщиков, как их пишет serp.ts. Неизвестное показываем как есть. */
const PROVIDER_LABEL: Record<string, string> = { xmlriver: 'XMLRiver', dataforseo: 'DataForSEO', serpapi: 'SerpApi' };
const providerName = (p: string | null) => (p ? PROVIDER_LABEL[p] ?? p : '—');

const ENGINE_LABEL: Record<string, string> = { yandex: 'Яндекс', google: 'Google' };

const CheckStatus: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'failed')
    return (
      <span className="tag tag-accent" data-chip="critical">
        Ошибка
      </span>
    );
  if (status === 'partial') return <Tag tone="outline">Частично</Tag>;
  if (status === 'running') return <Tag tone="neutral">Идёт</Tag>;
  if (status === 'completed') return <Tag tone="accent">Готово</Tag>;
  return <Tag tone="neutral">{status}</Tag>;
};

const SerpTab: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const { data, loading, error, reload } = useAsync(() => loadSerp(filter), [filter]);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <Lead width="72ch">
        Позиции снимаются на сервере через поставщика поисковой выдачи — прокси не используются. Если поставщик не настроен
        или ответил отказом, проверка завершается ошибкой, а не подставляет выдуманную позицию.
      </Lead>

      {error ? (
        <ErrorNote>Проверки позиций не загрузились: {error}</ErrorNote>
      ) : !data ? (
        <Loading label="Читаем проверки позиций…" />
      ) : (
        <>
          <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{ width: 8, height: 8, flex: 'none', background: data.provider ? 'var(--color-accent)' : 'var(--color-divider)' }}
              />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>
                {data.provider ? providerName(data.provider) : 'Поставщик не определён'}
              </span>
              {data.provider && <Tag tone="accent">Использовался</Tag>}
              <span style={{ flexBasis: '100%', fontSize: 12.5, color: MUTED }}>
                {data.provider
                  ? `По последней проверке с записанным поставщиком — ${dateShort(data.providerAt)}. Выбор задаётся секретами функций (SERP_PROVIDER).`
                  : 'Ни одна проверка ещё не записала поставщика. Выбор задаётся секретами функций: SERP_PROVIDER и ключи XMLRiver, DataForSEO или SerpApi.'}
              </span>
            </div>

            <CellGrid min={150}>
              <Cell label="Проверок за сутки" value={num(data.checks24h)} />
              <Cell label="С ошибкой за сутки" value={num(data.failed24h)} critical={data.failed24h > 0} />
              <Cell label="Идут сейчас" value={num(data.running)} />
              <MissingCell label="Баланс у поставщика" />
            </CellGrid>
          </Blueprint>

          <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Показывать</label>
              <Seg<Filter>
                name="serp-filter"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'all', label: 'Все' },
                  { value: 'ok', label: 'Успешные' },
                  { value: 'errors', label: 'С ошибкой' },
                  { value: 'running', label: 'Идут' },
                ]}
              />
            </div>
            <span style={{ flex: 1 }} />
            <button type="button" className="btn btn-secondary" onClick={reload} disabled={loading}>
              {loading ? 'Обновляем…' : 'Обновить'}
            </button>
          </div>

          {data.rows.length === 0 ? (
            <p style={{ fontSize: 13, color: MUTED, margin: 0, border: '1px solid var(--color-divider)', padding: 'var(--space-4)' }}>
              {filter === 'all' ? 'Проверок позиций ещё не было.' : 'Таких проверок нет.'}
            </p>
          ) : (
            <TableFrame minWidth={820}>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Домен</th>
                  <th>Поисковик</th>
                  <th style={{ textAlign: 'right' }}>Запросов</th>
                  <th>Поставщик</th>
                  <th>Статус</th>
                  <th style={{ width: '28%' }}>Ошибка</th>
                  <th>Запущена</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.id} data-row>
                    <td style={{ fontSize: 14, wordBreak: 'break-all' }}>{r.domain}</td>
                    <td style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      {ENGINE_LABEL[r.search_engine] ?? r.search_engine}
                      <span style={{ display: 'block', fontSize: 11, color: MUTED }}>
                        {r.region ? `регион ${r.region} · ` : ''}топ-{r.depth}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 15, whiteSpace: 'nowrap' }}>
                      {num(r.keywords_checked)} / {num(r.keywords_total)}
                    </td>
                    <td style={{ fontSize: 12.5, color: MUTED }}>{providerName(r.provider)}</td>
                    <td>
                      <CheckStatus status={r.status} />
                    </td>
                    <td style={{ fontSize: 12.5, color: MUTED, wordBreak: 'break-word' }}>{r.error ?? '—'}</td>
                    <td style={{ fontSize: 12.5, color: MUTED, whiteSpace: 'nowrap' }}>{dateShort(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </TableFrame>
          )}
          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
            Показаны последние {LIST_LIMIT} проверок{filter === 'all' ? '' : ' с выбранным статусом'}.
          </p>

          <NotConnected
            title="Баланс и расход поставщика"
            needs={[
              'функция, которая запрашивает баланс у поставщика (для XMLRiver — отдельный метод API) и отдаёт его администратору',
              'расход запросов по дням: в position_checks уже пишется provider_requests, но его нет в типах клиента — нужна регенерация types.ts',
            ]}
          />
        </>
      )}
    </div>
  );
};

export default SerpTab;
