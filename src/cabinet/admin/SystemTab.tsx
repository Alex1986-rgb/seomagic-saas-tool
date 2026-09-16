import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApiActivity } from '@/hooks/use-api-activity';
import { isErrorStatus } from '@/lib/admin-stats';
import { Blueprint, Cell, CellGrid, ErrorNote, Loading, MONO, MUTED, NotConnected, TableFrame } from '../ui';
import { dateShort, num } from '../format';
import { DAY_MS, countOf, sinceIso, useAsync } from './data';
import { H2, MissingCell } from './shared';

/**
 * Система — макет, строки 2313–2469.
 *
 * В serverless-схеме (Supabase + edge-функции) не собираются ни загрузка CPU, память, диск и uptime
 * сервера, ни версия Postgres, регион, тариф, число соединений и дата бэкапа. Старая страница
 * (SystemStatusPage.tsx) показывала их выдуманными — здесь они «не подключены».
 *
 * Настоящее: число записей в основных таблицах (точные счётчики под ролью admin) и журнал api_logs.
 * Журнал неполный — пишут его не все функции и не на каждом шаге, поэтому пустой журнал не значит
 * «ошибок нет», и экран это оговаривает.
 */

/**
 * Таблицы, которые администратор видит целиком по RLS. job_estimates и url_queue сюда не входят:
 * первая отдаёт только свои строки, вторая закрыта политиками — их счётчик был бы ложным нулём.
 */
const TABLES = [
  { table: 'profiles', note: 'пользователи' },
  { table: 'audits', note: 'аудиты' },
  { table: 'audit_tasks', note: 'задачи обхода' },
  { table: 'issues', note: 'найденные замечания' },
  { table: 'optimization_jobs', note: 'оптимизация и сметы' },
  { table: 'position_checks', note: 'проверки позиций' },
  { table: 'contact_requests', note: 'заявки с сайта' },
  { table: 'api_logs', note: 'журнал функций' },
] as const;

type TableName = (typeof TABLES)[number]['table'];

interface TableCount {
  table: TableName;
  note: string;
  total: number;
  month: number;
}

async function loadTableCounts(): Promise<TableCount[]> {
  const month = sinceIso(30 * DAY_MS);
  return Promise.all(
    TABLES.map(async ({ table, note }) => {
      const [total, recent] = await Promise.all([
        supabase.from(table).select('*', { count: 'exact', head: true }),
        supabase.from(table).select('*', { count: 'exact', head: true }).gte('created_at', month),
      ]);
      return { table, note, total: countOf(total), month: countOf(recent) };
    }),
  );
}

