import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCabinetProject } from '../project';
import { Blueprint, ErrorNote, Loading, MONO, MUTED, PageHead, Screen, Seg, Tag } from '../ui';
import { hostOf, num, plural, rub } from '../format';
import { useWorkRates } from '../estimate/rates';
import { countSeverity, totalPrice } from '../audit/groups';
import { stageLabel } from '../audit/labels';
import { isFinished } from '../audit/queries';
import { PAGE_LIMITS, crawlTarget, etaSeconds, formatDuration, normalizeSiteUrl, type PageLimit } from '../audit/run';
import { useAuditRun } from '../audit/useAuditRun';

/**
 * «Новый аудит» — макет, строки 385–515: баннер прерванного аудита, форма, ход обхода с
 * журналом, итог.
 *
 * В форме только то, что принимает audit-start: адрес и лимит страниц (до 300). Режимы
 * «только изменённое» и «выборка», выбор агента, robots.txt, внешние ссылки и Core Web Vitals
 * краулер не умеет — эти поля видны (макет обещает их продукту), но выключены и подписаны.
 */

const LABEL: React.CSSProperties = { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED };
const BIG: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: 20 };

const Unavailable: React.FC = () => (
  <Tag tone="outline" style={{ marginLeft: 6 }}>
    не подключено
  </Tag>
);

/** Пункт радиосписка режима обхода: заголовок, пояснение, недоступный — приглушён и выключен. */
const ModeOption: React.FC<{ title: React.ReactNode; text: React.ReactNode; checked?: boolean; disabled?: boolean }> = ({
  title,
  text,
  checked,
  disabled,
}) => (
  <label className="radio" style={{ alignItems: 'flex-start', opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : undefined }}>
    <input type="radio" name="crawl-mode" checked={!!checked} disabled={disabled} readOnly />
    <span className="dot" style={{ marginTop: 4 }} />
    <span>
      <span style={{ display: 'block', fontSize: 14 }}>{title}</span>
      <span style={{ display: 'block', fontSize: 12.5, color: MUTED }}>{text}</span>
    </span>
  </label>
);

const OffCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="radio" style={{ opacity: 0.6, cursor: 'not-allowed', flexWrap: 'wrap' }}>
    <input type="checkbox" disabled checked={false} readOnly />
    <span className="dot" />
    {children}
    <Unavailable />
  </label>
);

