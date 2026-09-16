import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { dateLong, num, rub } from '../format';
import {
  Blueprint,
  Dialog,
  CopyButton,
  Empty,
  ErrorNote,
  Loading,
  MONO,
  MUTED,
  NotConnected,
  PageHead,
  Screen,
  Seg,
  TableFrame,
  Tag,
} from '../ui';
import { calcEstimate, DISCOUNT_TIERS, TEMPLATE_PRICE, TEMPLATE_THRESHOLD } from '../estimate/calc';
import { presetPicks, type PresetId } from '../estimate/works';
import { useProjectEstimate } from '../estimate/useProjectEstimate';
import { saveEstimate, type SavedLine } from '../estimate/store';
import {
  createShareLink,
  exportEstimateXlsx,
  sendEstimateEmail,
  SHARE_SOURCE,
  type ShareSnapshot,
} from '../estimate/share';

/**
 * «Смета на исправления» (макет, строки 866–956; логика WORK/PRESETS/estimate()/lines/presetHint).
 *
 * Строки — типы замечаний последнего завершённого аудита, у которых в прайсе есть ставка (см.
 * estimate/works.ts). Объём — фактический из issues, ставка — pricing_rules, сумма и скидка —
 * только через estimate/calc.ts. Сохранение — job_estimates (согласование) и shared_estimates
 * (ссылка заказчику), письмо — функция send-estimate-email.
 */

const PRESETS: { value: PresetId; label: string }[] = [
  { value: 'critical', label: 'Только критичное' },
  { value: 'recommended', label: 'Рекомендуемое' },
  { value: 'all', label: 'Всё найденное' },
];

const pctLabel = (p: number) => `${Math.round(p * 100)}%`;

const Row: React.FC<{ label: React.ReactNode; value: React.ReactNode; accent?: boolean }> = ({ label, value, accent }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      fontSize: 14,
      ...(accent ? { color: 'var(--color-accent-700)' } : {}),
    }}
  >
    <span>{label}</span>
    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, whiteSpace: 'nowrap' }}>{value}</span>
  </div>
);

