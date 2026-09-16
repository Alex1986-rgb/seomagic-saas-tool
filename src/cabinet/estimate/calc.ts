/**
 * ЕДИНСТВЕННЫЙ расчёт сметы кабинета.
 *
 * Его читают экран «Смета», диалоги согласования и отправки, «Исправление», «Оплата», снимок для
 * заказчика и (через сохранённую смету) шапка и «Обзор». Если хоть одна поверхность посчитает
 * сама, сумма в шапке и в счёте разойдутся — а счёт, который нельзя защитить, хуже отсутствия счёта.
 *
 * Правила (макет, блок «Как считается»):
 *  1. Сумма строки = ставка × фактический объём из аудита, без округления объёма вверх.
 *  2. Свыше 10 000 однотипных правок строка считается за шаблон: 4 000 ₽ за правило на весь
 *     раздел, если это дешевле постраничной ставки. В скрипте макета правило только написано
 *     текстом; здесь оно применяется, иначе текст на экране обещал бы то, чего расчёт не делает.
 *  3. Скидка — от количества правок (не от суммы) и на всю смету: от 100 — 20 %, от 1 000 — 40 %,
 *     от 3 000 — 55 %. Пакетов basic/standard/premium нет — продукт от них отказался.
 */

export const DISCOUNT_TIERS: ReadonlyArray<{ min: number; pct: number }> = [
  { min: 3000, pct: 0.55 },
  { min: 1000, pct: 0.4 },
  { min: 100, pct: 0.2 },
];

export const TEMPLATE_THRESHOLD = 10000;
export const TEMPLATE_PRICE = 4000;

export function discountPct(units: number): number {
  for (const tier of DISCOUNT_TIERS) if (units >= tier.min) return tier.pct;
  return 0;
}

/** Копейки не теряем на сложении дробных ставок (numeric(10,2) в прайсе). */
const money = (n: number) => Math.round(n * 100) / 100;

export function lineSum(qty: number, rate: number): { sum: number; template: boolean } {
  const q = Math.max(0, qty || 0);
  const r = Math.max(0, rate || 0);
  const perUnit = money(q * r);
  if (q > TEMPLATE_THRESHOLD && perUnit > TEMPLATE_PRICE) return { sum: TEMPLATE_PRICE, template: true };
  return { sum: perUnit, template: false };
}

export interface EstimateLineInput {
  key: string;
  qty: number;
  rate: number;
  picked: boolean;
}

export interface EstimateLine extends EstimateLineInput {
  /** Сумма строки (0 для неотмеченной — в итог не входит). */
  sum: number;
  /** Строка посчитана по шаблонной ставке. */
  template: boolean;
}

export interface EstimateResult {
  lines: EstimateLine[];
  /** Сумма работ до скидки. */
  gross: number;
  /** Количество правок в отмеченных строках — от него зависит скидка. */
  units: number;
  pct: number;
  /** Скидка в целых рублях, как в макете. */
  discount: number;
  /** К оплате. */
  total: number;
}

export function calcEstimate(input: EstimateLineInput[]): EstimateResult {
  let gross = 0;
  let units = 0;
  const lines = input.map((l) => {
    const { sum, template } = lineSum(l.qty, l.rate);
    if (l.picked) {
      gross += sum;
      units += Math.max(0, l.qty || 0);
    }
    return { ...l, sum: l.picked ? sum : 0, template };
  });
  gross = money(gross);
  const pct = discountPct(units);
  const discount = Math.round(gross * pct);
  return { lines, gross, units, pct, discount, total: money(gross - discount) };
}
