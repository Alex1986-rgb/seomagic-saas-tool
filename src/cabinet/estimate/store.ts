import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';
import type { EstimateResult } from './calc';
import type { PresetId } from './works';

/**
 * Сохранённая смета и выводимые из неё состояния (статус в шапке, стадия заказа).
 *
 * Хранилище — существующая таблица job_estimates. Но туда же пишет issue-classifier: после
 * каждого аудита он кладёт черновик «все замечания × ставка без скидки». Это другой расчёт, и
 * показывать его в шапке как «смету» значило бы расхождение с экраном «Смета». Поэтому кабинет
 * читает только свои записи — с меткой cost_breakdown.source = 'cabinet-v2', которую ставит
 * экран «Смета» при согласовании или отправке заказчику. Черновики классификатора не трогаем.
 */

export const ESTIMATE_SOURCE = 'cabinet-v2';
/** Событие «смета изменилась»: шапка и Обзор перечитывают её без перезагрузки страницы. */
export const ESTIMATE_CHANGED_EVENT = 'seomarket:estimate-changed';

export type EstimateStatus = Database['public']['Enums']['estimate_status'];

export interface SavedLine {
  issue_type: string;
  name: string;
  unit: string;
  qty: number;
  rate: number;
  sum: number;
  template: boolean;
  picked: boolean;
}

export interface SavedEstimate {
  id: string;
  auditId: string | null;
  taskId: string | null;
  status: EstimateStatus;
  gross: number;
  discount: number;
  total: number;
  units: number;
  pct: number;
  preset: PresetId | '';
  lines: SavedLine[];
  createdAt: string | null;
  updatedAt: string | null;
}

interface Breakdown {
  source: string;
  preset?: PresetId | '';
  host?: string;
  units?: number;
  pct?: number;
  lines?: SavedLine[];
}

type Row = Database['public']['Tables']['job_estimates']['Row'];

