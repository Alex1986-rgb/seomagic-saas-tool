
import { useMemo, useState, useCallback, useEffect } from 'react';
import { Payment } from './types';
import { mockPayments } from './mockData';
import { supabase, isDemoMode } from '@/integrations/supabase/client';

// Заказ из таблицы orders → форма Payment для таблицы админки.
const SERVICE_LABEL: Record<string, string> = { full: 'Под ключ', fix: 'Исправление', 'seo-text': 'SEO-тексты' };
const STATUS_MAP: Record<string, string> = { paid: 'completed', pending: 'pending', failed: 'failed', canceled: 'failed', refunded: 'failed' };

function mapOrder(o: any): Payment {
  return {
    id: String(o.id).slice(0, 8).toUpperCase(),
    user: { name: o.customer_email ? o.customer_email.split('@')[0] : (o.url || '—'), email: o.customer_email || '—' },
    amount: o.amount || 0,
    date: o.created_at ? new Date(o.created_at).toLocaleDateString('ru-RU') : '',
    status: STATUS_MAP[o.status] || 'pending',
    plan: SERVICE_LABEL[o.service] || o.service || '—',
    method: o.provider && o.provider !== 'none' ? o.provider : 'не указан',
  };
}

export const usePayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [loading, setLoading] = useState(false);

  // Реальные заказы из orders (через edge orders-list); в демо без бэкенда — остаются моки.
  useEffect(() => {
    if (isDemoMode) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('orders-list', { body: {} });
        if (!cancelled && !error && data?.success && Array.isArray(data.orders) && data.orders.length) {
          setPayments(data.orders.map(mapOrder));
        }
      } catch { /* оставляем моки */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSearchChange = useCallback((value: string) => setSearchTerm(value), []);
  const handleStatusChange = useCallback((value: string) => setStatusFilter(value), []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  return { searchTerm, statusFilter, loading, handleSearchChange, handleStatusChange, filteredPayments };
};
