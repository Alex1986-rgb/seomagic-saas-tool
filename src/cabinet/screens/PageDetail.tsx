import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetProject, type CabinetAudit } from '../project';
import { Empty, ErrorNote, Loading, MONO, MUTED, NotConnected, Screen, TableFrame } from '../ui';
import { dateLong, hostOf, num, plural } from '../format';
import { checkAdvice, checkTitle, metaNote, pathOf, sevOf, sevRank } from '../audit/labels';
import {
  errorText,
  fetchIssues,
  fetchPageByUrl,
  fetchPageIssues,
  fetchPages,
  fetchTaskForAudit,
  isFinished,
  type PageRow,
  type TaskRow,
} from '../audit/queries';
import type { IssueRow } from '../audit/groups';
import { NoteCell } from '../audit/parts';

/**
 * «Страница» — разбор одного адреса, макет строки 675–731.
 *
 * Адрес — из ?url=. Страница ищется в последнем готовом аудите её сайта (page_analysis), проблемы —
 * замечания этой страницы (issues.page_id). Без ?url= экран показывает страницы последнего аудита
 * текущего проекта, чтобы выбрать нужную.
 *
 * Из пяти показателей макета краулер измеряет не всё: балла страницы, LCP, входящих ссылок и
 * позиций по странице в базе нет. Показываем то, что измерено (вес HTML, полная загрузка, ссылки
 * со страницы), остальное — прочерком с объяснением, без чисел из макета.
 */

const PAGE_TYPE: Record<string, string> = {
  home: 'Главная',
  category: 'Категория каталога',
  product: 'Карточка товара',
  article: 'Статья',
  other: 'Страница',
};