function fromRow(row: Row): SavedEstimate {
  const b = (row.cost_breakdown ?? {}) as unknown as Breakdown;
  return {
    id: row.id,
    auditId: row.audit_id,
    taskId: row.task_id,
    status: row.status ?? 'draft',
    gross: Number(row.total_cost) || 0,
    discount: Number(row.discount_applied) || 0,
    total: Number(row.final_cost) || 0,
    units: Number(b.units ?? row.total_issues) || 0,
    pct: Number(b.pct) || 0,
    preset: b.preset ?? '',
    lines: Array.isArray(b.lines) ? b.lines : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Последняя смета кабинета по аудитам проекта. Только свои записи (user_id), RLS тут не опора. */
export async function loadSavedEstimate(userId: string, auditIds: string[]): Promise<SavedEstimate | null> {
  if (!userId || auditIds.length === 0) return null;
  const { data, error } = await supabase
    .from('job_estimates')
    .select('*')
    .eq('user_id', userId)
    // Не больше 50 последних аудитов: иначе список id не влезает в адрес запроса.
    .in('audit_id', auditIds.slice(0, 50))
    .filter('cost_breakdown->>source', 'eq', ESTIMATE_SOURCE)
    .order('updated_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data && data[0] ? fromRow(data[0]) : null;
}

export async function findTaskId(userId: string, auditId: string): Promise<string | null> {
  const { data } = await supabase
    .from('audit_tasks')
    .select('id')
    .eq('user_id', userId)
    .eq('audit_id', auditId)
    .order('created_at', { ascending: false })
    .limit(1);
  return data && data[0] ? data[0].id : null;
}

/**
 * Сохраняет снимок сметы. Пишется то, что клиент видел на экране: строки с объёмами и ставками на
 * момент согласования. Если админ потом поменяет прайс, согласованная сумма не «поплывёт» —
 * она зафиксирована здесь, а экран «Смета» покажет пересчёт и предложит согласовать заново.
 *
 * Статус 'paid' клиент не ставит никогда: его выставляет администратор после поступления денег.
 */
export async function saveEstimate(params: {
  userId: string;
  auditId: string;
  host: string;
  existing: SavedEstimate | null;
  status: Exclude<EstimateStatus, 'paid'>;
  preset: PresetId | '';
  result: EstimateResult;
  lines: SavedLine[];
}): Promise<SavedEstimate> {
  const { userId, auditId, host, existing, status, preset, result, lines } = params;
  const breakdown: Breakdown = { source: ESTIMATE_SOURCE, preset, host, units: result.units, pct: result.pct, lines };
  const payload = {
    user_id: userId,
    audit_id: auditId,
    total_issues: result.units,
    total_cost: result.gross,
    discount_applied: result.discount,
    final_cost: result.total,
    cost_breakdown: breakdown as unknown as Json,
    status,
  };

  let row: Row | null = null;
  if (existing && existing.auditId === auditId && existing.status !== 'paid') {
    const { data, error } = await supabase
      .from('job_estimates')
      .update(payload)
      .eq('id', existing.id)
      .eq('user_id', userId)
      .select('*')
      .single();
    if (error) throw error;
    row = data;
  } else {
    const taskId = await findTaskId(userId, auditId);
    const { data, error } = await supabase
      .from('job_estimates')
      .insert({ ...payload, task_id: taskId })
      .select('*')
      .single();
    if (error) throw error;
    row = data;
  }
  window.dispatchEvent(new Event(ESTIMATE_CHANGED_EVENT));
  return fromRow(row);
}

/** Смета текущего проекта для шапки, Обзора, Исправления и Оплаты. */
export function useSavedEstimate(userId: string | null, auditIds: string[]) {
  const [estimate, setEstimate] = useState<SavedEstimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const key = auditIds.slice(0, 50).join(',');

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener(ESTIMATE_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(ESTIMATE_CHANGED_EVENT, onChange);
  }, []);

  useEffect(() => {
    let alive = true;
    if (!userId || !key) {
      setEstimate(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    loadSavedEstimate(userId, key.split(','))
      .then((e) => {
        if (!alive) return;
        setEstimate(e);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        console.error('Кабинет: не удалось прочитать смету', err);
        setError(err instanceof Error ? err.message : 'Не удалось прочитать смету');
        setEstimate(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userId, key, tick]);

  return { estimate, loading, error, reload: () => setTick((t) => t + 1) };
}

/**
 * Подпись статуса сметы — одна на шапку, плитку Обзора и экран сметы, чтобы формулировки не
 * расходились. [короткий статус, подпись ссылки, куда ведёт].
 */
export function estimateStatusView(status: EstimateStatus): [string, string, string] {
  switch (status) {
    case 'paid':
      return ['оплачена', 'Оплачена · смотреть заказ', '/app/order'];
    case 'accepted':
      return ['согласована', 'Согласована · запросить счёт', '/app/order'];
    case 'sent':
      return ['отправлена заказчику', 'Отправлена заказчику · открыть расчёт', '/app/estimate'];
    case 'rejected':
      return ['отклонена', 'Отклонена · пересобрать', '/app/estimate'];
    case 'cancelled':
      return ['отменена', 'Отменена · собрать заново', '/app/estimate'];
    default:
      return ['не согласована', 'Открыть расчёт', '/app/estimate'];
  }
}

/**
 * Пять стадий заказа: [заголовок, пояснение, надпись на кнопке]. Индекс = стадия − 1.
 * Читается экраном «Исправление» и полосой заказа на Обзоре — формулировки общие.
 *
 * Пояснения честные, без дат и баллов из макета («зафиксированы до 28 сентября», «89 против 74»):
 * под ними нет данных.
 */
export const ORDER_STAGES: ReadonlyArray<[string, string, string]> = [
  ['Ждёт оплаты', 'Смета согласована. Приём оплаты не подключён — счёт выставляем по заявке', 'Запросить счёт'],
  ['Правки в работе', 'Оплата получена, ход работ виден по заданию оптимизации', 'Смотреть прогресс'],
  ['Копия готова к проверке', 'Превью исправленной копии пока не подключено', 'Открыть превью'],
  ['Одобрено, ждёт установки', 'Доставка исправлений пока не подключена', 'Выбрать доставку'],
  ['Установлено', 'Результат — на экранах позиций и повторного аудита', 'Смотреть результат'],
];

export const ORDER_STEP_NAMES = ['Оплата', 'Правки', 'Превью', 'Доставка', 'Результат'] as const;

/**
 * Стадия заказа выводится из статуса сметы, а не хранится отдельно — иначе шапка и полоса заказа
 * разойдутся. Заказ существует только у согласованной или оплаченной сметы.
 *  - accepted → 1 (ждёт оплаты);
 *  - paid → 2 (правки): оплату отмечает администратор после поступления денег по счёту.
 * Стадии 3–5 (превью копии, доставка, установка) сейчас недостижимы: под ними нет бэкенда,
 * и выдавать их по таймеру, как прототип, значит обманывать клиента.
 */
export function orderStageOf(estimate: SavedEstimate | null): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!estimate) return 0;
  if (estimate.status === 'paid') return 2;
  if (estimate.status === 'accepted') return 1;
  return 0;
}
