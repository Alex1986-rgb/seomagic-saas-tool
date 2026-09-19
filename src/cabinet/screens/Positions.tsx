import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCabinetProject } from '../project';
import { Cell, CellGrid, Empty, ErrorNote, Loading, MUTED, PageHead, Screen, Seg, TableFrame } from '../ui';
import { dateLong, num, plural } from '../format';
import { usePositionHistory } from '../analytics/usePositionHistory';
import { PositionCheckForm } from '../analytics/PositionCheckForm';
import { downloadCsv } from '../analytics/files';
import {
  buildKeywordRows,
  pathOf,
  positionDelta,
  positionLabel,
  REGIONS,
  sortRows,
  sparkPoints,
  topCounts,
  type EngineCell,
  type RegionKey,
  type SortKey,
} from '../analytics/positions-model';

/**
 * «Позиции» — макет, строки 1336–1400.
 *
 * Числа — только из position_checks/position_results (выдача XMLRiver через positions-check).
 * Чего поставщик не отдаёт, того на экране нет: частотность (нужен Wordstat), «видимость» и
 * «трафик, прогноз» (оба считаются от частотности) — прочерки с пояснением, а не цифры макета.
 * Засечка установки правок тоже не рисуется: дата выкатки заказа в базе не хранится.
 */

type Period = '7' | '30' | '90';

