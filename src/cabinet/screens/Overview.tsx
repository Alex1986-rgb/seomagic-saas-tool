import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCabinetProject, type CabinetAudit } from '../project';
import {
  Empty,
  ErrorNote,
  Loading,
  NotConnected,
  PageHead,
  ScoreBar,
  Screen,
  Section,
  Stat,
  StatGrid,
  TableFrame,
  Tag,
  MUTED,
} from '../ui';
import { dateLong, dateShort, num, plural, rub } from '../format';
import { EstimateStat, OrderStrip } from '../estimate/OverviewBlocks';
import { useWorkRates } from '../estimate/rates';
import { countSeverity, priceOf } from '../audit/groups';
import { CATEGORY_LABEL, CRITICAL_SCORE, type IssueCategory } from '../audit/labels';
import { countCritical, fetchTaskForAudit, isFinished } from '../audit/queries';
import { MEASURED_CATEGORIES, scoreOf, useAuditReport, useFinishedAudits } from '../audit/useAuditReport';
import { NotConnectedStat, NotMeasuredBar, ScoreChart, type ScorePoint } from '../audit/parts';

/**
 * «Обзор проекта» — макет, строки 196–384.
 *
 * Всё на экране выводится из аудитов текущего проекта (проект = хост, см. project.tsx):
 * балл и категории — из последнего готового аудита (completed или partial), динамика — из всех
 * готовых аудитов за полгода, «что сделать» — из замечаний последнего аудита.
 * Чего в базе нет (индекс поисковика, мобильная версия, удобство, контроль откатов правок) —
 * показано как «не подключено», без чисел из макета.
 */

const HALF_YEAR_MS = 183 * 24 * 60 * 60 * 1000;
const CHART_POINTS = 6;

