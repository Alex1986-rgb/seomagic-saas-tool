import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetProject } from '../project';
import { Blueprint, ErrorNote, Loading, MUTED, Screen } from '../ui';
import { hostOf } from '../format';
import { relativeTime } from '../analytics/time';

/**
 * «Уведомления» — макет, строки 1531–1587.
 *
 * Источник — таблица notifications. Пишет её только create-notification под служебным ключом,
 * типы: audit_completed, optimization_completed, marketing, system. Уведомлений макета про
 * откат правок, падение позиций, 5xx и несогласованную смету в продукте нет — их никто не
 * создаёт, поэтому и на экране их не рисуем.
 *
 * Прочитанное — настоящее: read + read_at (политика UPDATE пускает владельца). Непрочитанные —
 * акцентный квадрат, прочитанные — контур и приглушение, как нижняя строка макета.
 * «Нет уведомлений» (noAlerts макета) — когда непрочитанных нет; «Вернуть уведомления»
 * показывает уже прочитанные, а не восстанавливает удалённое.
 *
 * Бейдж в сайдбаре пересчитывается при смене экрана — после «отметить все» он погаснет при
 * переходе на другой раздел.
 */

interface NotificationRow {
  id: string;
  type: string;
  title: string;
  message: string;
  data: unknown;
  read: boolean | null;
  created_at: string | null;
}

const LIMIT = 100;

/** Куда ведёт уведомление: только туда, где есть что открыть по его типу. */
function linkFor(n: NotificationRow): { to: string; label: string } | null {
  if (n.type === 'audit_completed') return { to: '/app/results', label: 'Открыть результаты' };
  if (n.type === 'optimization_completed') return { to: '/app/optimize', label: 'Открыть исправления' };
  return null;
}

/** Хост из данных уведомления (create-notification кладёт туда url аудита). */
function hostFromData(data: unknown): string | null {
  const url = data && typeof data === 'object' ? (data as { url?: unknown }).url : null;
  return typeof url === 'string' && url ? hostOf(url) : null;
}

const Alerts: React.FC = () => {
  const { userId, projects, setHost } = useCabinetProject();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRead, setShowRead] = useState(false);
  const [marking, setMarking] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setError(null);
    const { data, error: qErr } = await supabase
      .from('notifications')
      .select('id, type, title, message, data, read, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(LIMIT);
    if (qErr) setError(qErr.message);
    else setItems((data ?? []) as NotificationRow[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const unread = items.filter((n) => !n.read);

  const markRead = async (ids: string[]) => {
    if (!userId || ids.length === 0) return;
    const now = new Date().toISOString();
    // Сразу гасим на экране, при ошибке — перечитываем из базы.
    setItems((list) => list.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)));
    const { error: uErr } = await supabase
      .from('notifications')
      .update({ read: true, read_at: now })
      .eq('user_id', userId)
      .in('id', ids);
    if (uErr) {
      setError(uErr.message);
      await load();
    }
  };

  const markAll = async () => {
    if (!userId) return;
    setMarking(true);
    const now = new Date().toISOString();
    // Все непрочитанные пользователя, а не только загруженные 100: иначе старые остались бы в бейдже.
    const { error: uErr } = await supabase
      .from('notifications')
      .update({ read: true, read_at: now })
      .eq('user_id', userId)
      .eq('read', false);
    if (uErr) setError(uErr.message);
    else {
      setItems((list) => list.map((n) => ({ ...n, read: true })));
      setShowRead(false);
    }
    setMarking(false);
  };

  const visible = showRead ? items : unread;
  const hasAlerts = visible.length > 0;

  return (
    <Screen maxWidth={840}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 style={{ fontSize: 36, margin: '0 0 4px' }}>Уведомления</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Только то, что требует решения. Остальное копится в отчётах.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => void markAll()} disabled={marking || unread.length === 0}>
          {marking ? 'Отмечаем…' : 'Отметить прочитанными'}
        </button>
      </div>

      {error && <ErrorNote>Не удалось обновить уведомления: {error}</ErrorNote>}

      {loading ? (
        <Loading />
      ) : hasAlerts ? (
        <div style={{ border: '1px solid var(--color-divider)' }}>
          {visible.map((n, i) => {
            const link = linkFor(n);
            const isRead = !!n.read;
            const nHost = hostFromData(n.data);
            return (
              <div
                key={n.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  borderBottom: i < visible.length - 1 ? '1px solid var(--color-divider)' : undefined,
                  alignItems: 'start',
                  opacity: isRead ? 0.62 : 1,
                }}
              >
                <span
                  aria-label={isRead ? 'Прочитано' : 'Не прочитано'}
                  style={{
                    width: 8,
                    height: 8,
                    marginTop: 6,
                    ...(isRead
                      ? { border: '1px solid color-mix(in srgb,var(--color-text) 35%,transparent)' }
                      : { background: 'var(--color-accent)' }),
                  }}
                />
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 14.5, wordBreak: 'break-word' }}>{n.title}</span>
                  <span style={{ display: 'block', fontSize: 12.5, color: MUTED, marginTop: 2, wordBreak: 'break-word' }}>
                    {n.message}
                  </span>
                  <span style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 6 }}>
                    {link && (
                      <Link
                        to={link.to}
                        style={{ fontSize: 12.5 }}
                        onClick={() => {
                          // Уведомление про другой сайт открывает его проект, иначе результаты
                          // показали бы текущий. Переход считается прочтением.
                          if (nHost && projects.some((p) => p.host === nHost)) setHost(nHost);
                          if (!isRead) void markRead([n.id]);
                        }}
                      >
                        {link.label}
                      </Link>
                    )}
                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => void markRead([n.id])}
                        style={{ font: 'inherit', fontSize: 12.5, color: MUTED, background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
                      >
                        Прочитано
                      </button>
                    )}
                  </span>
                </span>
                <span style={{ fontSize: 11.5, color: MUTED, whiteSpace: 'nowrap' }}>{relativeTime(n.created_at)}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <Blueprint
          style={{ padding: '64px var(--space-8)', display: 'grid', gap: 'var(--space-3)', justifyItems: 'center', textAlign: 'center' }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
            <path d="M10.5 20a2 2 0 0 0 3 0" />
          </svg>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>Ничего не требует внимания</span>
          {/* Текст макета («позиции стабильны, сервер отвечает, следующая проверка в 06:00») обещает
              мониторинг, которого нет. Говорим только то, что знаем. */}
          <span style={{ fontSize: 13.5, color: MUTED, maxWidth: '44ch' }}>
            {items.length > 0
              ? 'Все уведомления прочитаны. Новые придут, когда завершится аудит или подготовка исправлений.'
              : 'Уведомлений пока нет. Они придут, когда завершится аудит или подготовка исправлений.'}
          </span>
          {items.length > 0 && (
            <button type="button" className="btn btn-secondary" onClick={() => setShowRead(true)} style={{ marginTop: 'var(--space-3)' }}>
              Вернуть уведомления
            </button>
          )}
        </Blueprint>
      )}
    </Screen>
  );
};

export default Alerts;
