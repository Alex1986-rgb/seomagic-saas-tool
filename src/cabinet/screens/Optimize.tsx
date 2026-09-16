import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetProject } from '../project';
import { dateLong, hostOf, num } from '../format';
import { Blueprint, Empty, ErrorNote, Kicker, Loading, Meter, MUTED, NotConnected, PageHead, Screen } from '../ui';
import { JOB_STATUS_LABEL, startOptimization, useOptimization, type FixedPage } from '../estimate/optimization';

/**
 * «Оптимизация» (макет, строки 732–865).
 *
 * Настоящее здесь — запуск optimization-start по последнему завершённому аудиту: языковая модель
 * разбирает страницы и пишет рекомендации по title, description, тексту и заголовкам в fixed_pages.
 * Объёмы в списке правок — число замечаний аудита (issues), а не цифры макета.
 *
 * Чего нет и что показано как «не подключено»:
 *  - «+5 к баллу» у правок и «Прогноз 89» — балл после правок никто не пересчитывает;
 *  - частотности Wordstat (XMLRiver не подключён);
 *  - alt, WebP, перелинковка — обработчик их не делает;
 *  - иерархия заголовков, плотность ключей, перелинковка и вес страницы «до/после» — нет данных «после».
 * Рекомендации модели к сайту автоматически не применяются: правка сайта — это заказ по смете.
 */

type OptionId = 'meta' | 'content' | 'structure' | 'alt' | 'webp' | 'links';

interface OptionDef {
  id: OptionId;
  title: string;
  /** Типы замечаний, от которых считается объём. Пусто — объёма в аудите нет. */
  issueTypes: string[];
  note: (n: number | null) => string;
  /** Обработчик умеет эту правку (опция optimization-start). */
  supported: boolean;
}

const OPTIONS: OptionDef[] = [
  {
    id: 'meta',
    title: 'Предложить title и description',
    issueTypes: ['missing_title', 'short_title', 'long_title', 'duplicate_title', 'missing_description', 'short_description', 'long_description', 'duplicate_description'],
    note: (n) => `${num(n)} замечаний по мета-тегам · нейросеть по тексту страницы`,
    supported: true,
  },
  {
    id: 'structure',
    title: 'Выстроить иерархию заголовков',
    issueTypes: ['missing_h1', 'multiple_h1', 'poor_heading_structure'],
    note: (n) => `${num(n)} замечаний по H1–H3 · рекомендации по структуре`,
    supported: true,
  },
  {
    id: 'content',
    title: 'Рекомендации по тексту страниц',
    issueTypes: ['thin_content'],
    note: (n) => `${num(n)} страниц с тонким контентом · требует ручной вычитки`,
    supported: true,
  },
  {
    id: 'alt',
    title: 'Проставить alt изображениям',
    issueTypes: ['missing_alt_text'],
    note: (n) => `${num(n)} страниц с картинками без alt · не подключено`,
    supported: false,
  },
  {
    id: 'links',
    title: 'Перелинковка по смежным разделам',
    issueTypes: ['no_internal_links'],
    note: (n) => `${num(n)} страниц без внутренних ссылок · не подключено`,
    supported: false,
  },
  {
    id: 'webp',
    title: 'Сжать изображения в WebP',
    issueTypes: [],
    note: () => 'Вес изображений аудит не измеряет · не подключено',
    supported: false,
  },
];

const pathOf = (url: string) => {
  try {
    const u = new URL(url);
    return u.pathname + u.search || '/';
  } catch {
    return url;
  }
};

/** Число замечаний по группам — head-запросы, строки не тянем. */
function useIssueCounts(userId: string | null, auditId: string | null) {
  const [counts, setCounts] = useState<Partial<Record<OptionId, number>>>({});
  useEffect(() => {
    let alive = true;
    if (!userId || !auditId) {
      setCounts({});
      return;
    }
    void Promise.all(
      OPTIONS.filter((o) => o.issueTypes.length > 0).map(async (o) => {
        const { count } = await supabase
          .from('issues')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('audit_id', auditId)
          .in('issue_type', o.issueTypes);
        return [o.id, count ?? 0] as const;
      }),
    ).then((pairs) => {
      if (alive) setCounts(Object.fromEntries(pairs));
    });
    return () => {
      alive = false;
    };
  }, [userId, auditId]);
  return counts;
}