const Estimate: React.FC = () => {
  const d = useProjectEstimate();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cab, audit, priced, saved } = d;

  const [preset, setPreset] = useState<PresetId | ''>('recommended');
  const [picked, setPicked] = useState<Set<string> | null>(null);
  const [initFor, setInitFor] = useState<string | null>(null);

  // Смета, согласованная по этому же аудиту. По старому аудиту объёмы другие — её выбор не
  // переносим, а показываем расчёт заново.
  const savedHere = saved && audit && saved.auditId === audit.id ? saved : null;

  // Начальный выбор строк: сохранённая смета этого аудита, иначе набор «Рекомендуемое».
  // Один раз на аудит — дальше выбор принадлежит пользователю.
  useEffect(() => {
    if (d.loading || !audit || initFor === audit.id) return;
    if (savedHere && savedHere.lines.length > 0) {
      setPicked(new Set(savedHere.lines.filter((l) => l.picked).map((l) => l.issue_type)));
      setPreset(savedHere.preset);
    } else {
      setPicked(presetPicks('recommended', priced));
      setPreset('recommended');
    }
    setInitFor(audit.id);
  }, [d.loading, audit, initFor, savedHere, priced]);

  const picks = picked ?? new Set<string>();
  const result = useMemo(
    () => calcEstimate(priced.map((v) => ({ key: v.priceType, qty: v.qty, rate: v.rule.rate, picked: picks.has(v.priceType) }))),
    // picks — производное от picked
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [priced, picked],
  );

  const lines: SavedLine[] = useMemo(
    () =>
      result.lines.map((l, i) => ({
        issue_type: l.key,
        name: priced[i].rule.name,
        unit: priced[i].rule.unit,
        qty: l.qty,
        rate: l.rate,
        sum: l.sum,
        template: l.template,
        picked: l.picked,
      })),
    [result, priced],
  );

  // Смета «изменена», если выбор строк или итог разошлись с согласованным снимком
  // (итог мог поменяться и без выбора — админ поправил ставку).
  const dirty = useMemo(() => {
    if (!savedHere) return false;
    const savedPicked = savedHere.lines.filter((l) => l.picked).map((l) => l.issue_type).sort().join(',');
    const nowPicked = lines.filter((l) => l.picked).map((l) => l.issue_type).sort().join(',');
    return savedPicked !== nowPicked || Math.round(savedHere.total) !== Math.round(result.total);
  }, [savedHere, lines, result.total]);

  const paid = savedHere?.status === 'paid';
  const approved = !!savedHere && (savedHere.status === 'accepted' || paid) && !dirty;

  const [approveOpen, setApproveOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const toggle = (key: string) => {
    if (paid) return;
    setPicked((prev) => {
      const next = new Set(prev ?? []);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    // Ручная отметка сбрасывает набор: иначе подсветка набора врала бы о составе сметы.
    setPreset('');
  };

  const choosePreset = (p: PresetId) => {
    if (paid) return;
    setPreset(p);
    setPicked(presetPicks(p, priced));
  };

  const approve = async () => {
    if (!cab.userId || !audit || !cab.host) return;
    setBusy(true);
    setActionError(null);
    try {
      await saveEstimate({
        userId: cab.userId,
        auditId: audit.id,
        host: cab.host,
        existing: saved,
        status: 'accepted',
        preset,
        result,
        lines,
      });
      setApproveOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Не удалось согласовать смету');
    } finally {
      setBusy(false);
    }
  };

  // Скидка в подсказке — из расчёта, а не литералом: при смене ставок набор переезжает между порогами.
  const discTxt = result.pct ? `Скидка ${pctLabel(result.pct)}.` : 'Без скидки за объём.';
  const presetHint =
    preset === 'critical'
      ? `Замечания, которые аудит отметил как критичные и важные. ${discTxt}`
      : preset === 'recommended'
        ? `Всё, что аудит отметил как исправимое автоматически. ${discTxt}`
        : preset === 'all'
          ? `Все замечания со ставкой в прайсе, включая тексты — их нужно вычитать вручную. ${discTxt}`
          : 'Свой набор — отмечайте строки в таблице.';

  // ---- состояния без данных --------------------------------------------------------------
  const head = (
    <PageHead
      title="Смета на исправления"
      lead="Подписки нет. Аудит бесплатный, вы платите только за те правки, которые решили внести — по факту сделанного объёма."
    />
  );

  if (cab.loading) return <Screen maxWidth={1100}>{head}<Loading /></Screen>;
  if (!cab.project) {
    return (
      <Screen maxWidth={1100}>
        {head}
        <Empty title="Проекта пока нет" action={<Link to="/app/audit">Запустить первый аудит</Link>}>
          Смета собирается из замечаний аудита: объёмы работ берутся из того, что аудит действительно нашёл.
        </Empty>
      </Screen>
    );
  }
  if (!audit) {
    return (
      <Screen maxWidth={1100}>
        {head}
        <Empty title="Аудит ещё не завершён" action={<Link to="/app/audit">Открыть аудит</Link>}>
          По проекту {cab.host} нет завершённого аудита — считать смету не из чего.
        </Empty>
      </Screen>
    );
  }
  if (d.error) return <Screen maxWidth={1100}>{head}<ErrorNote>{d.error}</ErrorNote></Screen>;
  if (d.loading || picked === null) return <Screen maxWidth={1100}>{head}<Loading label="Считаем объёмы по аудиту…" /></Screen>;
  if (d.issuesTotal === 0) {
    return (
      <Screen maxWidth={1100}>
        {head}
        <Empty title="Замечаний нет" action={<Link to="/app/results">Результаты аудита</Link>}>
          По аудиту от {dateLong(audit.completedAt ?? audit.createdAt)} в базе нет замечаний. Если аудит закончился только что,
          замечания появятся после классификации — обновите страницу через минуту.
        </Empty>
      </Screen>
    );
  }
  if (priced.length === 0) {
    return (
      <Screen maxWidth={1100}>
        {head}
        <NotConnected
          title="В прайсе нет ставок для найденных замечаний"
          needs={['Ставки в таблице pricing_rules для типов: ' + d.unpriced.map((u) => u.priceType).join(', ')]}
        >
          Аудит нашёл {num(d.issuesTotal)} замечаний, но ни на один их тип администратор не задал ставку. Без ставки сумма была бы выдумкой.
        </NotConnected>
      </Screen>
    );
  }

  const shareSnapshot = (showRates: boolean, allowExport: boolean): ShareSnapshot => ({
    source: SHARE_SOURCE,
    host: cab.host ?? '',
    preparedBy: user.profile?.full_name || null,
    preparedAt: new Date().toISOString(),
    auditId: audit.id,
    score: audit.seoScore,
    criticalCount: d.criticalCount,
    units: result.units,
    pct: result.pct,
    showRates,
    allowExport,
    lines: lines.filter((l) => l.picked).map(({ name, unit, qty, rate, sum, template }) => ({ name, unit, qty, rate, sum, template })),
  });

  return (
    <Screen maxWidth={1100}>
      {head}

      {savedHere && (approved || dirty) && (
        <Blueprint style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          {approved ? (
            <>
              <Tag>{paid ? 'Оплачена' : 'Согласована'}</Tag>
              <span style={{ fontSize: 14 }}>
                Смета от {dateLong(savedHere.updatedAt ?? savedHere.createdAt, false)} · {rub(savedHere.total)} ·{' '}
                {paid ? 'оплата получена' : 'приём оплаты не подключён, счёт — по заявке'}
              </span>
            </>
          ) : (
            <>
              <Tag tone="outline">Изменена</Tag>
              <span style={{ fontSize: 14 }}>
                Согласовано {rub(savedHere.total)}, после изменений — {rub(result.total)}. Согласуйте смету заново.
              </span>
            </>
          )}
          <Link to="/app/order" style={{ marginLeft: 'auto', fontSize: 13 }}>
            Перейти к заказу
          </Link>
        </Blueprint>
      )}

      {/* Наборы работ: быстрый выбор для тех, кто не хочет отмечать строки; ручная отметка сбрасывает набор. */}
      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div className="field" style={{ margin: 0 }}>
          <label>Набор работ</label>
          <Seg name="preset" options={PRESETS} value={preset as PresetId} onChange={choosePreset} />
        </div>
        <span style={{ fontSize: 12.5, color: MUTED, paddingBottom: 9 }}>{paid ? 'Смета оплачена — состав не меняется.' : presetHint}</span>
      </div>

      <div>
        <TableFrame minWidth={780}>
          <thead>
            <tr>
              <th style={{ width: '36%' }}>Работа</th>
              <th style={{ textAlign: 'right' }}>Найдено</th>
              <th>Единица</th>
              <th style={{ textAlign: 'right' }}>Ставка</th>
              <th style={{ textAlign: 'right', paddingRight: 'var(--space-4)' }}>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {/* Аудит стоит 0 и остаётся строкой: клиент видит, что проверка сделана и не оплачена.
                В количество правок не входит — это не правка, и скидку не двигает. */}
            <tr data-row>
              <td>
                <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ width: 14, height: 14, flex: 'none', border: '1.5px solid var(--color-accent)', background: 'var(--color-accent)' }} />
                  <span style={{ fontSize: 14 }}>Технический аудит</span>
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>1</td>
              <td style={{ color: MUTED }}>проект</td>
              <td style={{ textAlign: 'right' }}>{rub(0)}</td>
              <td style={{ textAlign: 'right', paddingRight: 'var(--space-4)', fontFamily: 'var(--font-heading)', fontSize: 16, whiteSpace: 'nowrap' }}>
                {rub(0)}
              </td>
            </tr>
            {lines.map((l) => (
              <tr
                key={l.issue_type}
                data-row
                data-clickable={paid ? undefined : ''}
                role="checkbox"
                aria-checked={l.picked}
                tabIndex={paid ? -1 : 0}
                onClick={() => toggle(l.issue_type)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggle(l.issue_type);
                  }
                }}
              >
                <td>
                  <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        flex: 'none',
                        border: '1.5px solid var(--color-accent)',
                        background: l.picked ? 'var(--color-accent)' : 'transparent',
                      }}
                    />
                    <span style={{ fontSize: 14 }}>{l.name}</span>
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>{num(l.qty)}</td>
                <td style={{ color: MUTED }}>{l.unit}</td>
                <td style={{ textAlign: 'right' }}>{rub(l.rate)}</td>
                <td
                  style={{
                    textAlign: 'right',
                    paddingRight: 'var(--space-4)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 16,
                    whiteSpace: 'nowrap',
                    color: l.picked ? 'var(--color-text)' : MUTED,
                  }}
                >
                  {l.picked ? rub(l.sum) : '—'}
                  {l.picked && l.template && (
                    <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, color: MUTED }}>за шаблон</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </TableFrame>
        {/* Замечания без ставки не прячем: клиент должен знать, что они найдены, но в счёт не входят. */}
        {d.unpriced.length > 0 && (
          <p style={{ fontSize: 12.5, color: MUTED, margin: 'var(--space-3) 0 0' }}>
            Без ставки в прайсе, в смету не входят:{' '}
            {d.unpriced.map((u) => `${u.issueTypes.join(', ')} (${num(u.issues)})`).join(' · ')}.
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
        <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)' }}>
          <Row label="Правок выбрано" value={num(result.units)} />
          <Row label="Сумма работ" value={rub(result.gross)} />
          <Row label={`Скидка за объём · ${pctLabel(result.pct)}`} value={`−${rub(result.discount)}`} accent />
          {/* Срок в макете считался формулой от объёма. Исполнения правок в продукте нет — срок,
              который никто не обеспечит, не называем. */}
          <Row label="Срок выполнения" value={<span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: MUTED }}>согласуем в счёте</span>} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: '1px solid var(--color-divider)',
              paddingTop: 'var(--space-3)',
              marginTop: 'var(--space-2)',
            }}
          >
            <span style={{ fontSize: 14 }}>К оплате</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 34 }}>{rub(result.total)}</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={result.units === 0}
              onClick={() => (approved ? navigate('/app/order') : setApproveOpen(true))}
            >
              Перейти к оплате
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={approved || paid || result.units === 0}
              onClick={() => setApproveOpen(true)}
            >
              {approved ? 'Смета согласована' : dirty ? 'Согласовать изменения' : 'Согласовать смету'}
            </button>
            <button type="button" className="btn btn-secondary" disabled={result.units === 0} onClick={() => setShareOpen(true)}>
              Отправить заказчику
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={result.units === 0}
              onClick={() =>
                void exportEstimateXlsx({
                  host: cab.host ?? '',
                  lines: lines.filter((l) => l.picked),
                  gross: result.gross,
                  discount: result.discount,
                  pct: result.pct,
                  total: result.total,
                })
              }
            >
              Excel
            </button>
          </div>
          {actionError && !approveOpen && <ErrorNote>{actionError}</ErrorNote>}
        </Blueprint>

        <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', minWidth: 0 }}>
          <h2 style={{ fontSize: 18, margin: '0 0 var(--space-4)' }}>Как считается</h2>
          <div style={{ display: 'grid', gap: 'var(--space-3)', fontSize: 13.5, lineHeight: 1.55 }}>
            {[
              'Ставка умножается на фактический объём, найденный в аудите. Ничего не округляем в большую сторону.',
              `Скидка растёт с объёмом: ${DISCOUNT_TIERS.slice()
                .reverse()
                .map((t, i) => `от ${num(t.min)}${i === 0 ? ' правок' : ''} — ${pctLabel(t.pct)}`)
                .join(', ')}.`,
              `Свыше ${num(TEMPLATE_THRESHOLD)} однотипных правок работа считается за шаблон, а не за страницу: ${rub(TEMPLATE_PRICE)} за правило, которое применяется ко всему разделу.`,
              // Прежние пункты «правка, не прошедшая проверку, убирается из счёта» и «повторный аудит через
              // 30 дней» обещали механику, которой в коде нет. Оставляем только то, что правда сейчас.
              'Порядок оплаты — после одобрения превью исправленной копии. Пока приём оплаты не подключён, счёт выставляется по заявке.',
              'Повторный аудит бесплатный, его можно запустить в любой момент, чтобы сравнить результат.',
            ].map((text, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--color-divider)', margin: 'var(--space-6) 0' }} />
          <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 'var(--space-2)' }}>
            Пороги скидки
          </div>
          <div style={{ display: 'flex', gap: 2, height: 30, alignItems: 'flex-end' }}>
            {[
              ['34%', 'color-mix(in srgb,var(--color-accent) 30%,transparent)'],
              ['56%', 'color-mix(in srgb,var(--color-accent) 50%,transparent)'],
              ['78%', 'color-mix(in srgb,var(--color-accent) 70%,transparent)'],
              ['100%', 'var(--color-accent)'],
            ].map(([h, bg]) => (
              <span key={h} style={{ flex: 1, height: h, background: bg }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginTop: 5, fontSize: 11, color: MUTED }}>
            <span>0%</span>
            {DISCOUNT_TIERS.slice()
              .reverse()
              .map((t) => (
                <span key={t.min}>{pctLabel(t.pct)}</span>
              ))}
          </div>
        </div>
      </div>

      <Dialog
        open={approveOpen}
        title="Согласовать смету"
        onClose={() => setApproveOpen(false)}
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setApproveOpen(false)}>
              Отмена
            </button>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void approve()}>
              {busy ? 'Сохраняем…' : 'Согласовать'}
            </button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <Row label="Правок выбрано" value={num(result.units)} />
          <Row label="Сумма работ" value={rub(result.gross)} />
          <Row label={`Скидка за объём · ${pctLabel(result.pct)}`} value={`−${rub(result.discount)}`} accent />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-3)' }}>
            <span style={{ fontSize: 14 }}>К оплате</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 28 }}>{rub(result.total)}</span>
          </div>
          {/* Текст макета «правки уходят в черновик» не пишем: применения правок в продукте нет. */}
          <p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>
            Смета фиксируется с текущими ставками. Дальше — счёт: приём оплаты пока не подключён, счёт выставим по заявке на
            экране заказа.
          </p>
          {actionError && <ErrorNote>{actionError}</ErrorNote>}
        </div>
      </Dialog>

      {shareOpen && (
        <ShareDialog
          onClose={() => setShareOpen(false)}
          units={result.units}
          total={result.total}
          snapshot={shareSnapshot}
          onCreate={async (snapshot, ttlDays, password, email) => {
            if (!cab.userId || !cab.host) throw new Error('Нет входа или проекта');
            const totals = { subtotal: result.gross, discount: result.discount, final: result.total };
            const link = await createShareLink({ userId: cab.userId, auditId: audit.id, snapshot, totals, ttlDays, password });
            // Отправленная смета получает статус «отправлена», но согласованную не откатываем назад.
            if (!savedHere || (savedHere.status !== 'accepted' && savedHere.status !== 'paid')) {
              try {
                await saveEstimate({
                  userId: cab.userId,
                  auditId: audit.id,
                  host: cab.host,
                  existing: saved,
                  status: 'sent',
                  preset,
                  result,
                  lines,
                });
              } catch (err) {
                console.error('Смета: ссылка создана, но статус не сохранён', err);
              }
            }
            let emailError: string | null = null;
            if (email.trim()) {
              try {
                await sendEstimateEmail({ to: email.trim(), snapshot, totals, link: link.url });
              } catch (err) {
                emailError = err instanceof Error ? err.message : 'Письмо не отправлено';
              }
            }
            return { ...link, emailError };
          }}
          onPreview={(token) => navigate(`/app/s/${token}`)}
        />
      )}
    </Screen>
  );
};

