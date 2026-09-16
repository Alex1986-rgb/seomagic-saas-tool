import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCabinetProject } from '../project';
import { Blueprint, CopyButton, Empty, ErrorNote, Kicker, Loading, MONO, MUTED, Screen, SevChip, Tag } from '../ui';
import { dateLong, num, plural, rub } from '../format';
import { useWorkRates } from '../estimate/rates';
import { countSeverity, normGroups, priceOf, type IssueGroup } from '../audit/groups';
import { CATEGORY_LABEL, CRITICAL_SCORE, pathOf, type IssueCategory } from '../audit/labels';
import { isFinished } from '../audit/queries';
import { MEASURED_CATEGORIES, scoreOf, useAuditReport } from '../audit/useAuditReport';
import { deltaText } from '../audit/parts';
import { ExportDialog } from '../audit/ExportDialog';

/**
 * «Результаты аудита» — макет, строки 516–674.
 *
 * Какой аудит: ?audit=<id> или последний готовый аудит текущего проекта. Баллы по категориям —
 * audit_results (scoring-processor), проблемы — таблица issues, сгруппированная по типу, адреса —
 * page_analysis. Стрелки «↑ 4» — разница с предыдущим готовым аудитом того же сайта.
 * «Мобильная версия» и «Удобство» сервер не считает — ячейки остаются, но без числа.
 */

type Filter = 'all' | 'critical' | 'warn' | 'ok';
const SHOWN = 5;

