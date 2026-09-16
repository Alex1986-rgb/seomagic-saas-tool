import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCabinetProject } from '../project';
import { Blueprint, Empty, ErrorNote, Loading, MUTED, PageHead, Screen, TableFrame, Tag } from '../ui';
import { num, plural } from '../format';
import { dateWithYear } from '../analytics/time';
import { downloadCsv } from '../analytics/files';
import { useAuditIssueCounts } from '../analytics/useAuditIssueCounts';
import { chartPoints, describeChange, signed, toggleSelection, type AuditPoint } from '../analytics/history-model';

/**
 * «История аудитов» — макет, строки 1452–1495.
 *
 * Источник — аудиты проекта из контекста (таблица audits) и счётчики проблем из issues.
 * Номера «№418» макета — номера заказов/аудитов, которых в базе нет (id — uuid), поэтому аудит
 * называется порядковым номером внутри проекта. Метка «после правок» не ставится: связи аудита
 * с установленным заказом в базе нет.
 *
 * В сравнении третья плитка макета — «Средняя позиция». Сопоставить проверку позиций с датой
 * аудита нечем (они не связаны), поэтому вместо неё — изменение числа критичных проблем,
 * которое измерено тем же аудитом.
 */

const SCORED = new Set(['completed', 'partial']);

const STATUS_LABEL: Record<string, string> = {
  partial: 'частичный',
  running: 'идёт',
  pending: 'в очереди',
  failed: 'не завершён',
  cancelled: 'отменён',
};