/** Диалог «Отправить смету заказчику». Ссылка без входа; письмо — если указана почта. */
const ShareDialog: React.FC<{
  onClose: () => void;
  units: number;
  total: number;
  snapshot: (showRates: boolean, allowExport: boolean) => ShareSnapshot;
  onCreate: (
    snapshot: ShareSnapshot,
    ttlDays: number | null,
    password: string,
    email: string,
  ) => Promise<{ token: string; url: string; expiresAt: string | null; emailError: string | null }>;
  onPreview: (token: string) => void;
}> = ({ onClose, units, total, snapshot, onCreate, onPreview }) => {
  const [email, setEmail] = useState('');
  const [ttl, setTtl] = useState<'7' | '30' | 'none'>('30');
  const [password, setPassword] = useState('');
  const [allowExport, setAllowExport] = useState(true);
  const [showRates, setShowRates] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<{ token: string; url: string; expiresAt: string | null; emailError: string | null; sentTo: string } | null>(null);

  const emailOk = !email.trim() || /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email.trim());

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await onCreate(snapshot(showRates, allowExport), ttl === 'none' ? null : Number(ttl), password, email);
      setLink({ ...r, sentTo: email.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать ссылку');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open
      width={520}
      title="Отправить смету заказчику"
      onClose={onClose}
      actions={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Закрыть
          </button>
          <button type="button" className="btn btn-primary" disabled={busy || !emailOk} onClick={() => void create()}>
            {busy ? 'Создаём…' : link ? 'Отправить ещё раз' : email.trim() ? 'Создать ссылку и отправить' : 'Создать ссылку'}
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>
          Заказчик откроет смету без входа и увидит {num(units)} правок на {rub(total)}.
        </p>
        <div className="field" style={{ margin: 0 }}>
          <label htmlFor="share-email">Почта заказчика</label>
          <input id="share-email" className="input" type="email" placeholder="не обязательно — можно просто скопировать ссылку" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 'var(--space-4)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label>Срок ссылки</label>
            <Seg
              name="share-ttl"
              value={ttl}
              onChange={setTtl}
              options={[
                { value: '7', label: '7 дней' },
                { value: '30', label: '30 дней' },
                { value: 'none', label: 'Без срока' },
              ]}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="share-pass">Пароль, если нужен</label>
            <input id="share-pass" className="input" type="text" placeholder="не задан" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <label className="radio">
            <input type="checkbox" checked={allowExport} onChange={(e) => setAllowExport(e.target.checked)} />
            <span className="dot" />
            Разрешить выгрузку в Excel
          </label>
          <label className="radio">
            <input type="checkbox" checked={showRates} onChange={(e) => setShowRates(e.target.checked)} />
            <span className="dot" />
            Показывать ставки и скидку
          </label>
          {/* Уведомлений о просмотре нет: счётчик просмотров со стороны заказчика не пишется (см. отчёт). */}
          <label className="radio" style={{ cursor: 'default', color: MUTED }}>
            <input type="checkbox" disabled />
            <span className="dot" />
            Уведомить меня о просмотре — не подключено
          </label>
        </div>
        {!emailOk && <ErrorNote>Проверьте адрес почты.</ErrorNote>}
        {error && <ErrorNote>{error}</ErrorNote>}
        {link && (
          <div
            style={{
              border: '1px solid var(--color-divider)',
              background: 'color-mix(in srgb,var(--color-text) 4%,transparent)',
              padding: 'var(--space-3)',
              display: 'flex',
              gap: 'var(--space-3)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 12, flex: 1, minWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {link.url.replace(/^https?:\/\//, '')}
            </span>
            <span style={{ fontSize: 12, color: MUTED }}>
              {link.expiresAt ? `до ${dateLong(link.expiresAt, false)}` : 'без срока'}
              {link.sentTo && !link.emailError ? ` · письмо на ${link.sentTo}` : ''}
            </span>
            <CopyButton text={link.url} label="Копировать ссылку" className="btn btn-ghost" />
            <button type="button" className="btn btn-secondary" onClick={() => onPreview(link.token)}>
              Посмотреть глазами заказчика
            </button>
            {link.emailError && (
              <span style={{ flexBasis: '100%' }}>
                <ErrorNote>Ссылка создана, но письмо не ушло: {link.emailError}</ErrorNote>
              </span>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default Estimate;
