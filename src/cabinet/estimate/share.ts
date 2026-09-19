import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

/**
 * Смета по ссылке для заказчика (таблица shared_estimates) и письмо со ссылкой
 * (функция send-estimate-email).
 *
 * В shared_estimates кладётся снимок, а не ссылка на живую смету: заказчик должен видеть ровно
 * то, что ему отправили, даже если исполнитель потом поменял состав работ или админ — прайс.
 * totals держим в прежней форме {subtotal, discount, final}: её же читает функция письма.
 */

export const SHARE_SOURCE = 'cabinet-v2';

export interface ShareLine {
  name: string;
  unit: string;
  qty: number;
  rate: number;
  sum: number;
  template: boolean;
}

export interface ShareSnapshot {
  source: typeof SHARE_SOURCE;
  host: string;
  preparedBy: string | null;
  preparedAt: string;
  auditId: string | null;
  /** Балл и число критичных замечаний на момент отправки — из аудита, не прогноз. */
  score: number | null;
  criticalCount: number;
  units: number;
  pct: number;
  showRates: boolean;
  allowExport: boolean;
  lines: ShareLine[];
}

export interface ShareTotals {
  subtotal: number;
  discount: number;
  final: number;
}

/**
 * Хеш пароля ссылки — SHA-256, тот же, что у старого диалога «Поделиться сметой», чтобы обе
 * страницы понимали одни и те же ссылки. Это не защита уровня bcrypt; см. отчёт: проверка пароля
 * должна переехать на сервер вместе с чтением сметы по токену.
 */
export async function hashSharePassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Адрес ссылки. BASE_URL сохраняет подпуть публикации (/seomagic-saas-tool/), иначе 404. */
export function shareUrlOf(token: string): string {
  const base = `${window.location.origin}${import.meta.env.BASE_URL || '/'}`;
  return `${base.endsWith('/') ? base : `${base}/`}app/s/${token}`;
}

export async function createShareLink(params: {
  userId: string;
  auditId: string | null;
  snapshot: ShareSnapshot;
  totals: ShareTotals;
  ttlDays: number | null;
  password: string;
}): Promise<{ token: string; url: string; expiresAt: string | null }> {
  const { userId, auditId, snapshot, totals, ttlDays, password } = params;
  const expiresAt = ttlDays ? new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString() : null;
  const passwordHash = password.trim() ? await hashSharePassword(password.trim()) : null;
  const { data, error } = await supabase
    .from('shared_estimates')
    .insert({
      user_id: userId,
      audit_id: auditId,
      estimate_data: snapshot as unknown as Json,
      totals: totals as unknown as Json,
      url: snapshot.host,
      expires_at: expiresAt,
      password_hash: passwordHash,
    })
    .select('share_token')
    .single();
  if (error) throw error;
  return { token: data.share_token, url: shareUrlOf(data.share_token), expiresAt };
}

/**
 * Письмо заказчику. Функция строит письмо из строк {category, count, totalPrice, cost}; свою
 * публичную ссылку она ведёт на старый адрес /shared-estimate/, поэтому create_public_link не
 * просим, а ссылку на новую страницу кладём в текст письма.
 */
export async function sendEstimateEmail(params: {
  to: string;
  snapshot: ShareSnapshot;
  totals: ShareTotals;
  link: string;
}): Promise<void> {
  const { to, snapshot, totals, link } = params;
  const { data, error } = await supabase.functions.invoke('send-estimate-email', {
    body: {
      to_emails: [to],
      estimate_data: snapshot.lines.map((l) => ({ category: l.name, count: l.qty, totalPrice: l.sum, cost: l.rate })),
      totals,
      url: snapshot.host,
      message: `Смета на исправление ${snapshot.host}. Открыть и согласовать: ${link}`,
      create_public_link: false,
    },
  });
  if (error || (data && data.success === false)) {
    let message = (data && data.error) || 'Письмо не отправлено';
    const ctx = (error as { context?: Response } | null)?.context;
    if (ctx && typeof ctx.json === 'function') {
      try {
        const body = await ctx.json();
        if (body?.error) message = body.error;
      } catch {
        /* тело ответа не JSON */
      }
    }
    throw new Error(message);
  }
}

/** Выгрузка строк сметы в Excel. xlsx грузится по требованию — это ~400 КБ, не нужные на экране. */
export async function exportEstimateXlsx(params: {
  host: string;
  lines: ShareLine[];
  gross: number;
  discount: number;
  pct: number;
  total: number;
  showRates?: boolean;
}): Promise<void> {
  const { host, lines, gross, discount, pct, total, showRates = true } = params;
  const XLSX = await import('xlsx');
  const head = showRates ? ['Работа', 'Объём', 'Единица', 'Ставка, ₽', 'Сумма, ₽'] : ['Работа', 'Объём', 'Единица', 'Сумма, ₽'];
  const rows = lines.map((l) =>
    showRates ? [l.name, l.qty, l.unit, l.rate, l.sum] : [l.name, l.qty, l.unit, l.sum],
  );
  const pad = showRates ? ['', '', '', ''] : ['', '', ''];
  const sheet = XLSX.utils.aoa_to_sheet([
    [`Смета на исправление ${host}`],
    [`Дата: ${new Date().toLocaleDateString('ru-RU')}`],
    [],
    head,
    ...rows,
    [],
    // Скрытые ставки скрываем и в файле: иначе выгрузка раскрыла бы то, что исполнитель не показал.
    ...(showRates
      ? [
          [...pad.slice(1), 'Сумма работ', gross],
          [...pad.slice(1), `Скидка за объём ${Math.round(pct * 100)} %`, -discount],
        ]
      : []),
    [...pad.slice(1), 'К оплате', total],
  ]);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Смета');
  const out = XLSX.write(book, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smeta-${host.replace(/[^a-z0-9.-]/gi, '-')}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