function sizeText(bytes: number | null): string {
  if (bytes === null || bytes <= 0) return '—';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} МБ`;
}

/** Последний готовый аудит сайта: страницы ищем в нём, а не в «последнем аудите вообще». */
function latestFinished(audits: CabinetAudit[], host: string | null): CabinetAudit | null {
  if (!host) return null;
  return audits.find((a) => a.host === host && isFinished(a.status)) ?? null;
}

const PageDetail: React.FC = () => {
  const [params] = useSearchParams();
  const url = params.get('url');
  const { loading, error, audits, host, userId } = useCabinetProject();
  const audit = useMemo(() => latestFinished(audits, url ? hostOf(url) : host), [audits, url, host]);

  if (loading) {
    return (
      <Screen maxWidth={1100}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Страница</h1>
        <Loading />
      </Screen>
    );
  }
  if (error) {
    return (
      <Screen maxWidth={1100}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Страница</h1>
        <ErrorNote>Не удалось загрузить аудиты: {error}</ErrorNote>
      </Screen>
    );
  }
  if (!audit || !userId) {
    return (
      <Screen maxWidth={1100}>
        <h1 style={{ fontSize: 32, margin: 0, wordBreak: 'break-word' }}>{url ? pathOf(url) : 'Страница'}</h1>
        <Empty title="Нет готового аудита" action={<Link to="/app/audit">Запустить аудит</Link>}>
          {url
            ? `Разбор страницы появится, когда завершится аудит сайта ${hostOf(url)}.`
            : 'Страницы для разбора появятся, когда завершится аудит проекта.'}
        </Empty>
      </Screen>
    );
  }
  return url ? (
    <PageView key={`${audit.id}-${url}`} userId={userId} audit={audit} url={url} />
  ) : (
    <PagePicker key={audit.id} userId={userId} audit={audit} />
  );
};

const PageView: React.FC<{ userId: string; audit: CabinetAudit; url: string }> = ({ userId, audit, url }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<{
    task: TaskRow | null;
    page: PageRow | null;
    issues: IssueRow[];
    advice: string | null;
  } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const task = await fetchTaskForAudit(userId, audit.id);
        const page = task ? await fetchPageByUrl(userId, task.id, url) : null;
        const issues = task && page ? await fetchPageIssues(userId, task.id, page.id) : [];
        // Рекомендации оптимизации по странице, если её запускали (optimization-processor → fixed_pages).
        let advice: string | null = null;
        if (page) {
          const { data } = await supabase
            .from('fixed_pages')
            .select('fixes_applied, created_at')
            .eq('user_id', userId)
            .eq('page_id', page.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          const rec = (data?.fixes_applied as { recommendations?: unknown } | null)?.recommendations;
          advice = typeof rec === 'string' && rec.trim() ? rec.trim() : null;
        }
        if (alive) setState({ task, page, issues, advice });
      } catch (e) {
        console.error('Кабинет: разбор страницы', e);
        if (alive) setErr(errorText(e, 'Не удалось загрузить страницу'));
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId, audit.id, url]);

  const back = (
    <Link to={`/app/results?audit=${audit.id}`} style={{ fontSize: 13 }}>
      ← Ко всем проблемам
    </Link>
  );

  if (err || !state) {
    return (
      <Screen maxWidth={1100}>
        <div>
          {back}
          <h1 style={{ fontSize: 32, margin: 'var(--space-3) 0 4px', wordBreak: 'break-word' }}>{pathOf(url)}</h1>
        </div>
        {err ? <ErrorNote>{err}</ErrorNote> : <Loading />}
      </Screen>
    );
  }

  const { page, issues, advice } = state;
  if (!page) {
    return (
      <Screen maxWidth={1100}>
        <div>
          {back}
          <h1 style={{ fontSize: 32, margin: 'var(--space-3) 0 4px', wordBreak: 'break-word' }}>{pathOf(url)}</h1>
        </div>
        <Empty title="Страницы нет в последнем аудите" action={<Link to="/app/page">Выбрать страницу из аудита</Link>}>
          Аудит {audit.host} от {dateLong(audit.completedAt ?? audit.createdAt, false)} этот адрес не обходил: краулер берёт
          страницы из sitemap и по ссылкам, до лимита страниц.
        </Empty>
      </Screen>
    );
  }

  const sorted = [...issues].sort((a, b) => sevRank(a.severity) - sevRank(b.severity));
  const segments = pathOf(page.url).split('?')[0].split('/').filter(Boolean);

  return (
    <Screen maxWidth={1100}>
      <div>
        {back}
        <h1 style={{ fontSize: 32, margin: 'var(--space-3) 0 4px', wordBreak: 'break-word' }}>{pathOf(page.url)}</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
          {PAGE_TYPE[page.page_type ?? 'other'] ?? 'Страница'} · проверена {dateLong(page.created_at)}
          {page.word_count !== null ? ` · ${num(page.word_count)} ${plural(page.word_count, ['слово', 'слова', 'слов'])}` : ''}
          {page.status_code !== null ? ` · ответ ${page.status_code}` : ''}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
          gap: 1,
          border: '1px solid var(--color-divider)',
        }}
      >
        <NoteCell label="Балл страницы" value="—" muted note="по страницам балл не считается" />
        <NoteCell label="Вес HTML" value={sizeText(page.transfer_size ?? page.content_length)} note="без картинок и скриптов" />
        {/* Вместо LCP — полная загрузка документа: Core Web Vitals краулер не измеряет. */}
        <NoteCell
          label="Загрузка"
          value={page.load_time !== null ? `${page.load_time.toFixed(1).replace('.', ',')} с` : '—'}
          note="LCP не измеряется"
        />
        <NoteCell
          label="Ссылок со страницы"
          value={num(page.internal_links_count)}
          note="входящие ссылки не считаются"
        />
        <NoteCell label="Запросов в ТОП-50" value="—" muted note="не подключено: нет связи позиций со страницей" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
        <section style={{ border: '1px solid var(--color-divider)', minWidth: 0 }}>
          <h2 style={{ fontSize: 18, margin: 0, padding: 'var(--space-4)', borderBottom: '1px solid var(--color-divider)' }}>
            Проблемы на странице
          </h2>
          {sorted.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', fontSize: 13.5, color: MUTED }}>Классификатор не нашёл замечаний на этой странице.</div>
          ) : (
            sorted.map((i, n) => {
              const note = metaNote(i.metadata);
              return (
                <div
                  key={i.id}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'flex-start',
                    padding: 'var(--space-4)',
                    borderBottom: n === sorted.length - 1 ? 0 : '1px solid var(--color-divider)',
                  }}
                >
                  {sevOf(i.severity) === 'critical' ? (
                    <span data-dot-critical style={{ width: 8, height: 8, marginTop: 6, flex: 'none' }} />
                  ) : (
                    <span style={{ width: 8, height: 8, border: '1px solid var(--color-accent)', marginTop: 6, flex: 'none' }} />
                  )}
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 14 }}>
                      {checkTitle(i.issue_type)}
                      {note ? ` — ${note}` : ''}
                    </span>
                    <span style={{ display: 'block', fontSize: 12, color: MUTED }}>{checkAdvice(i.issue_type)}</span>
                  </span>
                </div>
              );
            })
          )}
        </section>

        <section style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Что видит поисковик</h2>
          {/* Сниппет из того, что лежит в разметке: title и description страницы. Поисковик может
              подменить описание своим — если description пуст, так и пишем. */}
          <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 'var(--space-3)' }}>
              Сниппет сейчас
            </div>
            <div style={{ fontSize: 16, color: 'var(--color-accent-700)', lineHeight: 1.3, overflowWrap: 'anywhere' }}>
              {page.title || <span style={{ color: MUTED }}>title не задан</span>}
            </div>
            <div style={{ fontSize: 12, color: MUTED, margin: '3px 0 6px', overflowWrap: 'anywhere' }}>
              {[hostOf(page.url), ...segments].join(' › ')}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: 'color-mix(in srgb,var(--color-text) 70%,transparent)', overflowWrap: 'anywhere' }}>
              {page.meta_description || 'Description пуст — текст сниппета поисковик возьмёт со страницы сам.'}
            </div>
          </div>
          {advice ? (
            <div style={{ border: '1px solid var(--color-accent)', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>
                Рекомендации оптимизации
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: 260, overflow: 'auto', overflowWrap: 'anywhere' }}>{advice}</div>
            </div>
          ) : (
            <NotConnected
              title="Сниппет после правок"
              needs={['готовые title и description по странице — оптимизация пока пишет рекомендации текстом, без отдельных полей']}
            />
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/app/optimize?url=${encodeURIComponent(page.url)}`)}
            style={{ justifySelf: 'start' }}
          >
            Применить правки к странице
          </button>
        </section>
      </div>
    </Screen>
  );
};

