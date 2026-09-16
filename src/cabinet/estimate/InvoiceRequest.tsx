import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { submitContactRequest } from '@/services/contact/submitRequest';
import { dateLong, num, rub } from '../format';
import { ErrorNote, MUTED, NotConnected } from '../ui';

/**
 * «Приём оплаты не подключён» + «Запросить счёт».
 *
 * Оплаты с холдом в продукте нет (ни платёжного шлюза, ни холда, ни возврата). Кнопка «Оплатить»,
 * которая ничего не списывает, — ложь клиенту. Вместо неё честная заявка на счёт в contact_requests
 * (kind = 'invoice', сумма и сайт из сметы) — её разбирает администратор, как и прочие заявки.
 *
 * Повторную заявку на ту же сумму не шлём: иначе каждое нажатие множит одинаковые счета у админа.
 * Сумма поменялась (пересогласовали смету) — просить новый счёт можно.
 */

interface LastRequest {
  createdAt: string;
  amount: number | null;
  status: string;
}

export const InvoiceRequest: React.FC<{
  host: string;
  amount: number;
  units: number;
  estimateId: string;
  method?: string;
  compact?: boolean;
}> = ({ host, amount, units, estimateId, method, compact }) => {
  const { user } = useAuth();
  const userId = user.user?.id ?? null;
  const email = user.user?.email ?? user.profile?.email ?? '';
  const [last, setLast] = useState<LastRequest | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!userId) return;
    void supabase
      .from('contact_requests')
      .select('created_at, amount, status')
      .eq('user_id', userId)
      .eq('kind', 'invoice')
      .eq('site_url', host)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (!alive) return;
        const row = data?.[0];
        setLast(row ? { createdAt: row.created_at, amount: row.amount === null ? null : Number(row.amount), status: row.status } : null);
      });
    return () => {
      alive = false;
    };
  }, [userId, host]);

  const sameAmount = last !== null && last.amount !== null && Math.round(last.amount) === Math.round(amount);

  const send = async () => {
    if (!email) {
      setError('В профиле нет почты — счёт некуда отправить. Укажите почту в настройках.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      await submitContactRequest({
        kind: 'invoice',
        email,
        name: user.profile?.full_name,
        subject: `Счёт по смете · ${host}`,
        message: [
          `Смета ${estimateId}`,
          `Правок: ${num(units)}`,
          `К оплате: ${rub(amount)}`,
          method ? `Способ оплаты: ${method}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
        siteUrl: host,
        amount,
      });
      setLast({ createdAt: new Date().toISOString(), amount, status: 'new' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку');
    } finally {
      setSending(false);
    }
  };

  const action = (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <button type="button" className="btn btn-primary" onClick={() => void send()} disabled={sending || sameAmount}>
        {sending ? 'Отправляем…' : sameAmount ? 'Счёт запрошен' : last ? 'Запросить счёт на новую сумму' : 'Запросить счёт'}
      </button>
      {last && (
        <span style={{ fontSize: 12, color: MUTED }}>
          Заявка от {dateLong(last.createdAt)}
          {last.amount !== null ? ` на ${rub(last.amount)}` : ''} ·{' '}
          {last.status === 'done' ? 'обработана' : last.status === 'in_progress' ? 'в работе' : 'принята'}. Счёт придёт на{' '}
          {email || 'почту из профиля'}.
        </span>
      )}
      {error && <ErrorNote>{error}</ErrorNote>}
    </div>
  );

  if (compact) return action;

  return (
    <NotConnected title="Приём оплаты не подключён" action={action}>
      Оплата картой, по СБП и холд до одобрения превью пока не работают. Счёт на {rub(amount)} выставим по заявке —
      его увидит администратор и пришлёт на почту.
    </NotConnected>
  );
};