/** Последний готовый аудит каждого хоста и число критичных замечаний в нём — для таблицы проектов. */
function useProjectCritical(userId: string | null, finishedByHost: Map<string, CabinetAudit>) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const key = Array.from(finishedByHost.values())
    .map((a) => a.id)
    .join(',');
  useEffect(() => {
    if (!userId || !key) return;
    let alive = true;
    // Проектов у одного клиента единицы; ограничиваем 20, чтобы не устроить веер запросов.
    const entries = Array.from(finishedByHost.entries()).slice(0, 20);
    void Promise.all(
      entries.map(async ([host, audit]) => {
        try {
          const task = await fetchTaskForAudit(userId, audit.id);
          return [host, task ? await countCritical(userId, task.id) : null] as const;
        } catch {
          return [host, null] as const;
        }
      }),
    ).then((pairs) => {
      if (!alive) return;
      const next: Record<string, number> = {};
      for (const [h, c] of pairs) if (c !== null) next[h] = c;
      setCounts(next);
    });
    return () => {
      alive = false;
    };
    // finishedByHost пересобирается при каждом рендере; зависимость — по списку id аудитов.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, key]);
  return counts;
}

/** Статус проекта — это статус его последнего аудита: мониторинга «Активен/На паузе» в продукте нет. */
function statusTag(status: string) {
  if (status === 'completed') return <Tag tone="accent">Готов</Tag>;
  if (status === 'partial') return <Tag tone="accent">Частично</Tag>;
  if (status === 'failed' || status === 'error' || status === 'cancelled') return <Tag tone="neutral">Прерван</Tag>;
  return <Tag tone="outline">Идёт аудит</Tag>;
}

const Overview: React.FC = () => {
  const { userId, loading, error, audits, projects, host, setHost } = useCabinetProject();
  const navigate = useNavigate();
  const finished = useFinishedAudits();
  const last = finished[0] ?? null;
  const prev = finished[1] ?? null;
  const { report, loading: reportLoading, error: reportError } = useAuditReport(last, prev, { withPages: false });
  const { rates } = useWorkRates();

  const finishedByHost = useMemo(() => {
    const m = new Map<string, CabinetAudit>();
    for (const a of audits) if (isFinished(a.status) && !m.has(a.host)) m.set(a.host, a);
    return m;
  }, [audits]);
  const projectCritical = useProjectCritical(userId, finishedByHost);

  // Точки графика: готовые аудиты с баллом за последние полгода, от старых к новым.
  const points = useMemo<ScorePoint[]>(() => {
    const since = Date.now() - HALF_YEAR_MS;
    return finished
      .filter((a) => a.seoScore !== null && (a.completedAt ?? a.createdAt))
      .filter((a) => new Date((a.completedAt ?? a.createdAt) as string).getTime() >= since)
      .slice(0, CHART_POINTS)
      .reverse()
      .map((a) => ({ date: (a.completedAt ?? a.createdAt) as string, score: a.seoScore as number }));
  }, [finished]);

  if (loading) {
    return (
      <Screen>
        <PageHead title="Обзор проекта" />
        <Loading />
      </Screen>
    );
  }

  // Первый вход: аудитов нет — ведём на приветствие. Только при известном пользователе: в
  // dev-просмотре оболочки без сессии аудитов тоже нет, и переадресация сделала бы экран недоступным.
  if (!error && userId && audits.length === 0) return <Navigate to="/app/welcome" replace />;

  const score = scoreOf(report?.result ?? null, last);
  const prevScore = report?.prevResult ? scoreOf(report.prevResult, prev) : prev?.seoScore ?? null;
  const scoreDelta = score !== null && prevScore !== null ? Math.round(score) - Math.round(prevScore) : null;
  const sev = report ? countSeverity(report.groups) : null;
  const prevCritical = report ? report.prevCritical : null;
  const critDelta = sev && prevCritical !== null ? sev.critical - prevCritical : null;
  const todo = (report?.groups ?? []).filter((g) => g.sev !== 'ok').slice(0, 4);

  return (
    <Screen>
      <PageHead
        title="Обзор проекта"
        lead={host ? `${host} · сводка по последнему аудиту и динамика за полгода.` : 'Сводка по последнему аудиту и динамика за полгода.'}
      />

      {error && <ErrorNote>Не удалось загрузить проекты: {error}</ErrorNote>}
      {reportError && <ErrorNote>Не удалось загрузить последний аудит: {reportError}</ErrorNote>}

      <StatGrid>
        <Stat
          label="Общий балл"
          value={score !== null ? Math.round(score) : '—'}
          unit="/100"
          noteAccent={scoreDelta !== null && scoreDelta > 0}
          note={
            !last
              ? 'появится после завершения аудита'
              : scoreDelta === null
                ? 'первый аудит проекта'
                : scoreDelta === 0
                  ? 'как в прошлом аудите'
                  : `${scoreDelta > 0 ? '↑' : '↓'} ${Math.abs(scoreDelta)} ${plural(Math.abs(scoreDelta), ['пункт', 'пункта', 'пунктов'])} с прошлого аудита`
          }
        />
        {/* Индексацию знает только поисковик: без Вебмастера/GSC любое число здесь — догадка. */}
        <NotConnectedStat label="Страниц в индексе" needs="нужен доступ к Яндекс Вебмастеру или Search Console" />
        <Stat
          label="Критических ошибок"
          critical={!!sev && sev.critical > 0}
          value={sev ? num(sev.critical) : '—'}
          note={
            !last
              ? 'появится после завершения аудита'
              : critDelta === null
                ? `замечаний на страницах, аудит ${dateShort(last.completedAt ?? last.createdAt, false)}`
                : critDelta === 0
                  ? 'столько же, сколько в прошлом аудите'
                  : `${critDelta < 0 ? '↓' : '↑'} ${num(Math.abs(critDelta))} с прошлого аудита`
          }
        />
        <EstimateStat />
      </StatGrid>

      <OrderStrip />

      <Section
        title="Балл за полгода"
        aside={
          points.length >= 2 ? (
            <span style={{ fontSize: 12, color: MUTED }}>
              {dateLong(points[0].date, false)} — {dateLong(points[points.length - 1].date, false)}
            </span>
          ) : undefined
        }
      >
        {points.length >= 2 ? (
          <ScoreChart points={points} />
        ) : (
          <Empty title="Динамики пока нет">
            График строится по завершённым аудитам проекта за полгода, нужно хотя бы два.{' '}
            {points.length === 1 ? 'Сейчас аудит один — ' : 'Пока ни одного — '}
            <Link to="/app/audit">запустите аудит</Link>, например после правок.
          </Empty>
        )}
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
        <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', minWidth: 0 }}>
          <h2 style={{ fontSize: 20, margin: '0 0 var(--space-6)' }}>Здоровье сайта по категориям</h2>
          {reportLoading ? (
            <Loading />
          ) : report?.result ? (
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {MEASURED_CATEGORIES.map((c) => {
                const v = report.result?.[c.key] ?? null;
                return <ScoreBar key={c.key} label={c.label} value={v} critical={v !== null && v < CRITICAL_SCORE} />;
              })}
              {/* Отдельных оценок мобильной версии и удобства scoring-processor не считает. */}
              <NotMeasuredBar label="Мобильная версия" needs="краулер не замеряет страницы в мобильном виде" />
              <NotMeasuredBar label="Удобство использования" needs="проверки удобства в аудите нет" />
            </div>
          ) : (
            <Empty title="Баллов пока нет" action={<Link to="/app/audit">Запустить аудит</Link>}>
              Баллы по категориям появятся, когда завершится первый аудит проекта.
            </Empty>
          )}
        </section>

        <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', minWidth: 0 }}>
          <h2 style={{ fontSize: 20, margin: '0 0 var(--space-4)' }}>Что сделать в первую очередь</h2>
          {reportLoading ? (
            <Loading />
          ) : todo.length === 0 ? (
            <Empty title={last ? 'Проблем не найдено' : 'Список пока пуст'}>
              {last
                ? 'В последнем аудите классификатор не нашёл замечаний.'
                : 'Список соберётся из замечаний, когда завершится аудит.'}
            </Empty>
          ) : (
            // Порядок — важность, затем охват страниц (groupIssues). «+N к баллу» не пишем:
            // прирост балла от правки не измеряется, это была бы выдумка.
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 'var(--space-3)' }}>
              {todo.map((g, i) => {
                const price = priceOf(g, rates);
                return (
                  <li
                    key={g.type}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '22px minmax(0,1fr) auto',
                      gap: 'var(--space-3)',
                      paddingBottom: i === todo.length - 1 ? 0 : 'var(--space-3)',
                      borderBottom: i === todo.length - 1 ? 0 : '1px solid var(--color-divider)',
                      alignItems: 'baseline',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: 'var(--color-accent)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 14 }}>{g.title}</span>
                      <span style={{ display: 'block', fontSize: 12, color: MUTED }}>
                        {num(g.count)} {plural(g.count, ['страница', 'страницы', 'страниц'])} ·{' '}
                        {CATEGORY_LABEL[g.category as IssueCategory] ?? g.category}
                        {g.sev === 'critical' ? ' · критично' : ''}
                      </span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, whiteSpace: 'nowrap', color: price === null ? MUTED : undefined }}>
                      {price === null ? '—' : rub(price)}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
          <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate('/app/estimate')}>
            Собрать смету
          </button>
        </section>
      </div>

      {/* Правки под наблюдением. Блок нужен продукту (CMS затирают мета-теги, клиент видит, что
          оплаченное пропало), но журнала установленных правок и еженедельной сверки в бэкенде нет. */}
      <Section
        title="Правки под наблюдением"
        lead="Обновления CMS и выкатки шаблонов затирают мета-теги. Раз в неделю проверяем, на месте ли внесённые правки."
      >
        <NotConnected
          title="Контроль откатов правок пока не работает"
          needs={[
            'журнал установленных правок: страница, поле, значение, дата установки',
            'еженедельная повторная проверка этих страниц и сравнение с журналом',
            'уведомление об откате и бесплатное восстановление из журнала',
          ]}
        />
      </Section>

      <section style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-3)', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 20, margin: 0 }}>Все проекты</h2>
          <Link to="/app/onboarding" style={{ fontSize: 13 }}>
            Добавить проект
          </Link>
        </div>
        {projects.length === 0 ? (
          <Empty title="Проектов нет" action={<Link to="/app/audit">Запустить аудит</Link>}>
            Проект появится после первого аудита сайта.
          </Empty>
        ) : (
          <TableFrame>
            <thead>
              <tr>
                <th>Сайт</th>
                <th>Балл</th>
                <th>Страниц</th>
                <th>Критичных</th>
                <th>Последний аудит</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const done = finishedByHost.get(p.host) ?? null;
                return (
                  <tr
                    key={p.host}
                    data-row
                    data-clickable
                    onClick={() => setHost(p.host)}
                    aria-current={p.host === host ? 'true' : undefined}
                    title="Сделать текущим проектом"
                  >
                    <td style={{ fontSize: 14, fontWeight: p.host === host ? 600 : undefined }}>{p.host}</td>
                    <td style={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>
                      {done?.seoScore !== null && done?.seoScore !== undefined ? Math.round(done.seoScore) : '—'}
                    </td>
                    <td>{num(done?.pagesScanned)}</td>
                    <td>{projectCritical[p.host] !== undefined ? num(projectCritical[p.host]) : '—'}</td>
                    <td>{dateShort(p.lastAudit.createdAt)}</td>
                    <td>{statusTag(p.lastAudit.status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </TableFrame>
        )}
      </section>
    </Screen>
  );
};

export default Overview;
