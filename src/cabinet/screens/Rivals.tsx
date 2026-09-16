import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCabinetProject } from '../project';
import { Empty, ErrorNote, Loading, MUTED, NotConnected, PageHead, Screen, TableFrame, Tag } from '../ui';
import { usePositionHistory } from '../analytics/usePositionHistory';
import {
  buildKeywordRows,
  normalizeYandexRegion,
  pathOf,
  positionLabel,
  REGIONS,
  sortRows,
  type KeywordRow,
  type RegionKey,
} from '../analytics/positions-model';

/**
 * «Конкуренты» — макет, строки 1401–1451.
 *
 * Соседей по выдаче кабинет не знает: positions-processor получает от поставщика всю выдачу,
 * но в position_results сохраняет только позицию и адрес нашего домена (findDomainPosition),
 * остальные адреса отбрасываются. Поэтому «Видимость по общему ядру» и колонки конкурентов —
 * «не подключено», без доменов и процентов макета.
 *
 * Настоящая часть экрана — «Где вы отстаёте» по своим позициям: запросы, где сайт вне ТОП-10
 * в последней проверке. Причину отставания не выводим — её никто не измерял.
 */

const OUTSIDE_TOP = 10;

function best(row: KeywordRow): number {
  const found = [row.ya?.position, row.gg?.position].filter((p): p is number => typeof p === 'number' && p > 0);
  return found.length ? Math.min(...found) : Number.POSITIVE_INFINITY;
}

const Rivals: React.FC = () => {
  const { userId, host, loading: projectLoading, error: projectError } = useCabinetProject();
  const history = usePositionHistory(userId, host);

  // Регион берём из последней завершённой проверки — её данные самые свежие.
  const region = useMemo<RegionKey>(() => {
    const done = history.checks.find((c) => (c.status === 'completed' || c.status === 'partial') && c.search_engine !== 'google');
    const lr = normalizeYandexRegion(done?.region);
    return REGIONS.find((r) => r.lr === lr)?.value ?? 'msk';
  }, [history.checks]);

  const lagging = useMemo(() => {
    const rows = buildKeywordRows(history.checks, history.results, region);
    return sortRows(
      rows.filter((r) => best(r) > OUTSIDE_TOP),
      'ya',
      1,
    );
  }, [history.checks, history.results, region]);

  if (projectLoading) return <Screen maxWidth={1100}><Loading /></Screen>;
  if (projectError) return <Screen maxWidth={1100}><ErrorNote>{projectError}</ErrorNote></Screen>;
  if (!host) {
    return (
      <Screen maxWidth={1100}>
        <PageHead title="Конкуренты" />
        <Empty title="Сначала проверьте сайт" action={<Link to="/app/audit" className="btn btn-primary">Запустить аудит</Link>}>
          Проект появляется после первого аудита.
        </Empty>
      </Screen>
    );
  }

  const regionLabel = REGIONS.find((r) => r.value === region)!.label;

  return (
    <Screen maxWidth={1100}>
      <PageHead
        title="Конкуренты"
        lead="Домены, которые чаще всего стоят рядом с вами в выдаче по вашим запросам, — после того как кабинет начнёт сохранять выдачу целиком."
      />

      <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', minWidth: 0 }}>
        <h2 style={{ fontSize: 18, margin: '0 0 var(--space-6)' }}>Видимость по общему ядру</h2>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5, gap: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500, wordBreak: 'break-all' }}>
                {host} <Tag style={{ marginLeft: 6 }}>вы</Tag>
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }}>—</span>
            </div>
            <div style={{ height: 9, background: 'color-mix(in srgb,var(--color-text) 9%,transparent)' }} />
          </div>
          <NotConnected
            title="Соседи по выдаче не сохраняются"
            needs={[
              'Сохранять выдачу целиком при проверке позиций: таблица вида position_serp (check_id, keyword, search_engine, position, domain, url) — пишет positions-processor, данные у него уже есть.',
              'Частотность запросов (Wordstat) — без неё «видимость» не посчитать ни для вас, ни для конкурентов.',
            ]}
          >
            Проверка позиций получает от поставщика всю выдачу, но хранит только ваш адрес. Поэтому доли видимости и список
            доменов рядом с вами не показываем — цифр под ними нет.
          </NotConnected>
        </div>
      </section>

      <section style={{ minWidth: 0 }}>
        <h2 style={{ fontSize: 20, margin: '0 0 var(--space-3)' }}>Где вы отстаёте</h2>
        <p style={{ fontSize: 13, color: MUTED, margin: '0 0 var(--space-3)', maxWidth: '72ch' }}>
          Запросы, где сайт вне ТОП-{OUTSIDE_TOP} по последней проверке (Яндекс — {regionLabel}). Позиции соседей и причины
          отставания появятся вместе с сохранением выдачи.
        </p>
        {history.error && <ErrorNote>Не удалось загрузить позиции: {history.error}</ErrorNote>}
        {history.loading ? (
          <Loading label="Загружаем проверки…" />
        ) : history.checks.length === 0 ? (
          <Empty title="Позиции ещё не проверялись" action={<Link to="/app/positions" className="btn btn-secondary">Проверить позиции</Link>}>
            Отставание считается по вашим позициям — запустите первую проверку.
          </Empty>
        ) : lagging.length === 0 ? (
          <Empty title={`Все запросы в ТОП-${OUTSIDE_TOP}`}>
            По последней проверке каждый отслеживаемый запрос в первой десятке хотя бы одной системы.
          </Empty>
        ) : (
          <TableFrame minWidth={720}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Запрос</th>
                <th style={{ textAlign: 'right' }}>Вы, Яндекс</th>
                <th style={{ textAlign: 'right' }}>Вы, Google</th>
                <th>Лидеры выдачи</th>
                <th>Целевая страница</th>
              </tr>
            </thead>
            <tbody>
              {lagging.map((r) => (
                <tr key={r.keyword} data-row>
                  <td style={{ fontSize: 14 }}>{r.keyword}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 16 }}>{positionLabel(r.ya)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 16 }}>{positionLabel(r.gg)}</td>
                  <td style={{ fontSize: 12.5, color: MUTED }}>не сохраняются</td>
                  <td style={{ fontSize: 12.5, color: MUTED, wordBreak: 'break-all' }}>{pathOf(r.ya?.url ?? r.gg?.url)}</td>
                </tr>
              ))}
            </tbody>
          </TableFrame>
        )}
      </section>
    </Screen>
  );
};

export default Rivals;