const Positions: React.FC = () => {
  const { userId, host, loading: projectLoading, error: projectError } = useCabinetProject();
  const history = usePositionHistory(userId, host);
  const [region, setRegion] = useState<RegionKey>('msk');
  const [period, setPeriod] = useState<Period>('30');
  // Частотности нет, поэтому сортировка по умолчанию — по позиции в Яндексе, от лучшей.
  const [sort, setSort] = useState<SortKey>('ya');
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const rows = useMemo(() => buildKeywordRows(history.checks, history.results, region), [history.checks, history.results, region]);
  const sorted = useMemo(() => sortRows(rows, sort, sortDir), [rows, sort, sortDir]);
  const tops = useMemo(() => topCounts(rows), [rows]);
  // Последняя завершённая проверка домена в любом регионе: её дата — в подзаголовке, её запросы —
  // в форме. Мемо, чтобы форма не сбрасывала ввод на каждом рендере.
  const lastDone = useMemo(
    () => history.checks.find((c) => c.status === 'completed' || c.status === 'partial') ?? null,
    [history.checks],
  );
  const lastKeywords = useMemo(() => {
    if (!lastDone) return [];
    return Array.from(new Set(history.results.filter((r) => r.check_id === lastDone.id).map((r) => r.keyword))).sort((a, b) =>
      a.localeCompare(b, 'ru'),
    );
  }, [lastDone, history.results]);
  const lastCheckedAt = lastDone?.completed_at ?? lastDone?.created_at ?? null;

  if (projectLoading) return <Screen maxWidth={1180}><Loading /></Screen>;
  if (projectError) return <Screen maxWidth={1180}><ErrorNote>{projectError}</ErrorNote></Screen>;
  if (!host) {
    return (
      <Screen maxWidth={1180}>
        <PageHead title="Позиции" />
        <Empty title="Сначала проверьте сайт" action={<Link to="/app/audit" className="btn btn-primary">Запустить аудит</Link>}>
          Проект появляется после первого аудита — позиции отслеживаются для его домена.
        </Empty>
      </Screen>
    );
  }

  const sinceMs = Date.now() - Number(period) * 86400000;

  // Сортировка как в макете: повторный щелчок по той же колонке разворачивает порядок.
  const sortBy = (key: SortKey) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (sort === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSort(key);
      setSortDir(1);
    }
  };
  const arrow = (key: SortKey) => (sort === key ? (sortDir === 1 ? ' ↑' : ' ↓') : '');
  const sortHead = (key: SortKey, label: string) => (
    <button
      type="button"
      data-tab
      data-active={sort === key ? '1' : '0'}
      onClick={sortBy(key)}
      style={{ font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', padding: 0, border: 0, borderBottom: '2px solid transparent' }}
    >
      {label}
      {arrow(key)}
    </button>
  );

  const exportCsv = () => {
    const d = (c: EngineCell | null) => positionDelta(c)?.label ?? '';
    downloadCsv(
      `pozicii-${host}-${REGIONS.find((r) => r.value === region)!.value}.csv`,
      ['Запрос', 'Яндекс', 'Яндекс, динамика', 'Google', 'Google, динамика', 'Целевая страница'],
      sorted.map((r) => [
        r.keyword,
        positionLabel(r.ya),
        d(r.ya),
        positionLabel(r.gg),
        d(r.gg),
        (r.ya?.url ?? r.gg?.url) || '',
      ]),
    );
  };

  const engineName = tops.engine === 'google' ? 'Google' : 'Яндексу';
  const lead =
    rows.length > 0
      ? `${num(rows.length)} ${plural(rows.length, ['запрос', 'запроса', 'запросов'])}, последняя проверка ${dateLong(lastCheckedAt)}. Сводка ТОП — по ${engineName}.`
      : 'Позиции ещё не проверялись. Добавьте запросы и запустите проверку ниже.';

  const posCell = (cell: EngineCell | null) => {
    const delta = positionDelta(cell);
    return (
      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>{positionLabel(cell)}</span>{' '}
        {delta && <span style={{ fontSize: 11.5, color: delta.up ? 'var(--color-accent-700)' : MUTED }}>{delta.label}</span>}
      </td>
    );
  };

  return (
    <Screen maxWidth={1180}>
      <PageHead title="Позиции" lead={lead} />

      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <CellGrid min={150} style={{ border: '1px solid var(--color-divider)' }}>
          <Cell label="ТОП-3" value={tops.engine ? num(tops.top3) : '—'} />
          <Cell label="ТОП-10" value={tops.engine ? num(tops.top10) : '—'} />
          <Cell label="ТОП-50" value={tops.engine ? num(tops.top50) : '—'} />
          <Cell label="Видимость" value="—" />
          <Cell label="Трафик, прогноз" value="—" />
        </CellGrid>
        {/* Видимость и трафик считаются от частотности запросов; поставщик выдачи её не отдаёт,
            а подставлять оценку «на глаз» запрещено правилами продукта. */}
        <span style={{ fontSize: 12.5, color: MUTED }}>
          Видимость, прогноз трафика и частотность не подключены: нужна частотность запросов (Wordstat), поставщик выдачи
          её не отдаёт.
        </span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="field">
          <label>Регион</label>
          <Seg<RegionKey> name="rg" value={region} onChange={setRegion} options={REGIONS.map((r) => ({ value: r.value, label: r.label }))} />
        </div>
        <div className="field">
          <label>Период</label>
          <Seg<Period>
            name="pd"
            value={period}
            onChange={setPeriod}
            options={[
              { value: '7', label: '7 дней' },
              { value: '30', label: '30 дней' },
              { value: '90', label: '90 дней' },
            ]}
          />
        </div>
        <span style={{ flex: 1 }} />
        <button type="button" className="btn btn-secondary" onClick={exportCsv} disabled={rows.length === 0}>
          Выгрузить
        </button>
      </div>

      {/* Засечка правок в макете берётся из даты установки заказа. Такой даты в базе нет, поэтому
          вместо выдуманной засечки — честная пометка, что движение позиций с заказами не связано. */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center',
          border: '1px solid var(--color-divider)',
          padding: 'var(--space-3) var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ width: 14, height: 0, borderTop: '1px dashed var(--color-accent)', flex: 'none' }} />
        <span style={{ fontSize: 12.5, color: MUTED, flex: '1 1 240px' }}>
          Засечка установки правок появится, когда кабинет начнёт хранить дату выкатки заказа. Пока движение позиций с
          заказами не сопоставляется. Динамика — между двумя последними проверками, линия — за выбранный период.
        </span>
      </div>

      {history.error && <ErrorNote>Не удалось загрузить позиции: {history.error}</ErrorNote>}

      {history.loading ? (
        <Loading label="Загружаем проверки…" />
      ) : rows.length === 0 ? (
        <Empty title={history.checks.length > 0 ? 'В этом регионе проверок нет' : 'Позиции ещё не проверялись'}>
          {history.checks.length > 0
            ? 'Выберите другой регион или запустите проверку для этого.'
            : 'Таблица заполнится после первой проверки: позиция в Яндексе и Google, динамика и целевая страница по каждому запросу.'}
        </Empty>
      ) : (
        <TableFrame minWidth={860}>
          <thead>
            <tr>
              <th style={{ width: '30%' }}>{sortHead('kw', 'Запрос')}</th>
              <th style={{ textAlign: 'right' }} title="Частотность не подключена: нужен Wordstat">
                Частотность
              </th>
              <th style={{ textAlign: 'right' }}>{sortHead('ya', 'Яндекс')}</th>
              <th style={{ textAlign: 'right' }}>{sortHead('gg', 'Google')}</th>
              <th style={{ width: 96 }}>Динамика</th>
              <th>Целевая страница</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const primary = r.ya ?? r.gg;
              const points = primary ? sparkPoints(primary.series, sinceMs) : '';
              return (
                <tr key={r.keyword} data-row>
                  <td style={{ fontSize: 14 }}>{r.keyword}</td>
                  <td style={{ textAlign: 'right', color: MUTED }}>—</td>
                  {posCell(r.ya)}
                  {posCell(r.gg)}
                  <td>
                    {points ? (
                      <svg width="80" height="22" viewBox="0 0 80 22" fill="none" stroke="var(--color-accent)" strokeWidth={1.5} aria-hidden="true">
                        <polyline points={points} />
                      </svg>
                    ) : (
                      <span style={{ fontSize: 11.5, color: MUTED }}>мало проверок</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12.5, color: MUTED, wordBreak: 'break-all' }}>{pathOf(r.ya?.url ?? r.gg?.url)}</td>
                </tr>
              );
            })}
          </tbody>
        </TableFrame>
      )}

      {!history.loading && (
        <PositionCheckForm
          host={host}
          region={region}
          initialKeywords={lastKeywords}
          running={history.running}
          onStarted={() => void history.reload()}
          onFinished={() => void history.reload()}
        />
      )}
    </Screen>
  );
};

export default Positions;
