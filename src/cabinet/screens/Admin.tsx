import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Cell, CellGrid, ErrorNote, PageHead, Screen } from '../ui';
import { num } from '../format';
import { DAY_MS, LIVE_TASK_STATUSES, countOf, sinceIso, useAsync } from '../admin/data';
import { MissingCell } from '../admin/shared';
import SummaryTab from '../admin/SummaryTab';
import RatesTab from '../admin/RatesTab';
import PaymentsTab from '../admin/PaymentsTab';
import QueueTab from '../admin/QueueTab';
import SerpTab from '../admin/SerpTab';
import HostingTab from '../admin/HostingTab';
import SystemTab from '../admin/SystemTab';

/**
 * Администрирование — макет, строки 1851–2479.
 *
 * Вкладка живёт в адресе (/app/admin/:tab), а не в состоянии экрана, как в макете (adminTab):
 * так ссылку на «Цены» можно отправить коллеге, а «назад» в браузере возвращает на прошлую вкладку.
 * Доступ закрыт AdminRouteGuard в маршрутах; данные дополнительно режет RLS по роли admin.
 *
 * «Прокси» из макета переименованы в «Поставщик выдачи»: прокси в проекте не используются,
 * позиции снимаются на сервере через поставщика выдачи (supabase/functions/_shared/serp.ts).
 */

type TabKey = 'summary' | 'rates' | 'payments' | 'queue' | 'serp' | 'hosting' | 'system';

const TAB_KEYS: TabKey[] = ['summary', 'rates', 'payments', 'queue', 'serp', 'hosting', 'system'];

/** Старый ключ вкладки из макета — чтобы ссылки вида /app/admin/proxies не вели в пустоту. */
const TAB_ALIASES: Record<string, TabKey> = { proxies: 'serp' };

interface HeadCounters {
  users: number;
  audits24h: number;
  queue: number;
}

/** Шапка: только счётчики, которые есть в базе. Выручки и среднего чека нет — платежи не подключены. */
async function loadCounters(): Promise<HeadCounters> {
  const [users, audits, queue] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('audits').select('*', { count: 'exact', head: true }).gte('created_at', sinceIso(DAY_MS)),
    supabase.from('audit_tasks').select('*', { count: 'exact', head: true }).in('status', LIVE_TASK_STATUSES),
  ]);
  return { users: countOf(users), audits24h: countOf(audits), queue: countOf(queue) };
}

const Admin: React.FC = () => {
  const params = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const raw = params.tab ?? 'summary';
  const aliased = TAB_ALIASES[raw] ?? raw;
  const tab: TabKey = (TAB_KEYS as string[]).includes(aliased) ? (aliased as TabKey) : 'summary';

  // База адреса берётся из текущего пути, а не пишется «/app/admin»: тот же экран монтируется
  // в dev-просмотре под /app/dev/admin, и жёсткий адрес выкидывал бы оттуда на экран входа.
  const base = pathname.replace(/\/admin(\/[^/]*)?\/?$/, '/admin');

  // Неизвестная вкладка и старый ключ — заменяем адрес, чтобы подсветка и ссылка совпадали.
  useEffect(() => {
    if (params.tab && params.tab !== tab) navigate(tab === 'summary' ? base : `${base}/${tab}`, { replace: true });
  }, [params.tab, tab, base, navigate]);

  const counters = useAsync(loadCounters);
  const c = counters.data;

  const tabs: { key: TabKey; label: React.ReactNode }[] = [
    { key: 'summary', label: 'Сводка' },
    { key: 'rates', label: 'Цены' },
    { key: 'payments', label: 'Платежи' },
    { key: 'queue', label: c ? `Очередь ${num(c.queue)}` : 'Очередь' },
    { key: 'serp', label: 'Поставщик выдачи' },
    { key: 'hosting', label: 'Хостинг' },
    { key: 'system', label: 'Система' },
  ];

  return (
    <Screen>
      <PageHead
        title="Администрирование"
        lead="Платформа целиком: сметы и цены, очередь обхода, съём позиций, состояние базы и журнал функций."
      />

      {counters.error ? (
        <ErrorNote>Счётчики платформы не загрузились: {counters.error}</ErrorNote>
      ) : (
        <CellGrid min={136}>
          <Cell label="Пользователей" value={c ? num(c.users) : '…'} />
          <Cell label="Аудитов за сутки" value={c ? num(c.audits24h) : '…'} />
          <Cell label="Очередь" value={c ? num(c.queue) : '…'} />
          {/* Приёма оплаты нет: ноль здесь читался бы как «денег не пришло», а не «не считаем». */}
          <MissingCell label="Выручка" />
          <MissingCell label="Средний чек" />
        </CellGrid>
      )}

      <nav
        aria-label="Разделы администрирования"
        style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', borderBottom: '1px solid var(--color-divider)' }}
      >
        {tabs.map((t) => (
          <Link
            key={t.key}
            to={t.key === 'summary' ? base : `${base}/${t.key}`}
            data-tab
            data-active={tab === t.key ? '1' : '0'}
            aria-current={tab === t.key ? 'page' : undefined}
            style={{ fontSize: 13, paddingBottom: 'var(--space-3)', whiteSpace: 'nowrap' }}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === 'summary' && <SummaryTab base={base} />}
      {tab === 'rates' && <RatesTab />}
      {tab === 'payments' && <PaymentsTab />}
      {tab === 'queue' && <QueueTab />}
      {tab === 'serp' && <SerpTab />}
      {tab === 'hosting' && <HostingTab />}
      {tab === 'system' && <SystemTab />}
    </Screen>
  );
};

export default Admin;