const Audit: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { project, audits, userId, loading: projectLoading } = useCabinetProject();
  const run = useAuditRun(params.get('task'));
  const { rates } = useWorkRates();
  // ?url= приходит с главной сайта и с шага «Добавить сайт» — адрес должен быть уже в поле.
  const [url, setUrl] = useState(() => params.get('url') ?? '');
  const [limit, setLimit] = useState<PageLimit>(100);
  const [formError, setFormError] = useState<string | null>(null);

  // Поле подставляет адрес текущего проекта, пока человек сам ничего не ввёл.
  const projectUrl = project?.lastAudit.url ?? '';
  useEffect(() => {
    setUrl((cur) => (cur ? cur : projectUrl));
  }, [projectUrl]);

  // «Оценка времени» — по последнему готовому аудиту пользователя, а не цифра из макета.
  const timing = useMemo(() => {
    const a = audits.find((x) => isFinished(x.status) && x.createdAt && x.completedAt && (x.pagesScanned ?? 0) > 0);
    if (!a) return null;
    const sec = (new Date(a.completedAt as string).getTime() - new Date(a.createdAt as string).getTime()) / 1000;
    return sec > 0 ? { sec, pages: a.pagesScanned as number, host: a.host } : null;
  }, [audits]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const normalized = normalizeSiteUrl(url);
    if (!normalized) {
      setFormError('Укажите адрес сайта, например shop.ru');
      return;
    }
    setFormError(null);
    void run.start(normalized, limit);
  };

  const t = run.task;
  const scanned = t?.pages_scanned ?? 0;
  const target = crawlTarget(t?.estimated_pages ?? null, t?.discovered_urls_count ?? null);
  const pct = Math.max(0, Math.min(100, Math.round(t?.progress ?? 0)));

  return (
    <Screen maxWidth={780}>
      <PageHead title="Новый аудит" lead="Укажите адрес — краулер обойдёт сайт и соберёт технический отчёт." />

      {!userId && !projectLoading && <ErrorNote>Нет входа в аккаунт — аудит запускается только из личного кабинета.</ErrorNote>}
      {run.error && <ErrorNote>{run.error}</ErrorNote>}

      {run.phase === 'loading' && <Loading label="Проверяем запущенные аудиты…" />}

      {/* Прерванный аудит: страницы и очередь сохранены, audit-resume продолжает с той же точки. */}
      {run.phase === 'idle' && run.interrupted && (
        <div
          style={{
            border: '1px solid var(--color-accent)',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span data-dot-critical style={{ width: 8, height: 8, flex: 'none' }} />
          <span style={{ flex: 1, minWidth: 200 }}>
            <span style={{ display: 'block', fontSize: 14 }}>
              Аудит {hostOf(run.interrupted.url)} прерван на {Math.round(run.interrupted.progress ?? 0)}%
            </span>
            <span style={{ display: 'block', fontSize: 12.5, color: MUTED }}>
              Обработано {num(run.interrupted.pages_scanned)}{' '}
              {run.interrupted.estimated_pages
                ? `из ${num(run.interrupted.estimated_pages)} ${plural(run.interrupted.estimated_pages, ['страницы', 'страниц', 'страниц'])}`
                : plural(run.interrupted.pages_scanned ?? 0, ['страница', 'страницы', 'страниц'])}{' '}
              · результаты сохранены
            </span>
          </span>
          <button type="button" className="btn btn-primary" onClick={() => void run.resume()} disabled={run.busy}>
            {run.busy ? 'Возобновляем…' : 'Возобновить'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={run.reset} disabled={run.busy}>
            Начать заново
          </button>
        </div>
      )}

      {run.phase === 'idle' && (
        <>
          <Blueprint style={{ padding: 'var(--space-8)' }}>
            <form className="field" style={{ marginBottom: 'var(--space-6)' }} onSubmit={submit} noValidate>
              <label htmlFor="audit-url">Адрес сайта</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <input
                  id="audit-url"
                  className="input"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://shop.ru"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ flex: 1, minWidth: 'min(220px,100%)', minHeight: 42, fontSize: 15 }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={run.busy || !userId}
                  style={{ minHeight: 42, paddingInline: 'var(--space-6)' }}
                >
                  {run.busy ? 'Запускаем…' : 'Запустить'}
                </button>
              </div>
              {formError && <div style={{ fontSize: 12.5, color: 'var(--color-critical)', marginTop: 6 }}>{formError}</div>}
            </form>

            {/* Режим обхода. Сервер умеет один режим — полный обход по sitemap и ссылкам до лимита.
                «Только изменённое» и «выборка» нужны большим каталогам, но сравнения с прошлым
                обходом и шаблонов страниц в краулере нет. */}
            <div className="field" style={{ marginBottom: 'var(--space-6)' }}>
              <label>Режим обхода</label>
              <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                <ModeOption
                  disabled
                  title={
                    <>
                      Только изменённое <Unavailable />
                    </>
                  }
                  text="Сверка lastmod в sitemap и хеша страницы с прошлым обходом. Краулер пока не хранит хеши страниц."
                />
                <ModeOption
                  disabled
                  title={
                    <>
                      Выборка по шаблонам <Unavailable />
                    </>
                  }
                  text="По несколько страниц каждого шаблона. Краулер пока не распознаёт шаблоны страниц."
                />
                <ModeOption
                  checked
                  title="Полный обход"
                  text="Адреса из sitemap.xml и по ссылкам с главной, глубина до 5 переходов, пока не наберётся лимит страниц."
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--space-6)' }}>
              <div className="field">
                <label>Лимит страниц</label>
                <Seg<string>
                  name="audit-limit"
                  value={String(limit)}
                  onChange={(v) => setLimit(Number(v) as PageLimit)}
                  options={PAGE_LIMITS.map((n) => ({ value: String(n), label: num(n) }))}
                />
              </div>
              <div className="field">
                <label>
                  Агент <Unavailable />
                </label>
                {/* Краулер ходит одним собственным User-Agent; мобильного и десктопного режима нет. */}
                <div className="seg" aria-disabled="true" style={{ opacity: 0.6 }}>
                  <label className="seg-opt" style={{ cursor: 'not-allowed' }}>
                    <input type="radio" name="audit-agent" disabled /> Мобильный
                  </label>
                  <label className="seg-opt" style={{ cursor: 'not-allowed' }}>
                    <input type="radio" name="audit-agent" disabled /> Десктоп
                  </label>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gap: 'var(--space-2)',
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-6)',
                borderTop: '1px solid var(--color-divider)',
              }}
            >
              {/* noindex краулер отмечает замечанием, но robots.txt не читает и такие страницы не пропускает. */}
              <OffCheck>Учитывать robots.txt и noindex</OffCheck>
              <OffCheck>Проверять внешние ссылки</OffCheck>
              <OffCheck>Измерять Core Web Vitals на каждой странице</OffCheck>
            </div>
          </Blueprint>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--space-4)' }}>
            <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-3)' }}>
              <div style={{ ...LABEL, marginBottom: 3 }}>В очереди</div>
              {/* Расписания аудитов нет: запущенный обход сразу показывается на этом экране. */}
              <div style={{ fontSize: 14 }}>Нет запланированных</div>
            </div>
            <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-3)' }}>
              <div style={{ ...LABEL, marginBottom: 3 }}>Стоимость обхода</div>
              <div style={{ fontSize: 14 }}>Бесплатно · платите за правки</div>
            </div>
            <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-3)' }}>
              <div style={{ ...LABEL, marginBottom: 3 }}>Оценка времени</div>
              <div style={{ fontSize: 14 }}>
                {timing
                  ? `~ ${formatDuration(timing.sec)} на ${num(timing.pages)} ${plural(timing.pages, ['страницу', 'страницы', 'страниц'])}`
                  : 'Появится после первого аудита'}
              </div>
              {timing && <div style={{ fontSize: 11.5, color: MUTED }}>по прошлому аудиту {timing.host}</div>}
            </div>
          </div>
        </>
      )}

      {run.phase === 'running' && t && (
        <Blueprint style={{ padding: 'var(--space-8)', display: 'grid', gap: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span data-blink style={{ width: 7, height: 7, background: 'var(--color-accent)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26, minWidth: 0, overflowWrap: 'anywhere' }}>
              Сканирование {hostOf(t.url)}
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 34 }}>{pct}%</span>
          </div>
          <div
            style={{
              height: 10,
              background: 'color-mix(in srgb,var(--color-text) 9%,transparent)',
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: 'repeating-linear-gradient(to right,var(--color-divider) 0 1px,transparent 1px 5%)',
            }}
          >
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: 'var(--color-accent)', width: `${pct}%` }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 'var(--space-4)' }}>
            <div>
              <div style={LABEL}>Этап</div>
              <div style={BIG}>{stageLabel(t.status, t.stage)}</div>
            </div>
            <div>
              <div style={LABEL}>Обработано</div>
              <div style={BIG}>{num(scanned)}</div>
            </div>
            <div>
              <div style={LABEL}>В очереди</div>
              <div style={BIG}>{target > 0 ? num(Math.max(0, target - scanned)) : '—'}</div>
            </div>
            <div>
              <div style={LABEL}>Проблем</div>
              {/* Замечания классифицируются после обхода — до этого честное число неизвестно. */}
              <div style={BIG} title="Замечания считаются после обхода">
                —
              </div>
            </div>
            <div>
              <div style={LABEL}>Осталось</div>
              <div style={BIG}>{t.status === 'completed' ? '—' : formatDuration(etaSeconds(run.samples, target))}</div>
            </div>
          </div>
          <div
            aria-live="polite"
            style={{
              border: '1px solid var(--color-divider)',
              background: 'color-mix(in srgb,var(--color-text) 4%,transparent)',
              padding: 'var(--space-3)',
              fontFamily: MONO,
              fontSize: 11.5,
              lineHeight: 1.75,
              height: 168,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          >
            {run.log.length === 0 ? (
              <div style={{ color: MUTED }}>ждём первые страницы…</div>
            ) : (
              run.log.map((line, i) => (
                <div key={`${i}-${line}`} style={{ color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {line}
                </div>
              ))
            )}
          </div>
          {t.status !== 'completed' ? (
            <button type="button" className="btn btn-secondary" onClick={() => void run.cancel()} disabled={run.busy} style={{ justifySelf: 'start' }}>
              {run.busy ? 'Прерываем…' : 'Прервать'}
            </button>
          ) : (
            <div style={{ fontSize: 12.5, color: MUTED }}>Обход закончен, считаем баллы и замечания.</div>
          )}
        </Blueprint>
      )}

      {run.phase === 'done' && run.done && (
        <DoneBlock
          info={run.done}
          rates={rates}
          onResults={() => navigate(`/app/results?audit=${run.done?.audit.id ?? ''}`)}
          onEstimate={() => navigate('/app/estimate')}
          onReset={run.reset}
        />
      )}
    </Screen>
  );
};

const DoneBlock: React.FC<{
  info: NonNullable<ReturnType<typeof useAuditRun>['done']>;
  rates: { id: string; rate: number }[];
  onResults: () => void;
  onEstimate: () => void;
  onReset: () => void;
}> = ({ info, rates, onResults, onEstimate, onReset }) => {
  const { audit, task, groups, discovered } = info;
  const sev = countSeverity(groups);
  const price = totalPrice(groups, rates);
  // Длительность — от создания задачи до записи балла: это время, которое человек ждал отчёт.
  const sec =
    task.created_at && audit.completed_at
      ? (new Date(audit.completed_at).getTime() - new Date(task.created_at).getTime()) / 1000
      : null;
  const pages = audit.pages_scanned ?? 0;
  return (
    <Blueprint style={{ padding: 'var(--space-8)', display: 'grid', gap: 'var(--space-6)' }}>
      <div>
        <Tag tone="accent">{audit.status === 'partial' ? 'Готово частично' : 'Готово'}</Tag>
        <h2 style={{ fontSize: 28, margin: 'var(--space-3) 0 4px' }}>
          {sec !== null && sec > 0 ? `Аудит завершён за ${formatDuration(sec)}` : 'Аудит завершён'}
        </h2>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
          {discovered ? `Найдено ${num(discovered)} ${plural(discovered, ['адрес', 'адреса', 'адресов'])}, проанализировано` : 'Проанализировано'}{' '}
          {num(pages)} {plural(pages, ['страница', 'страницы', 'страниц'])}
          {audit.status === 'partial' ? ' — обход остановился раньше лимита.' : '.'}
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
          gap: 'var(--space-4)',
          borderTop: '1px solid var(--color-divider)',
          borderBottom: '1px solid var(--color-divider)',
          padding: 'var(--space-4) 0',
        }}
      >
        <div>
          <div style={LABEL}>Балл</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30 }}>{audit.seo_score !== null ? Math.round(audit.seo_score) : '—'}</div>
        </div>
        <div>
          <div style={LABEL}>Критические</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30 }}>{num(sev.critical)}</div>
        </div>
        <div>
          <div style={LABEL}>Предупреждения</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30 }}>{num(sev.warn)}</div>
        </div>
        <div>
          <div style={LABEL}>Смета</div>
          {/* Сумма — ставки сметы × страницы; без ставок число не показываем. */}
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30, color: price.priced ? undefined : MUTED }}>
            {price.priced ? rub(price.total) : '—'}
          </div>
          {!price.priced && <div style={{ fontSize: 11.5, color: MUTED }}>ставки задаются в смете</div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-primary" onClick={onResults}>
          Открыть отчёт
        </button>
        <button type="button" className="btn btn-secondary" onClick={onEstimate}>
          Смета на исправления
        </button>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Новый аудит
        </button>
      </div>
    </Blueprint>
  );
};

export default Audit;