const SystemTab: React.FC = () => {
  const tables = useAsync(loadTableCounts);
  const api = useApiActivity(24);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
      {/* База кабинета. Размеры таблиц в макете (ГБ, партиционирование) без функции на стороне базы
          не получить: pg_total_relation_size клиенту недоступен. Показываем число записей. */}
      <Blueprint as="section" style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-6)' }}>
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, flex: 'none', background: tables.error ? 'var(--color-critical)' : 'var(--color-accent)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>Supabase</span>
          </div>
          <div style={{ fontSize: 12.5, color: MUTED }}>
            База кабинета: аккаунты, аудиты, замечания, проверки позиций. Счётчики — точные, под ролью администратора.
          </div>
        </div>

        <CellGrid min={136}>
          <MissingCell label="База, ГБ" />
          <MissingCell label="Лимит тарифа" />
          <MissingCell label="Соединений" />
          <MissingCell label="Бэкап" />
        </CellGrid>

        {tables.loading && !tables.data ? (
          <Loading label="Считаем записи…" />
        ) : tables.error || !tables.data ? (
          <ErrorNote>Счётчики таблиц не загрузились: {tables.error}</ErrorNote>
        ) : (
          <TableFrame minWidth={560}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Таблица</th>
                <th>Что хранит</th>
                <th style={{ textAlign: 'right' }}>Записей</th>
                <th style={{ textAlign: 'right' }}>За 30 дней</th>
              </tr>
            </thead>
            <tbody>
              {tables.data.map((t) => (
                <tr key={t.table} data-row>
                  <td style={{ fontFamily: MONO, fontSize: 12.5 }}>{t.table}</td>
                  <td style={{ fontSize: 12.5, color: MUTED }}>{t.note}</td>
                  <td style={{ textAlign: 'right' }}>{num(t.total)}</td>
                  <td style={{ textAlign: 'right' }}>{num(t.month)}</td>
                </tr>
              ))}
            </tbody>
          </TableFrame>
        )}
        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
          Не показаны job_estimates (администратору RLS отдаёт только его собственные сметы) и url_queue (закрыта для всех,
          кроме функций).
        </p>
      </Blueprint>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
          gap: 'var(--space-8)',
          alignItems: 'start',
        }}
      >
        <section style={{ minWidth: 0 }}>
          <H2>Ресурсы сервера</H2>
          <NotConnected
            title="Метрики сервера не собираются"
            needs={[
              'CPU, память, диск и uptime: в схеме Supabase + edge-функции своего сервера нет, метрики есть только в панели Supabase',
              'размер базы, соединения и бэкапы — через Management API Supabase или функцию в базе с правами на pg_stat',
            ]}
          />
        </section>

        {/* «Сервисы» макета → функции по журналу за сутки: единственный честный признак, что функция жива. */}
        <section style={{ minWidth: 0 }}>
          <H2>Функции за сутки</H2>
          {api.isLoading ? (
            <Loading />
          ) : api.error ? (
            <ErrorNote>Журнал не загрузился: {api.error}</ErrorNote>
          ) : api.stats.byFunction.length === 0 ? (
            <p style={{ fontSize: 13, color: MUTED, margin: 0, border: '1px solid var(--color-divider)', padding: 'var(--space-4)' }}>
              За сутки ни одна функция не записала вызов. Это не значит, что функции не работали: журнал ведут не все.
            </p>
          ) : (
            <>
              <CellGrid min={120} style={{ marginBottom: 'var(--space-4)' }}>
                <Cell label="Записей" value={num(api.stats.total)} size={24} />
                <Cell label="С кодом 4xx/5xx" value={num(api.stats.errors)} size={24} critical={api.stats.errors > 0} />
                <Cell
                  label="Средняя длительность"
                  value={api.stats.averageDuration === null ? '—' : `${num(api.stats.averageDuration)} мс`}
                  size={24}
                />
              </CellGrid>
              <TableFrame minWidth={420}>
                <thead>
                  <tr>
                    <th style={{ width: '46%' }}>Функция</th>
                    <th style={{ textAlign: 'right' }}>Вызовов</th>
                    <th style={{ textAlign: 'right' }}>Ошибок</th>
                    <th style={{ textAlign: 'right' }}>Среднее</th>
                  </tr>
                </thead>
                <tbody>
                  {api.stats.byFunction.map((f) => (
                    <tr key={f.name} data-row>
                      <td style={{ fontFamily: MONO, fontSize: 12.5, wordBreak: 'break-all' }}>{f.name}</td>
                      <td style={{ textAlign: 'right' }}>{num(f.calls)}</td>
                      <td style={{ textAlign: 'right', color: f.errors > 0 ? 'var(--color-critical)' : undefined }}>{num(f.errors)}</td>
                      <td style={{ textAlign: 'right', color: MUTED, whiteSpace: 'nowrap' }}>
                        {f.averageDuration === null ? '—' : `${num(f.averageDuration)} мс`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableFrame>
              {api.stats.sampleSize < api.stats.total && (
                <p style={{ fontSize: 12, color: MUTED, margin: 'var(--space-3) 0 0' }}>
                  Разбивка по функциям — по последним {num(api.stats.sampleSize)} записям из {num(api.stats.total)}.
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
          gap: 'var(--space-8)',
          alignItems: 'start',
        }}
      >
        <section style={{ minWidth: 0 }}>
          <H2>Журнал событий</H2>
          {api.isLoading ? (
            <Loading />
          ) : api.error ? (
            <ErrorNote>Журнал не загрузился: {api.error}</ErrorNote>
          ) : api.recent.length === 0 ? (
            <p style={{ fontSize: 13, color: MUTED, margin: 0, border: '1px solid var(--color-divider)', padding: 'var(--space-4)' }}>
              За сутки записей нет.
            </p>
          ) : (
            <div style={{ border: '1px solid var(--color-divider)' }}>
              {api.recent.map((row, i) => {
                const failed = isErrorStatus(row.status_code);
                return (
                  <div
                    key={`${row.function_name}-${row.created_at}-${i}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto minmax(0,1fr) auto',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-2) var(--space-4)',
                      borderBottom: i === api.recent.length - 1 ? undefined : '1px solid var(--color-divider)',
                      alignItems: 'baseline',
                    }}
                  >
                    {failed ? (
                      <span data-dot-critical style={{ width: 6, height: 6, flex: 'none' }} />
                    ) : (
                      <span style={{ width: 6, height: 6, background: 'color-mix(in srgb,var(--color-text) 28%,transparent)' }} />
                    )}
                    <span style={{ fontSize: 13, minWidth: 0, wordBreak: 'break-word' }}>
                      <span style={{ fontFamily: MONO, fontSize: 12.5 }}>{row.function_name}</span>
                      {row.status_code !== null && <span style={{ color: MUTED }}> → {row.status_code}</span>}
                      {typeof row.duration_ms === 'number' && row.duration_ms > 0 && (
                        <span style={{ color: MUTED }}> · {num(row.duration_ms)} мс</span>
                      )}
                    </span>
                    <span style={{ fontSize: 11.5, color: MUTED, whiteSpace: 'nowrap' }}>{dateShort(row.created_at)}</span>
                  </div>
                );
              })}
            </div>
          )}
          <p style={{ fontSize: 12, color: MUTED, margin: 'var(--space-3) 0 0' }}>
            Последние записи api_logs. Журнал ведут не все функции: отсутствие ошибок здесь не доказывает, что сбоев не было.
          </p>
        </section>

        <section style={{ minWidth: 0 }}>
          <H2>Окружение</H2>
          <NotConnected
            title="Версии и окружение не собираются"
            needs={[
              'версия Postgres, регион и тариф проекта — только в панели Supabase или через Management API',
              'резервная копия по кнопке — нужна функция с доступом к API бэкапов Supabase',
            ]}
          />
        </section>
      </div>
    </div>
  );
};

export default SystemTab;
