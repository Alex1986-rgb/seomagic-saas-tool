import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PricingService } from '@/services/audit/issues/PricingService';
import { Empty, ErrorNote, Loading, MUTED, NotConnected, TableFrame, Tag } from '../ui';
import { dateLong, num, rub } from '../format';
import { DISCOUNT_TIERS, TEMPLATE_PRICE, TEMPLATE_THRESHOLD } from '../estimate/calc';
import { unitFor } from '../estimate/works';
import { errText, useAsync } from './data';
import { H2, Lead } from './shared';

/**
 * Цены — макет, строки 1917–1982.
 *
 * Один прайс на платформу: таблица pricing_rules. Её же читает расчёт сметы (estimate/works.ts),
 * поэтому сохранение здесь сразу меняет суммы новых смет у клиентов. Запись разрешена только роли
 * admin (политика «Прайс меняет администратор»); запрет PostgREST возвращает не ошибкой, а пустым
 * ответом — успехом считаем только строку, которую база вернула изменённой (как PricingSettings).
 *
 * Отличия от макета, и почему:
 *  - нет колонок «Объём №418» и «Сумма»: в админке нет «текущей сметы», а сметы клиентов
 *    администратору RLS не отдаёт — объём был бы выдуманным;
 *  - «Вернуть заводские ставки» → «Отменить правки»: заводских ставок в базе не хранится;
 *  - «кто менял» не показываем: в pricing_rules нет поля автора, есть только updated_at (триггер);
 *  - скидки и шаблонная ставка — справочно, из estimate/calc.ts, без полей ввода: они заданы в коде
 *    расчёта, и поле, которое ничего не сохраняет, обманывало бы администратора.
 */

interface RuleRow {
  id: string;
  rule_name: string;
  issue_type: string;
  price_per_item: number;
  is_active: boolean | null;
  is_bundle: boolean | null;
  updated_at: string | null;
}

async function loadRules(): Promise<RuleRow[]> {
  const { data, error } = await supabase
    .from('pricing_rules')
    .select('id, rule_name, issue_type, price_per_item, is_active, is_bundle, updated_at')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({ ...r, price_per_item: Number(r.price_per_item) }));
}

/**
 * Ставка из поля: неотрицательное число, копейки допускаются (numeric(10,2)), запятая = точка.
 * Пустое и кривое значение — null, а не 0: молча обнулённая ставка раздала бы работу бесплатно.
 */