const History: React.FC = () => {
  const { userId, host, projectAudits, loading, error } = useCabinetProject();

  // Балл есть только у завершённых (и частичных) аудитов — сравниваются и рисуются только они.
  // Порядок как в контексте: новые первыми (таблица макета); график разворачивает его ниже.
  const scoredIds = useMemo(
    () => projectAudits.filter((a) => SCORED.has(a.status) && a.seoScore !== null).map((a) => a.id),
    [projectAudits],
  );
  const { counts, loading: countsLoading } = useAuditIssueCounts(userId, scoredIds);

  // Порядковый номер аудита внутри проекта: первый аудит — №1.
  const ordinal = useMemo(() => {
    const m = new Map<string, number>();
    const n = projectAudits.length;
    projectAudits.forEach((a, i) => m.set(a.id, n - i));
    return m;
  }, [projectAudits]);

  const points = useMemo<Map<string, AuditPoint>>(() => {
    const m = new Map<string, AuditPoint>();
    for (const a of projectAudits) {
      const c = counts.get(a.id);
      m.set(a.id, {
        id: a.id,
        createdAt: a.createdAt,
        score: SCORED.has(a.status) ? a.seoScore : null,
        pages: SCORED.has(a.status) ? a.pagesScanned : null,
        issues: c?.issues ?? null,
        critical: c?.critical ?? null,
      });
    }
    return m;
  }, [projectAudits, counts]);

  const [selected, setSelected] = useState<string[]>([]);
  // По умолчанию сравниваем два последних завершённых аудита; при смене проекта выбор сбрасывается.
  useEffect(() => {
    setSelected(scoredIds.slice(0, 2).reverse());
  }, [host, scoredIds]);

  if (loading) return <Screen maxWidth={1100}><Loading /></Screen>;
  if (error) return <Screen maxWidth={1100}><ErrorNote>{error}</ErrorNote></Screen>;
  if (!host || projectAudits.length === 0) {
    return (
      <Screen maxWidth={1100}>
        <PageHead title="История аудитов" />
        <Empty title="Аудитов пока нет" action={<Link to="/app/audit" className="btn btn-primary">Запустить аудит</Link>}>
          История появится после первой проверки сайта.
        </Empty>
      </Screen>
    );
  }

  const oldest = projectAudits[projectAudits.length - 1];
  const lead = `${num(projectAudits.length)} ${plural(projectAudits.length, ['проверка', 'проверки', 'проверок'])} с ${dateWithYear(oldest.createdAt)}. Отметьте две, чтобы сравнить.`;

  // График — только завершённые аудиты, от старых к новым.
  const chronological = projectAudits.filter((a) => scoredIds.includes(a.id)).reverse();
  const scores = chronological.map((a) => a.seoScore as number);
  const pts = chartPoints(scores);

  // Предыдущий завершённый аудит для строки «что изменилось».
  const prevScored = (id: string): AuditPoint | null => {
    const i = scoredIds.indexOf(id);
    return i >= 0 && i + 1 < scoredIds.length ? points.get(scoredIds[i + 1]) ?? null : null;
  };

  // Сравнение: раньше созданный — «было», позже — «стало», независимо от порядка щелчков.
  const pair = selected
    .map((id) => points.get(id))
    .filter((p): p is AuditPoint => !!p)
    .sort((a, b) => Date.parse(a.createdAt ?? '') - Date.parse(b.createdAt ?? ''));
  const [from, to] = pair.length === 2 ? pair : [null, null];

  const diff = (a: number | null | undefined, b: number | null | undefined) =>
    a === null || a === undefined || b === null || b === undefined ? '—' : signed(b - a);

  const exportComparison = () => {
    if (!from || !to) return;
    const row = (label: string, a: number | null, b: number | null) => [label, a, b, diff(a, b)];
    downloadCsv(
      `sravnenie-auditov-${host}.csv`,
      ['Показатель', `Аудит №${ordinal.get(from.id)} (${dateWithYear(from.createdAt)})`, `Аудит №${ordinal.get(to.id)} (${dateWithYear(to.createdAt)})`, 'Изменение'],
      [
        row('Балл', from.score, to.score),
        row('Проблем', from.issues, to.issues),
        row('Критичных проблем', from.critical, to.critical),
        row('Страниц проверено', from.pages, to.pages),
      ],
    );
  };

  const kicker: React.CSSProperties = { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED };

  return (
    <Screen maxWidth={1100}>
      <PageHead title="История аудитов" lead={lead} />

      <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', minWidth: 0 }}>
        {pts.length < 2 ? (
          <div style={{ fontSize: 13.5, color: MUTED }}>
            График балла появится после второго завершённого аудита.
            {pts.length === 1 && ` Сейчас балл ${scores[0]}.`}
          </div>
        ) : (
          <svg
            viewBox="0 0 600 170"
            width="100%"
            height="170"
            preserveAspectRatio="none"
            role="img"
            aria-label={`Балл по аудитам: ${scores.join(', ')}`}
          >
            {[20, 55, 90, 125, 160].map((y) => (
              <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="var(--color-divider)" strokeWidth="1" />
            ))}
            <polyline points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 3} fill="var(--color-accent)" />
            ))}
          </svg>
        )}
      </section>

      <TableFrame minWidth={700}>
        <thead>
          <tr>
            <th style={{ width: 34 }} />
            <th>Аудит</th>
            <th>Дата</th>
            <th style={{ textAlign: 'right' }}>Балл</th>
            <th style={{ textAlign: 'right' }}>Проблем</th>
            <th>Что изменилось</th>
          </tr>
        </thead>
        <tbody>
          {projectAudits.map((a) => {
            const scored = scoredIds.includes(a.id);
            const on = selected.includes(a.id);
            const p = points.get(a.id)!;
            return (
              <tr key={a.id} data-row>
                <td>
                  {scored && (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      aria-label={`Сравнить аудит №${ordinal.get(a.id)}`}
                      onClick={() => setSelected((s) => toggleSelection(s, a.id))}
                      style={{
                        width: 13,
                        height: 13,
                        display: 'block',
                        padding: 0,
                        cursor: 'pointer',
                        border: on ? '1.5px solid var(--color-accent)' : '1.5px solid color-mix(in srgb,var(--color-text) 30%,transparent)',
                        background: on ? 'var(--color-accent)' : 'transparent',
                      }}
                    />
                  )}
                </td>
                <td style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                  №{ordinal.get(a.id)}
                  {STATUS_LABEL[a.status] && (
                    <Tag tone="outline" style={{ marginLeft: 6 }}>
                      {STATUS_LABEL[a.status]}
                    </Tag>
                  )}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{dateWithYear(a.createdAt)}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 16 }}>
                  {scored ? num(a.seoScore) : '—'}
                </td>
                <td style={{ textAlign: 'right' }}>{scored ? (countsLoading && p.issues === null ? '…' : num(p.issues)) : '—'}</td>
                <td style={{ fontSize: 12.5, color: MUTED }}>
                  {scored ? describeChange(prevScored(a.id), p) : a.errorMessage || 'Аудит без результата'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableFrame>

      {from && to ? (
        <Blueprint style={{ padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={kicker}>
              №{ordinal.get(from.id)} → №{ordinal.get(to.id)}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 32, color: MUTED }}>{num(from.score)}</span>
              <span style={{ color: 'var(--color-accent)' }}>→</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>{num(to.score)}</span>
            </div>
          </div>
          <div>
            <div style={kicker}>Проблем</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, marginTop: 4 }}>{diff(from.issues, to.issues)}</div>
          </div>
          <div>
            <div style={kicker}>Критичных</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, marginTop: 4 }}>{diff(from.critical, to.critical)}</div>
          </div>
          <button type="button" className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={exportComparison}>
            Отчёт по сравнению
          </button>
        </Blueprint>
      ) : (
        <div style={{ fontSize: 13, color: MUTED }}>
          {scoredIds.length < 2
            ? 'Сравнение станет доступно после второго завершённого аудита.'
            : 'Отметьте два аудита в таблице, чтобы сравнить балл и число проблем.'}
        </div>
      )}
    </Screen>
  );
};

export default History;
