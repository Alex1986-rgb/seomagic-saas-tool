import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { unitFor } from './works';

/**
 * Ставки работ для сметы — из таблицы pricing_rules.
 *
 * Прайс один на кабинет, админку и смету: админ меняет ставку в pricing_rules — смета клиента
 * пересчитывается тем же расчётом (calc.ts). Своих копий цен в коде нет: расхождение прайса и
 * счёта означает счёт, который нельзя защитить.
 *
 * Пакеты (is_bundle) отбрасываются: продукт отказался от пакетов basic/standard/premium со
 * скидками, в кабинете они не показываются и в расчёт не входят. Неактивные правила — тоже.
 */

/**
 * Контракт (id, name, unit, rate) держать неизменным — на него опираются Обзор, Результаты и Админка.
 * id — pricing_rules.id: по нему админка обновляет ставку.
 */
export interface WorkRate {
  id: string;
  name: string;
  unit: string;
  rate: number;
}

/** Полная строка прайса для сметы: смете нужен ещё тип замечания, к которому привязана ставка. */
export interface PriceRule extends WorkRate {
  issueType: string;
  category: string;
  sortOrder: number;
}

export async function fetchPriceRules(): Promise<PriceRule[]> {
  const { data, error } = await supabase
    .from('pricing_rules')
    .select('id, rule_name, issue_type, category, price_per_item, sort_order, is_bundle, is_active')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? [])
    .filter((r) => !r.is_bundle)
    .map((r) => ({
      id: r.id,
      name: r.rule_name,
      issueType: r.issue_type,
      category: r.category,
      unit: unitFor(r.issue_type),
      // numeric приходит числом, но старые клиенты PostgREST отдают строку — приводим явно.
      rate: Number(r.price_per_item) || 0,
      sortOrder: r.sort_order ?? 0,
    }));
}

export function usePriceRules(): { rules: PriceRule[]; loading: boolean; error: string | null; reload: () => void } {
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchPriceRules()
      .then((r) => {
        if (!alive) return;
        setRules(r);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        console.error('Смета: не удалось загрузить прайс', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить прайс');
        setRules([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { rules, loading, error, reload };
}

export function useWorkRates(): { rates: WorkRate[]; loading: boolean; error: string | null } {
  const { rules, loading, error } = usePriceRules();
  // Мемоизация: потребители кладут rates в зависимости эффектов, новый массив на каждый рендер
  // зациклил бы их.
  const rates = useMemo(() => rules.map(({ id, name, unit, rate }) => ({ id, name, unit, rate })), [rules]);
  return { rates, loading, error };
}