function parseRate(value: string): number | null {
  const normalized = value.replace(/\s/g, '').replace(',', '.');
  if (normalized === '') return null;
  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

type SaveNote = { tone: 'ok' | 'error'; text: string } | null;

const RatesTab: React.FC = () => {
  const { data, loading, error, reload } = useAsync(loadRules);
  /** Введённые значения по id; нет ключа — поле показывает сохранённую ставку. */
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<SaveNote>(null);

  // После перезагрузки прайса черновик сбрасываем: сравнивать правки со старыми ставками нельзя.
  useEffect(() => setDraft({}), [data]);

  const rules = useMemo(() => (data ?? []).filter((r) => !r.is_bundle), [data]);
  const bundles = (data ?? []).length - rules.length;

  const valueOf = (r: RuleRow) => draft[r.id] ?? String(r.price_per_item);
  const changed = rules.filter((r) => r.id in draft && parseRate(draft[r.id]) !== r.price_per_item);
  const invalid = rules.filter((r) => r.id in draft && parseRate(draft[r.id]) === null);

  const lastUpdated = (data ?? []).reduce<string | null>(
    (acc, r) => (r.updated_at && (!acc || r.updated_at > acc) ? r.updated_at : acc),
    null,
  );

  const save = async () => {
    if (invalid.length > 0 || changed.length === 0) return;
    setSaving(true);
    setNote(null);
    let saved = 0;
    let denied = false;
    const errors: string[] = [];
    try {
      for (const r of changed) {
        const price = parseRate(draft[r.id]);
        if (price === null) continue;
        const { data: rows, error: err } = await supabase
          .from('pricing_rules')
          .update({ price_per_item: price })
          .eq('id', r.id)
          .select('id');
        if (err) errors.push(`${r.rule_name}: ${err.message}`);
        else if (!rows || rows.length === 0) denied = true;
        else saved += 1;
      }
    } catch (err) {
      errors.push(errText(err));
    } finally {
      setSaving(false);
    }
    // Кеш прайса в PricingService живёт в памяти вкладки: без сброса старый расчёт сметы
    // в этой же вкладке продолжал бы считать по прежним ставкам.
    if (saved > 0) PricingService.clearCache();

    const notSaved = changed.length - saved;
    if (notSaved === 0) {
      setNote({ tone: 'ok', text: `Сохранено ставок: ${saved}. Новые сметы считаются по ним, посчитанные раньше не меняются.` });
    } else {
      const reasons = [
        denied ? 'база отказала: менять прайс может только роль администратора' : null,
        errors[0] ?? null,
      ].filter(Boolean);
      setNote({ tone: 'error', text: `Не записано ставок: ${notSaved}. ${reasons.join('; ')}` });
    }
    // Перечитываем прайс, только если что-то записалось: иначе сброс черновика стёр бы ввод,
    // который база не приняла, и его пришлось бы набирать заново.
    if (saved > 0) reload();
  };

  if (loading && !data) return <Loading label="Загружаем прайс…" />;
  if (error) return <ErrorNote>Прайс не загрузился: {error}</ErrorNote>;

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <Lead>
        Ставка умножается на объём, найденный аудитом: за каждое замечание этого типа на сайте клиента. Сохранённая ставка
        сразу действует для новых смет; уже посчитанные сметы хранят свою сумму и не пересчитываются.
      </Lead>

      {rules.length === 0 ? (
        <Empty title="В прайсе нет ни одной ставки">
          Смета без ставок получится нулевой. Строки прайса лежат в таблице pricing_rules.
        </Empty>
      ) : (
        <TableFrame minWidth={640}>
          <thead>
            <tr>
              <th style={{ width: '46%' }}>Работа</th>
              <th>Единица</th>
              <th style={{ textAlign: 'right', width: 130 }}>Ставка, ₽</th>
              <th>Изменено</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => {
              const value = valueOf(r);
              const parsed = parseRate(value);
              const isChanged = r.id in draft && parsed !== r.price_per_item;
              const bad = r.id in draft && parsed === null;
              return (
                <tr key={r.id} data-row>
                  <td style={{ fontSize: 14 }}>
                    {/* Метка слева — строка изменена и ещё не сохранена. */}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 3,
                        height: 14,
                        verticalAlign: -2,
                        marginRight: 9,
                        background: isChanged ? 'var(--color-accent)' : 'transparent',
                      }}
                    />
                    <label htmlFor={`rate-${r.id}`}>{r.rule_name}</label>
                    {r.is_active !== true && (
                      <Tag tone="neutral" style={{ marginLeft: 8 }}>
                        в смету не входит
                      </Tag>
                    )}
                  </td>
                  <td style={{ fontSize: 12.5, color: MUTED }}>{unitFor(r.issue_type)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <input
                      id={`rate-${r.id}`}
                      className="input"
                      type="text"
                      inputMode="decimal"
                      value={value}
                      disabled={saving}
                      aria-invalid={bad || undefined}
                      onChange={(e) => {
                        const v = e.target.value;
                        setNote(null);
                        setDraft((d) => ({ ...d, [r.id]: v }));
                      }}
                      style={{
                        width: 96,
                        textAlign: 'right',
                        fontFamily: 'var(--font-heading)',
                        fontSize: 15,
                        padding: '5px 9px',
                        ...(bad ? { borderColor: 'var(--color-critical)' } : {}),
                      }}
                    />
                  </td>
                  <td style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>
                    {bad ? 'нужно число ≥ 0' : isChanged ? `было ${rub(r.price_per_item)}` : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableFrame>
      )}

      {bundles > 0 && (
        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
          В прайсе ещё {num(bundles)} пакетных строк — в смету они не входят: продукт отказался от пакетов.
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        {/* Пороги — из estimate/calc.ts: тот же массив, по которому считается смета, а не копия. */}
        <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
          <H2 size={18} mb="0">Скидка за объём</H2>
          <p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>
            Считается от числа правок в смете, а не от суммы — иначе дорогие тексты давали бы скидку там, где работы мало.
          </p>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {[...DISCOUNT_TIERS]
              .sort((a, b) => a.min - b.min)
              .map((t) => (
                <div
                  key={t.min}
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 'var(--space-3)', alignItems: 'baseline' }}
                >
                  <span style={{ fontSize: 13.5 }}>от {num(t.min)} правок</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }}>{Math.round(t.pct * 100)} %</span>
                </div>
              ))}
          </div>
          <p style={{ fontSize: 11.5, color: MUTED, margin: 0 }}>Задаётся в коде расчёта сметы, из админки не меняется.</p>
        </section>

        <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
          <H2 size={18} mb="0">Шаблонная ставка</H2>
          <p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>
            Свыше порога однотипные правки считаются за правило, а не за страницу: постраничный счёт на крупном каталоге
            невозможно защитить.
          </p>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 'var(--space-3)', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13.5 }}>Порог, правок</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }}>{num(TEMPLATE_THRESHOLD)}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 'var(--space-3)', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13.5 }}>Ставка за правило</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }}>{rub(TEMPLATE_PRICE)}</span>
            </div>
          </div>
          <p style={{ fontSize: 11.5, color: MUTED, margin: 0 }}>Задаётся в коде расчёта сметы, из админки не меняется.</p>
        </section>

        {/* Журнал изменений прайса. В pricing_rules есть только updated_at, автора правки база не пишет. */}
        <NotConnected
          title="Кто менял прайс"
          needs={['поле автора правки в pricing_rules или журнал изменений прайса (кто, когда, было → стало)']}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={save}
          disabled={saving || changed.length === 0 || invalid.length > 0}
        >
          {saving ? 'Сохраняем…' : changed.length > 0 ? `Сохранить прайс (${changed.length})` : 'Сохранить прайс'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setDraft({});
            setNote(null);
          }}
          disabled={saving || Object.keys(draft).length === 0}
        >
          Отменить правки
        </button>
        <span
          role={note ? 'status' : undefined}
          style={{ fontSize: 12.5, color: note?.tone === 'error' ? 'var(--color-critical)' : MUTED }}
        >
          {note ? note.text : lastUpdated ? `Последнее изменение: ${dateLong(lastUpdated)}` : ''}
        </span>
      </div>
    </div>
  );
};

export default RatesTab;
