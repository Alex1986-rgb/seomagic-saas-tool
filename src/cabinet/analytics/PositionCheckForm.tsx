import React, { useEffect, useRef, useState } from 'react';
import { checkPositions } from '@/services/position/positionTracker';
import { ErrorNote, Kicker, MUTED, Section, Seg } from '../ui';
import { num, plural } from '../format';
import { parseKeywords, REGIONS, type RegionKey } from './positions-model';
import type { CheckRow } from './positions-model';

/**
 * Запуск проверки позиций из кабинета.
 *
 * Работает через существующий сервис checkPositions → edge-функция positions-check (ставит
 * запросы в очередь) → positions-processor (XMLRiver). Сам сервис ждёт завершения, но ход
 * проверки экран берёт из position_checks: так прогресс виден и после ухода со страницы, и в
 * другой вкладке.
 *
 * Регион Яндекса передаётся числовым кодом lr (старая форма слала «Москва» текстом, и поставщик
 * получал неверный регион). Google город не принимает — ему регион не передаём, serp.ts берёт
 * страну «ru». Поэтому «обе системы» — это две проверки: одна строка региона на обе системы
 * ушла бы в Google кодом Яндекса.
 */

type EngineChoice = 'yandex' | 'google' | 'all';

/** Глубина выдачи. Поставщик отдаёт по 10 результатов за платное обращение. */
const DEPTH = 100;
const PAGE_SIZE_HINT = 10;
/** Тот же потолок, что в positions-check: дальше функция откажет, лучше сказать заранее. */
const MAX_PROVIDER_REQUESTS = 1000;

export const PositionCheckForm: React.FC<{
  host: string;
  region: RegionKey;
  initialKeywords: string[];
  running: CheckRow[];
  onStarted: () => void;
  onFinished: () => void;
}> = ({ host, region, initialKeywords, running, onStarted, onFinished }) => {
  const [text, setText] = useState(initialKeywords.join('\n'));
  const [engine, setEngine] = useState<EngineChoice>('yandex');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const touched = useRef(false);
  const alive = useRef(true);

  useEffect(
    () => () => {
      alive.current = false;
    },
    [],
  );

  // Список запросов подставляется из последней проверки, пока пользователь не начал его править.
  useEffect(() => {
    if (!touched.current) setText(initialKeywords.join('\n'));
  }, [initialKeywords]);

  const keywords = parseKeywords(text);
  const engines = engine === 'all' ? 2 : 1;
  const requests = keywords.length * engines * Math.ceil(DEPTH / PAGE_SIZE_HINT);
  const tooMany = requests > MAX_PROVIDER_REQUESTS;
  const regionInfo = REGIONS.find((r) => r.value === region)!;

  const start = async () => {
    setError(null);
    if (keywords.length === 0) {
      setError('Добавьте хотя бы один запрос — по одному на строку.');
      return;
    }
    if (tooMany) return;
    setBusy(true);
    let reported = false;
    // Первое сообщение о ходе приходит сразу после постановки в очередь — в этот момент
    // проверка уже есть в базе, и экран может показать её прогресс.
    const onProgress = () => {
      if (reported) return;
      reported = true;
      onStarted();
    };
    const runs: Promise<unknown>[] = [];
    if (engine === 'yandex' || engine === 'all') {
      runs.push(
        checkPositions(
          { domain: host, keywords, searchEngine: 'yandex', region: regionInfo.lr, depth: DEPTH, scanFrequency: 'manual' },
          onProgress,
        ),
      );
    }
    if (engine === 'google' || engine === 'all') {
      runs.push(
        checkPositions({ domain: host, keywords, searchEngine: 'google', depth: DEPTH, scanFrequency: 'manual' }, onProgress),
      );
    }
    const settled = await Promise.allSettled(runs);
    if (!alive.current) return;
    const failed = settled.find((s): s is PromiseRejectedResult => s.status === 'rejected');
    if (failed) setError(failed.reason instanceof Error ? failed.reason.message : 'Проверка не запустилась');
    setBusy(false);
    onFinished();
  };

  const inProgress = running.length > 0;

  return (
    <Section
      title="Проверить позиции"
      lead={`Съём по расписанию не подключён — проверка запускается вручную. Яндекс: регион «${regionInfo.label}» из фильтра выше; Google — по России.`}
    >
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div className="field">
          <label htmlFor="pos-keywords">Запросы — по одному на строку</label>
          <textarea
            id="pos-keywords"
            className="input"
            rows={6}
            value={text}
            onChange={(e) => {
              touched.current = true;
              setText(e.target.value);
            }}
            disabled={busy}
            style={{ width: '100%', fontSize: 14 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field">
            <label>Поисковая система</label>
            <Seg<EngineChoice>
              name="pos-engine"
              value={engine}
              onChange={setEngine}
              options={[
                { value: 'yandex', label: 'Яндекс' },
                { value: 'google', label: 'Google' },
                { value: 'all', label: 'Обе' },
              ]}
            />
          </div>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12.5, color: tooMany ? 'var(--color-text)' : MUTED }}>
            {num(keywords.length)} {plural(keywords.length, ['запрос', 'запроса', 'запросов'])} · глубина {DEPTH} ·{' '}
            {num(requests)} {plural(requests, ['обращение', 'обращения', 'обращений'])} к поставщику
          </span>
          <button type="button" className="btn btn-primary" onClick={() => void start()} disabled={busy || inProgress || tooMany}>
            {busy || inProgress ? 'Проверка идёт…' : 'Запустить проверку'}
          </button>
        </div>
        {tooMany && (
          <ErrorNote>
            За один раз — не больше {num(MAX_PROVIDER_REQUESTS)} обращений к поставщику выдачи. Сократите список запросов
            или выберите одну систему.
          </ErrorNote>
        )}
        {inProgress && (
          <div style={{ display: 'grid', gap: 6 }}>
            {running.map((c) => (
              <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <span data-blink style={{ width: 7, height: 7, background: 'var(--color-accent)', flex: 'none' }} />
                <Kicker muted style={{ fontSize: 11 }}>
                  {c.search_engine === 'google' ? 'Google' : c.search_engine === 'yandex' ? 'Яндекс' : 'Яндекс и Google'}
                </Kicker>
                <span>
                  проверено {num(c.keywords_checked)} из {num(c.keywords_total)}
                </span>
              </div>
            ))}
          </div>
        )}
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>
    </Section>
  );
};