const Results: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loading, error, userId, audits, host, setHost } = useCabinetProject();
  const { rates } = useWorkRates();
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [exportOpen, setExportOpen] = useState(false);

  const auditParam = params.get('audit');
  // Аудит из адреса может быть другого сайта — ищем среди всех аудитов пользователя.
  const target = useMemo(() => {
    if (auditParam) return audits.find((a) => a.id === auditParam && isFinished(a.status)) ?? null;
    return audits.find((a) => a.host === host && isFinished(a.status)) ?? null;
  }, [audits, auditParam, host]);
  const siteFinished = useMemo(
    () => (target ? audits.filter((a) => a.host === target.host && isFinished(a.status)) : []),
    [audits, target],
  );
  const idx = target ? siteFinished.findIndex((a) => a.id === target.id) : -1;
  const prev = idx >= 0 ? siteFinished[idx + 1] ?? null : null;

  // Открыли аудит другого сайта по ссылке — переключаем проект, чтобы сайдбар говорил о том же сайте.
  useEffect(() => {
    if (target && target.host !== host) setHost(target.host);
  }, [target, host, setHost]);

  const { report, loading: reportLoading, error: reportError } = useAuditReport(target, prev, { withPages: true });

  const found = report?.groups ?? [];
  const pageCount = report?.result?.page_count ?? target?.pagesScanned ?? 0;
  const norm = useMemo(() => normGroups(found, pageCount), [found, pageCount]);
  const sev = countSeverity(found);
  const rows: IssueGroup[] =
    filter === 'all' ? [...found, ...norm] : filter === 'ok' ? norm : found.filter((g) => g.sev === filter);

  if (loading) {
    return (
      <Screen>
        <h1 style={{ fontSize: 36, margin: 0 }}>Результаты аудита</h1>
        <Loading />
      </Screen>
    );
  }

  const running = audits.find((a) => a.host === host && !isFinished(a.status) && !['failed', 'error', 'cancelled'].includes(a.status));

  if (!target) {
    return (
      <Screen>
        <h1 style={{ fontSize: 36, margin: 0 }}>Результаты аудита</h1>
        {error && <ErrorNote>Не удалось загрузить аудиты: {error}</ErrorNote>}
        {auditParam ? (
          <Empty title="Аудит не найден" action={<Link to="/app/results">К последнему аудиту</Link>}>
            Такого готового аудита нет среди ваших: он ещё идёт, прерван или принадлежит другому аккаунту.
          </Empty>
        ) : running ? (
          <Empty title="Аудит ещё идёт" action={<Link to="/app/audit">Смотреть ход обхода</Link>}>
            Результаты появятся здесь, когда обход закончится и будут посчитаны баллы.
          </Empty>
        ) : (
          <Empty title="Готовых аудитов нет" action={<Link to="/app/audit">Запустить аудит</Link>}>
            Запустите аудит сайта — здесь появятся баллы по категориям и список найденных проблем.
          </Empty>
        )}
      </Screen>
    );
  }

  const result = report?.result ?? null;
  const score = scoreOf(result, target);
  const prevScore = report?.prevResult ? scoreOf(report.prevResult, prev) : prev?.seoScore ?? null;
  const filled = score !== null ? Math.round(Math.max(0, Math.min(100, score)) / 5) : 0;

  // Итог под баллом — только сравнение чисел, без объяснения причин: причин аудит не знает.
  const prevResult = report?.prevResult ?? null;
  const moves: { label: string; d: number }[] = [];
  for (const c of MEASURED_CATEGORIES) {
    const cur = result ? result[c.key] : null;
    const was = prevResult ? prevResult[c.key] : null;
    if (cur !== null && was !== null) moves.push({ label: c.label, d: Math.round(cur) - Math.round(was) });
  }
  const best = moves.filter((m) => m.d > 0).sort((a, b) => b.d - a.d)[0];
  const worst = moves.filter((m) => m.d < 0).sort((a, b) => a.d - b.d)[0];

  const tabs: { value: Filter; label: string }[] = [
    { value: 'all', label: `Все ${num(sev.total)}` },
    { value: 'critical', label: `Критические ${num(sev.critical)}` },
    { value: 'warn', label: `Предупреждения ${num(sev.warn)}` },
    { value: 'ok', label: 'Норма' },
  ];

  const categoryCell = (label: string, value: number | null, delta: ReturnType<typeof deltaText>, needs?: string) => (
    <div key={label} style={{ outline: '1px solid var(--color-divider)', padding: 'var(--space-4)', display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
      <span style={{ fontSize: 12.5, color: MUTED }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 32, lineHeight: 1, color: needs ? MUTED : undefined }}>
        {value !== null ? Math.round(value) : '—'}
      </span>
      {needs ? (
        <div style={{ height: 5, border: '1px dashed var(--color-divider)' }} />
      ) : (
        <div style={{ height: 5, background: 'color-mix(in srgb,var(--color-text) 9%,transparent)', position: 'relative' }}>
          <div
            {...(value !== null && value < CRITICAL_SCORE ? { 'data-bar-critical': '' } : {})}
            style={{
              position: 'absolute',
              inset: `0 ${100 - Math.max(0, Math.min(100, value ?? 0))}% 0 0`,
              ...(value !== null && value < CRITICAL_SCORE ? {} : { background: 'var(--color-accent)' }),
            }}
          />
        </div>
      )}
      <span style={{ fontSize: 11.5, color: delta?.up ? 'var(--color-accent-700)' : MUTED }}>
        {needs ? `Не подключено: ${needs}` : delta ? delta.text : prev ? '—' : 'первый аудит'}
      </span>
    </div>
  );

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 'min(240px,100%)' }}>
          {/* Номер — порядковый номер готового аудита этого сайта, а не выдуманный номер заказа. */}
          <Tag tone="accent">Аудит №{siteFinished.length - idx}</Tag>
          <h1 style={{ fontSize: 36, margin: 'var(--space-2) 0 4px' }}>Результаты аудита</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: 0, overflowWrap: 'anywhere' }}>
            {target.host} · {dateLong(target.completedAt ?? target.createdAt)} · {num(pageCount)}{' '}
            {plural(pageCount, ['страница', 'страницы', 'страниц'])}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setExportOpen(true)} disabled={!report}>
            Экспорт
          </button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/app/estimate')}>
            Исправить
          </button>
        </div>
      </div>

      {error && <ErrorNote>Не удалось загрузить аудиты: {error}</ErrorNote>}
      {reportError && <ErrorNote>Не удалось загрузить результаты: {reportError}</ErrorNote>}
      {result?.is_partial && (
        <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-3) var(--space-4)', fontSize: 13, color: MUTED }}>
          Аудит частичный{result.completion_percentage !== null ? ` — обойдено ${Math.round(result.completion_percentage)} % от лимита` : ''}.
          {result.partial_data_note ? ` ${result.partial_data_note}` : ''}
        </div>
      )}

      {reportLoading && !report ? (
        <Loading label="Загружаем результаты…" />
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
            <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)', flex: '1 1 230px', minWidth: 0 }}>
              <Kicker>Итоговая оценка</Kicker>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 82, lineHeight: 0.9 }}>{score !== null ? Math.round(score) : '—'}</span>
                <span style={{ fontSize: 15, color: MUTED }}>/100</span>
              </span>
              {/* 20 делений по 5 пунктов: заполненные — полной высоты, остальные ниже и серые. */}
              <div style={{ display: 'flex', gap: 2, height: 26, alignItems: 'flex-end' }} aria-hidden="true">
                {Array.from({ length: 20 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      flex: 1,
                      height: i < filled ? '100%' : '60%',
                      background: i < filled ? 'var(--color-accent)' : 'color-mix(in srgb,var(--color-text) 14%,transparent)',
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: 12.5, color: MUTED, borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-3)' }}>
                {prevScore === null
                  ? 'Первый аудит сайта — сравнивать пока не с чем.'
                  : `Прошлый аудит — ${Math.round(prevScore)}.`}
                {best ? ` Больше всего выросла категория «${best.label}» (+${best.d}).` : ''}
                {worst ? ` Просела «${worst.label}» (−${Math.abs(worst.d)}).` : ''}
              </div>
            </Blueprint>

            <div
              style={{
                flex: '3 1 480px',
                minWidth: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(168px,100%),1fr))',
                gap: 1,
                border: '1px solid var(--color-divider)',
              }}
            >
              {MEASURED_CATEGORIES.map((c) => {
                const v = result?.[c.key] ?? null;
                return categoryCell(c.label, v, deltaText(v, report?.prevResult?.[c.key]));
              })}
              {categoryCell('Мобильная версия', null, null, 'нет замера мобильного вида')}
              {categoryCell('Удобство', null, null, 'нет проверки удобства')}
            </div>
          </div>

          <section style={{ minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
                borderBottom: '1px solid var(--color-divider)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <h2 style={{ fontSize: 20, margin: '0 0 var(--space-3)' }}>Найденные проблемы</h2>
              <div role="tablist" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                {tabs.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    role="tab"
                    aria-selected={filter === t.value}
                    data-tab
                    data-active={filter === t.value ? '1' : '0'}
                    onClick={() => setFilter(t.value)}
                    style={{ font: 'inherit', fontSize: 13, paddingBottom: 'var(--space-3)', border: 0, borderBottom: '2px solid transparent', background: 'transparent' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: MUTED, margin: '0 0 var(--space-3)' }}>
              Нажмите на строку, чтобы увидеть затронутые адреса.
              {rates.length === 0 && (
                <>
                  {' '}
                  Стоимость появится, когда заданы ставки — <Link to="/app/estimate">в смете</Link>.
                </>
              )}
            </p>

            {found.length === 0 && filter !== 'ok' ? (
              <Empty title="Проблем не найдено">
                Классификатор не записал замечаний по этому аудиту. Если аудит закончился только что, обновите страницу через
                минуту — замечания пишутся после расчёта баллов.
              </Empty>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)' }}>
                <table className="table" style={{ minWidth: 820 }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Проблема</th>
                      <th>Категория</th>
                      <th style={{ textAlign: 'right' }}>Страниц</th>
                      <th>Влияние</th>
                      <th>Уровень</th>
                      <th style={{ textAlign: 'right' }}>Стоимость</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((g) => {
                      const cat = CATEGORY_LABEL[g.category as IssueCategory] ?? g.category;
                      if (g.sev === 'ok') {
                        return (
                          <tr key={`ok-${g.type}`} data-row data-sev="ok">
                            <td style={{ paddingLeft: 34 }}>
                              <span style={{ display: 'block', fontSize: 14 }}>{g.title}</span>
                              <span style={{ fontSize: 11.5, color: MUTED }}>Проверено, замечаний нет</span>
                            </td>
                            <td>{cat}</td>
                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 15 }}>{num(g.count)}</td>
                            <td>—</td>
                            <td>
                              <Tag tone="neutral">Норма</Tag>
                            </td>
                            <td style={{ textAlign: 'right', color: MUTED }}>—</td>
                          </tr>
                        );
                      }
                      const isOpen = !!open[g.type];
                      const price = priceOf(g, rates);
                      const all = !!expanded[g.type];
                      const shown = all ? g.pages : g.pages.slice(0, SHOWN);
                      return (
                        <React.Fragment key={g.type}>
                          <tr
                            data-row
                            data-clickable
                            data-sev={g.sev}
                            data-open={isOpen ? '1' : '0'}
                            onClick={() => setOpen((o) => ({ ...o, [g.type]: !o[g.type] }))}
                            aria-expanded={isOpen}
                          >
                            <td>
                              <span style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                                <span data-caret style={{ color: 'var(--color-accent)', fontSize: 11 }}>
                                  ▸
                                </span>
                                <span>
                                  <span style={{ display: 'block', fontSize: 14 }}>{g.title}</span>
                                  {g.advice && <span style={{ fontSize: 11.5, color: MUTED }}>{g.advice}</span>}
                                </span>
                              </span>
                            </td>
                            <td>{cat}</td>
                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 15 }}>{num(g.count)}</td>
                            <td>{g.impact}</td>
                            <td>
                              <SevChip sev={g.sev}>{g.sev === 'critical' ? 'Критично' : 'Предупреждение'}</SevChip>
                            </td>
                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 15, whiteSpace: 'nowrap' }}>
                              {price !== null ? (
                                rub(price)
                              ) : (
                                <span style={{ color: MUTED }}>
                                  —
                                  {rates.length === 0 && (
                                    <Link
                                      to="/app/estimate"
                                      onClick={(e) => e.stopPropagation()}
                                      style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11.5 }}
                                    >
                                      в смете
                                    </Link>
                                  )}
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr data-detail data-open={isOpen ? '1' : '0'}>
                            <td colSpan={6} style={{ padding: 'var(--space-4) var(--space-4) var(--space-4) 34px' }}>
                              <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>
                                Затронутые адреса · показано {num(shown.length)} из {num(g.count)}
                              </div>
                              {g.pages.length === 0 ? (
                                <div style={{ fontSize: 13, color: MUTED }}>Адреса у этих замечаний не сохранились.</div>
                              ) : (
                                <div style={{ display: 'grid', gap: 4, fontFamily: MONO, fontSize: 12 }}>
                                  {shown.map((p, i) => (
                                    <span key={`${p.url}-${i}`} style={{ overflowWrap: 'anywhere' }}>
                                      <Link to={`/app/page?url=${encodeURIComponent(p.url)}`} style={{ color: 'inherit' }}>
                                        {pathOf(p.url)}
                                      </Link>
                                      {p.note && <span style={{ color: MUTED }}> — {p.note}</span>}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  disabled={g.pages.length === 0}
                                  onClick={() => navigate(`/app/page?url=${encodeURIComponent(g.pages[0].url)}`)}
                                >
                                  Открыть страницу
                                </button>
                                {g.pages.length > 0 && (
                                  <CopyButton text={g.pages.map((p) => p.url).join('\n')} label="Скопировать адреса" className="btn btn-ghost" />
                                )}
                                {g.pages.length > SHOWN && (
                                  <button type="button" className="btn btn-ghost" onClick={() => setExpanded((x) => ({ ...x, [g.type]: !all }))}>
                                    {all ? 'Свернуть' : `Показать все ${num(g.pages.length)}`}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        userId={userId}
        taskId={report?.task?.id ?? null}
        host={target.host}
        date={target.completedAt ?? target.createdAt}
        score={score}
        categories={MEASURED_CATEGORIES.map((c) => ({ label: c.label, score: result?.[c.key] ?? null }))}
        groups={found}
      />
    </Screen>
  );
};

export default Results;
