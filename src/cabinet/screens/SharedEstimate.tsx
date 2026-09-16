import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PageSeo } from '@/components/seo/PageSeo';
import { submitContactRequest } from '@/services/contact/submitRequest';
import { useCabinetTheme } from '../CabinetLayout';
import { dateLong, num, rub } from '../format';
import { Blueprint, Empty, ErrorNote, Loading, MUTED, TableFrame } from '../ui';
import { exportEstimateXlsx, hashSharePassword, SHARE_SOURCE, shareUrlOf, type ShareLine, type ShareSnapshot } from '../estimate/share';

/**
 * «Смета по ссылке» — то, что видит заказчик без входа (макет, строки 2642–2785). Без оболочки
 * кабинета и нашей навигации. Ссылку создаёт исполнитель в диалоге «Отправить заказчику».
 *
 * Показывается снимок из shared_estimates, а не живая смета: заказчик видит ровно то, что ему
 * отправили. Кнопки «Согласовать и оплатить» нет — приёма оплаты нет; согласие и вопрос уходят
 * заявкой в contact_requests, которую разбирает администратор.
 *
 * Ограничение бэкенда (см. отчёт): политика shared_estimates даёт читать запись только её автору.
 * Заказчик без входа получит «Смета не найдена», пока чтение по токену не переедет в серверную
 * функцию. Автор ссылки (кнопка «Посмотреть глазами заказчика») страницу видит.
 */

interface Loaded {
  snapshot: ShareSnapshot;
  totals: { subtotal: number; discount: number; final: number };
  host: string;
  expiresAt: string | null;
  maxViews: number | null;
  views: number;
  createdAt: string | null;
}

/** Ссылки старого диалога хранили строки в другом формате (OptimizationItem) — читаем и их. */
function legacyLines(data: unknown): ShareLine[] {
  if (!Array.isArray(data)) return [];
  return data.map((raw) => {
    const it = (raw ?? {}) as Record<string, unknown>;
    const qty = Number(it.count) || 0;
    const rate = Number(it.cost ?? it.price) || 0;
    return {
      name: String(it.name ?? it.type ?? '—'),
      unit: '',
      qty,
      rate,
      sum: Number(it.totalPrice) || qty * rate,
      template: false,
    };
  });
}

type Form = null | 'agree' | 'question';