/** Выбор страницы без ?url=: страницы последнего аудита, сначала те, где больше критичного. */
const PagePicker: React.FC<{ userId: string; audit: CabinetAudit }> = ({ userId, audit }) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<{ page: PageRow; critical: number; total: number }[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const task = await fetchTaskForAudit(userId, audit.id);
        if (!task) {
          if (alive) setRows([]);
          return;
        }
        const [pages, issues] = await Promise.all([fetchPages(userId, task.id), fetchIssues(userId, task.id)]);
        const per = new Map<string, { critical: number; total: number }>();
        for (const i of issues) {
          if (!i.page_id) continue;
          const c = per.get(i.page_id) ?? { critical: 0, total: 0 };
          c.total += 1;
          if (sevOf(i.severity) === 'critical') c.critical += 1;
          per.set(i.page_id, c);
        }
        const list = pages
          .map((page) => ({ page, ...(per.get(page.id) ?? { critical: 0, total: 0 }) }))
          .sort((a, b) => b.critical - a.critical || b.total - a.total || a.page.url.localeCompare(b.page.url));
        if (alive) setRows(list);
      } catch (e) {
        console.error('Кабинет: список страниц', e);
        if (alive) setErr(errorText(e, 'Не удалось загрузить страницы аудита'));
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId, audit.id]);

  return (
    <Screen maxWidth={1100}>
      <div>
        <Link to={`/app/results?audit=${audit.id}`} style={{ fontSize: 13 }}>
          ← Ко всем проблемам
        </Link>
        <h1 style={{ fontSize: 32, margin: 'var(--space-3) 0 4px' }}>Страница</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
          Выберите адрес из аудита {audit.host} от {dateLong(audit.completedAt ?? audit.createdAt)}.
        </p>
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
      {!rows && !err ? (
        <Loading />
      ) : rows && rows.length === 0 ? (
        <Empty title="Страниц нет">В этом аудите не сохранилось разобранных страниц.</Empty>
      ) : rows ? (
        <TableFrame minWidth={640}>
          <thead>
            <tr>
              <th style={{ width: '50%' }}>Адрес</th>
              <th style={{ textAlign: 'right' }}>Ответ</th>
              <th style={{ textAlign: 'right' }}>Загрузка</th>
              <th style={{ textAlign: 'right' }}>Критичных</th>
              <th style={{ textAlign: 'right' }}>Всего замечаний</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ page, critical, total }) => (
              <tr
                key={page.id}
                data-row
                data-clickable
                onClick={() => navigate(`/app/page?url=${encodeURIComponent(page.url)}`)}
              >
                <td style={{ fontFamily: MONO, fontSize: 12.5, wordBreak: 'break-all' }}>
                  <Link to={`/app/page?url=${encodeURIComponent(page.url)}`} style={{ color: 'inherit' }} onClick={(e) => e.stopPropagation()}>
                    {pathOf(page.url)}
                  </Link>
                </td>
                <td style={{ textAlign: 'right' }}>{page.status_code ?? '—'}</td>
                <td style={{ textAlign: 'right' }}>{page.load_time !== null ? `${page.load_time.toFixed(1).replace('.', ',')} с` : '—'}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 15 }}>
                  {critical > 0 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span data-dot-critical style={{ width: 7, height: 7 }} />
                      {num(critical)}
                    </span>
                  ) : (
                    '0'
                  )}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 15 }}>{num(total)}</td>
              </tr>
            ))}
          </tbody>
        </TableFrame>
      ) : null}
    </Screen>
  );
};

export default PageDetail;