const Optimize: React.FC = () => {
  const cab = useCabinetProject();
  const audit = cab.project?.lastCompleted ?? null;
  const opt = useOptimization(cab.userId, audit?.id ?? null);
  const counts = useIssueCounts(cab.userId, audit?.id ?? null);

  const [selected, setSelected] = useState<Record<string, boolean>>({ meta: true, structure: true, content: false });
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [pageLimit, setPageLimit] = useState<number | null>(null);
  const [pageUrl, setPageUrl] = useState<string>('');

  const page: FixedPage | null = opt.pages.find((p) => p.url === pageUrl) ?? opt.pages[0] ?? null;
  const anySelected = OPTIONS.some((o) => o.supported && selected[o.id]);

  const start = async () => {
    if (!opt.taskId) return;
    setStarting(true);
    setStartError(null);
    try {
      const r = await startOptimization(opt.taskId, {
        fixMetaTags: !!selected.meta,
        improveContent: !!selected.content,
        improveStructure: !!selected.structure,
      });
      setPageLimit(r.pageLimit);
      opt.reload();
    } catch (err) {
      setStartError(err instanceof Error ? err.message : 'Не удалось запустить оптимизацию');
    } finally {
      setStarting(false);
    }
  };

  const head = (actions?: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 240 }}>
        <PageHead
          title="Оптимизация"
          lead="Правки, которые платформа готовит автоматически. Каждая показывается «было / рекомендация» до применения."
        />
      </div>
      {actions}
    </div>
  );

  if (cab.loading) return <Screen>{head()}<Loading /></Screen>;
  if (cab.error) return <Screen>{head()}<ErrorNote>{cab.error}</ErrorNote></Screen>;
  if (!cab.project) {
    return (
      <Screen>
        {head()}
        <Empty title="Проекта пока нет" action={<Link to="/app/audit">Запустить первый аудит</Link>}>
          Оптимизация работает по страницам, которые разобрал аудит.
        </Empty>
      </Screen>
    );
  }
  if (!audit) {
    return (
      <Screen>
        {head()}
        <Empty title="Аудит ещё не завершён" action={<Link to="/app/audit">Открыть аудит</Link>}>
          По проекту {cab.host} нет завершённого аудита — оптимизировать пока нечего.
        </Empty>
      </Screen>
    );
  }

  const latest = opt.latest;
  const pct = latest && latest.total > 0 ? Math.round((latest.processed / latest.total) * 100) : 0;

  return (
    <Screen>
      {head(
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void start()}
          disabled={starting || opt.active || !opt.taskId || !anySelected}
          title={!opt.taskId ? 'У аудита не найдена задача обхода' : undefined}
        >
          {starting ? 'Запускаем…' : opt.active ? 'Идёт обработка…' : 'Запустить по выбранным'}
        </button>,
      )}

      {startError && <ErrorNote>{startError}</ErrorNote>}
      {opt.error && <ErrorNote>{opt.error}</ErrorNote>}

      {/* Итог запуска. Вместо «Было 74 → Прогноз 89»: балл аудита настоящий, прогноза нет —
          результат правок покажет повторный аудит, а не формула. */}
      {latest && (
        <Blueprint style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED }}>Балл аудита</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 40, lineHeight: 1, color: MUTED }}>
              {audit.seoScore === null ? '—' : Math.round(audit.seoScore)}
            </div>
          </div>
          <svg width="34" height="16" viewBox="0 0 34 16" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" aria-hidden>
            <path d="M0 8h30" />
            <path d="m25 3 5 5-5 5" />
          </svg>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>После правок</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 40, lineHeight: 1 }}>—</div>
          </div>
          <div style={{ flex: 1, minWidth: 200, fontSize: 13.5, color: MUTED, display: 'grid', gap: 'var(--space-2)' }}>
            <span>
              Запуск {dateLong(latest.createdAt)} — {JOB_STATUS_LABEL[latest.status] ?? latest.status}
              {latest.total > 0 ? `, обработано ${num(latest.processed)} из ${num(latest.total)} страниц` : ''}
              {latest.failures.length > 0 ? `, ошибок ${num(latest.failures.length)}` : ''}.{' '}
              {latest.error ?? 'Прогноз балла не считаем: результат правок покажет повторный аудит.'}
            </span>
            {opt.active && <Meter pct={pct} />}
            <span>
              Рекомендации к сайту сами не применяются — правка сайта идёт заказом по <Link to="/app/estimate">смете</Link>.
            </span>
          </div>
        </Blueprint>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
        <section style={{ border: '1px solid var(--color-divider)', minWidth: 0 }}>
          <h2 style={{ fontSize: 18, margin: 0, padding: 'var(--space-4)', borderBottom: '1px solid var(--color-divider)' }}>Готовые правки</h2>
          {OPTIONS.map((o, i) => {
            const n = o.issueTypes.length ? (counts[o.id] ?? null) : null;
            return (
              <label
                key={o.id}
                className="radio"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  borderBottom: i < OPTIONS.length - 1 ? '1px solid var(--color-divider)' : undefined,
                  width: '100%',
                  alignItems: 'start',
                  cursor: o.supported ? 'pointer' : 'default',
                }}
              >
                <input
                  type="checkbox"
                  disabled={!o.supported}
                  checked={o.supported && !!selected[o.id]}
                  onChange={(e) => setSelected((s) => ({ ...s, [o.id]: e.target.checked }))}
                />
                <span className="dot" style={{ marginTop: 3, opacity: o.supported ? 1 : 0.45 }} />
                <span>
                  <span style={{ display: 'block', fontSize: 14, color: o.supported ? undefined : MUTED }}>{o.title}</span>
                  <span style={{ display: 'block', fontSize: 12, color: MUTED }}>{o.note(n)}</span>
                </span>
                {/* Справа в макете «+5» к баллу — прогноз без данных. Показываем объём из аудита. */}
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: o.supported ? 'var(--color-accent)' : MUTED }}>
                  {n === null ? '—' : num(n)}
                </span>
              </label>
            );
          })}
          <p style={{ fontSize: 12, color: MUTED, margin: 0, padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--color-divider)' }}>
            Пока оплата не подключена, запуски ограничены: {pageLimit ? `до ${num(pageLimit)} страниц за запуск` : 'число страниц за запуск'} и
            число запусков в сутки.
          </p>
        </section>

        <section style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Было / стало</h2>

          <NotConnected title="Частотность Wordstat" needs={['Подключение XMLRiver: частотности запросов по региону проекта']}>
            Без частотностей нельзя объяснить, почему в title попал один запрос, а не другой, — поэтому цифр здесь нет.
          </NotConnected>

          {opt.loading && opt.pages.length === 0 ? (
            <Loading />
          ) : !page ? (
            <Empty title="Рекомендаций пока нет">
              Запустите оптимизацию — по каждой обработанной странице здесь появятся исходные title и description и рекомендации
              нейросети.
            </Empty>
          ) : (
            <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-4)', minWidth: 0, display: 'grid', gap: 'var(--space-3)' }}>
              {opt.pages.length > 1 && (
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="opt-page">Страница · {num(opt.pages.length)} обработано</label>
                  <select id="opt-page" className="input" value={page.url} onChange={(e) => setPageUrl(e.target.value)}>
                    {opt.pages.map((p) => (
                      <option key={p.id} value={p.url}>
                        {hostOf(p.url) === cab.host ? pathOf(p.url) : p.url}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <Before label={`${pathOf(page.url)} · title`} value={page.originalTitle} />
              <Before label={`${pathOf(page.url)} · description`} value={page.originalDescription} />
              <div style={{ fontSize: 12, color: MUTED }}>
                H1 на странице: {page.h1Count === null ? '—' : num(page.h1Count)} · слов: {page.wordCount === null ? '—' : num(page.wordCount)}
              </div>
              <div>
                <Kicker muted style={{ marginBottom: 'var(--space-2)' }}>
                  Рекомендации нейросети{page.model ? ` · ${page.model}` : ''}
                </Kicker>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    padding: 'var(--space-2) var(--space-3)',
                    borderLeft: '2px solid var(--color-accent)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 320,
                    overflowY: 'auto',
                  }}
                >
                  {page.recommendations || '— пусто —'}
                </div>
              </div>
            </div>
          )}

          {latest && latest.failures.length > 0 && (
            <ErrorNote>
              Не обработаны: {latest.failures.slice(0, 5).map((f) => pathOf(f.url)).join(', ')}
              {latest.failures.length > 5 ? ` и ещё ${num(latest.failures.length - 5)}` : ''}.
            </ErrorNote>
          )}

          <NotConnected
            title="Заголовки, ключи, перелинковка и вес «до / после»"
            needs={[
              'Список заголовков H1–H3 страницы (аудит хранит только их количество)',
              'Плотность ключевых запросов до и после правки',
              'Подбор ссылок по смежным разделам',
              'Вес страницы после сжатия изображений',
            ]}
          >
            Обработчик возвращает рекомендации текстом, а не изменённую страницу, — сравнивать «стало» пока не с чем.
          </NotConnected>
        </section>
      </div>
    </Screen>
  );
};

const Before: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
  <div style={{ minWidth: 0 }}>
    <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 'var(--space-2)', wordBreak: 'break-all' }}>
      {label}
    </div>
    <div
      style={{
        fontSize: 13,
        lineHeight: 1.6,
        padding: 'var(--space-2) var(--space-3)',
        borderLeft: '2px solid color-mix(in srgb,var(--color-text) 25%,transparent)',
        color: MUTED,
        wordBreak: 'break-word',
      }}
    >
      {value && value.trim() ? value : '— отсутствует —'}
    </div>
  </div>
);

export default Optimize;