const SharedEstimate: React.FC = () => {
  useCabinetTheme();
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needPassword, setNeedPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<Loaded | null>(null);

  const load = useCallback(
    async (attempt?: string) => {
      if (!token) {
        setError('Неверная ссылка');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data: row, error: qError } = await supabase
          .from('shared_estimates')
          .select('estimate_data, totals, url, expires_at, max_views, views_count, password_hash, is_active, created_at')
          .eq('share_token', token)
          .maybeSingle();
        if (qError) throw qError;
        // Не различаем «нет такой» и «нет доступа»: иначе по ответу можно перебирать токены.
        if (!row) throw new Error('Смета не найдена или ссылка недоступна');
        if (row.is_active === false) throw new Error('Ссылка больше не активна');
        if (row.expires_at && new Date(row.expires_at) < new Date()) throw new Error('Срок действия ссылки истёк');
        if (row.max_views && (row.views_count ?? 0) >= row.max_views) throw new Error('Лимит просмотров исчерпан');
        if (row.password_hash) {
          if (!attempt) {
            setNeedPassword(true);
            return;
          }
          if ((await hashSharePassword(attempt.trim())) !== row.password_hash) throw new Error('Неверный пароль');
        }
        const raw = (row.estimate_data ?? {}) as unknown as Partial<ShareSnapshot>;
        const totals = (row.totals ?? {}) as unknown as Loaded['totals'];
        const snapshot: ShareSnapshot =
          raw && raw.source === SHARE_SOURCE
            ? (raw as ShareSnapshot)
            : {
                source: SHARE_SOURCE,
                host: row.url,
                preparedBy: null,
                preparedAt: row.created_at ?? new Date().toISOString(),
                auditId: null,
                score: null,
                criticalCount: 0,
                units: legacyLines(row.estimate_data).reduce((s, l) => s + l.qty, 0),
                pct: 0,
                showRates: true,
                allowExport: true,
                lines: legacyLines(row.estimate_data),
              };
        setData({
          snapshot,
          totals: { subtotal: Number(totals.subtotal) || 0, discount: Number(totals.discount) || 0, final: Number(totals.final) || 0 },
          host: snapshot.host || row.url,
          expiresAt: row.expires_at,
          maxViews: row.max_views,
          views: row.views_count ?? 0,
          createdAt: row.created_at,
        });
        setNeedPassword(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось открыть смету');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const [form, setForm] = useState<Form>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Form>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const s = data?.snapshot;
  const emailOk = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email.trim());

  const submit = async () => {
    if (!data || !s || !form || !token) return;
    setSending(true);
    setFormError(null);
    try {
      await submitContactRequest({
        kind: form === 'agree' ? 'invoice' : 'contact',
        email: email.trim(),
        name: name.trim() || undefined,
        subject: form === 'agree' ? `Заказчик согласовал смету · ${data.host}` : `Вопрос по смете · ${data.host}`,
        message: [
          form === 'agree' ? `Согласовано: ${num(s.units)} правок на ${rub(data.totals.final)}` : message.trim(),
          `Смета по ссылке: ${shareUrlOf(token)}`,
        ].join('\n'),
        siteUrl: data.host,
        amount: form === 'agree' ? data.totals.final : undefined,
      });
      setSent(form);
      setForm(null);
      setMessage('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Не удалось отправить');
    } finally {
      setSending(false);
    }
  };

  const cell = (label: string, value: React.ReactNode) => (
    <div style={{ outline: '1px solid var(--color-divider)', padding: 'var(--space-4)' }}>
      <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30 }}>{value}</div>
    </div>
  );

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* Ссылка с токеном — закрытый документ: в поиск не отдаём ни в каком состоянии страницы. */}
      <PageSeo title="Смета на исправление сайта — SeoMarket" description="Смета на исправление сайта по ссылке" noindex />
      <div data-screen style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-8) var(--space-6) 64px', display: 'grid', gap: 'var(--space-8)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--color-divider)',
            paddingBottom: 'var(--space-4)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 19, letterSpacing: '.04em' }}>SEOMARKET</span>
          {data && (
            <span style={{ fontSize: 12, color: MUTED }}>
              Смета открыта по ссылке
              {data.maxViews ? ` · просмотров ${num(data.views)} из ${num(data.maxViews)}` : ''}
              {data.expiresAt ? ` · до ${dateLong(data.expiresAt, false)}` : ''}
            </span>
          )}
          {user.isLoggedIn && (
            <Link to="/app/estimate" style={{ fontSize: 13, marginLeft: 'auto' }}>
              ← В кабинет
            </Link>
          )}
        </div>

        {loading ? (
          <Loading />
        ) : needPassword ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void load(password);
            }}
            style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 360 }}
          >
            <h1 style={{ fontSize: 28, margin: 0 }}>Смета защищена паролем</h1>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="shared-pass">Пароль</label>
              <input id="shared-pass" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            </div>
            {error && <ErrorNote>{error}</ErrorNote>}
            <button type="submit" className="btn btn-primary" disabled={!password.trim()}>
              Открыть смету
            </button>
          </form>
        ) : error || !data || !s ? (
          <Empty title={error ?? 'Смета не найдена'}>
            Попросите исполнителя прислать ссылку заново — у ссылок бывает срок действия и лимит просмотров.
          </Empty>
        ) : (
          <>
            <div>
              <h1 style={{ fontSize: 34, margin: '0 0 4px', wordBreak: 'break-word' }}>Смета на исправление {data.host}</h1>
              <p style={{ fontSize: 14, color: MUTED, margin: 0, maxWidth: '72ch' }}>
                {s.preparedBy ? `Подготовил ${s.preparedBy}` : 'Подготовлено в SeoMarket'} {dateLong(s.preparedAt, false)} по результатам
                бесплатного аудита.
                Оплата только за фактический объём правок; аудит и повторная проверка через 30 дней бесплатны.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(136px,1fr))', gap: 1 }}>
              {cell('Балл сейчас', s.score === null ? '—' : Math.round(s.score))}
              {cell('Критических', num(s.criticalCount))}
              {cell('Правок в смете', num(s.units))}
              {/* Срок в макете — формула от объёма; исполнения правок нет, срок называем в счёте. */}
              {cell('Срок', <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: MUTED }}>в счёте</span>)}
            </div>

            <TableFrame minWidth={s.showRates ? 680 : 520}>
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Работа</th>
                  <th style={{ textAlign: 'right' }}>Объём</th>
                  {s.showRates && <th style={{ textAlign: 'right' }}>Ставка</th>}
                  <th style={{ textAlign: 'right', paddingRight: 'var(--space-4)' }}>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {s.lines.map((l, i) => (
                  <tr key={i} data-row>
                    <td style={{ fontSize: 14 }}>{l.name}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {num(l.qty)}
                      {l.unit ? <span style={{ color: MUTED }}> · {l.unit}</span> : null}
                    </td>
                    {s.showRates && <td style={{ textAlign: 'right', color: MUTED }}>{rub(l.rate)}</td>}
                    <td style={{ textAlign: 'right', paddingRight: 'var(--space-4)', fontFamily: 'var(--font-heading)', fontSize: 16, whiteSpace: 'nowrap' }}>
                      {rub(l.sum)}
                      {l.template && <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, color: MUTED }}>за шаблон</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableFrame>

            <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
              {s.showRates && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 14 }}>
                    <span>Сумма работ</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>{rub(data.totals.subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 14, color: 'var(--color-accent-700)' }}>
                    <span>Скидка за объём · {Math.round(s.pct * 100)}%</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>−{rub(data.totals.discount)}</span>
                  </div>
                </>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: s.showRates ? '1px solid var(--color-divider)' : undefined,
                  paddingTop: s.showRates ? 'var(--space-3)' : undefined,
                }}
              >
                <span style={{ fontSize: 14 }}>К оплате</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 36 }}>{rub(data.totals.final)}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: MUTED, margin: 0, maxWidth: '64ch' }}>
                Правка, не прошедшая проверку, из счёта убирается. Онлайн-оплата пока не подключена: после согласования исполнитель
                пришлёт счёт.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-primary" onClick={() => setForm('agree')} disabled={sent === 'agree'}>
                  {sent === 'agree' ? 'Согласие отправлено' : 'Согласовать и запросить счёт'}
                </button>
                {s.allowExport && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      void exportEstimateXlsx({
                        host: data.host,
                        lines: s.lines,
                        gross: data.totals.subtotal,
                        discount: data.totals.discount,
                        pct: s.pct,
                        total: data.totals.final,
                        showRates: s.showRates,
                      })
                    }
                  >
                    Выгрузить в Excel
                  </button>
                )}
                <button type="button" className="btn btn-ghost" onClick={() => setForm('question')}>
                  Задать вопрос
                </button>
              </div>

              {sent && !form && (
                <div style={{ fontSize: 13, color: 'var(--color-accent-700)' }}>
                  {sent === 'agree' ? 'Согласие получено — счёт придёт на указанную почту.' : 'Вопрос отправлен — ответим на почту.'}
                </div>
              )}

              {form && (
                <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)', display: 'grid', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--space-3)' }}>
                    <div className="field" style={{ margin: 0 }}>
                      <label htmlFor="sh-email">Ваша почта</label>
                      <input id="sh-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <label htmlFor="sh-name">Имя или компания</label>
                      <input id="sh-name" className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>
                  {form === 'question' && (
                    <div className="field" style={{ margin: 0 }}>
                      <label htmlFor="sh-msg">Вопрос</label>
                      <textarea id="sh-msg" className="input" value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>
                  )}
                  {formError && <ErrorNote>{formError}</ErrorNote>}
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={sending || !emailOk || (form === 'question' && !message.trim())}
                      onClick={() => void submit()}
                    >
                      {sending ? 'Отправляем…' : form === 'agree' ? 'Отправить согласие' : 'Отправить вопрос'}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </Blueprint>
          </>
        )}
      </div>
    </div>
  );
};

export default SharedEstimate;
