import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/services/auth/authService';
import { ErrorNote, Loading, MUTED } from '../ui';
import { AccentNote, FormError } from './parts';
import { SettingsSection } from './SettingsSection';

/**
 * Профиль и уведомления — настоящие данные из profiles (full_name, notify_*).
 * Одна загрузка на оба раздела: они читают одну строку, два запроса подряд были бы лишними.
 *
 * Почта — адрес входа (auth.users): показываем без правки, как в существующем ClientProfileTab.
 * Смена почты требует подтверждения на оба адреса — этого сценария в продукте нет.
 */

interface ProfileRow {
  full_name: string | null;
  email_notifications: boolean | null;
  notify_audit_completed: boolean | null;
  notify_optimization: boolean | null;
  notify_marketing: boolean | null;
}

const EMPTY_ROW: ProfileRow = {
  full_name: null,
  email_notifications: null,
  notify_audit_completed: null,
  notify_optimization: null,
  notify_marketing: null,
};

export const ProfileSections: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const userId = user.user?.id ?? null;
  const email = user.user?.email ?? user.profile?.email ?? '';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [row, setRow] = useState<ProfileRow | null>(null);

  const [fullName, setFullName] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [auditDone, setAuditDone] = useState(true);
  const [notifySaving, setNotifySaving] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let alive = true;
    void supabase
      .from('profiles')
      .select('full_name, email_notifications, notify_audit_completed, notify_optimization, notify_marketing')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          setLoadError(error.message);
        } else {
          setRow(data);
          setFullName(data?.full_name ?? '');
          // null в базе = значение по умолчанию колонки (включено), как в ClientNotificationsTab.
          setAuditDone(data?.notify_audit_completed ?? true);
        }
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const saveName = async () => {
    setNameSaving(true);
    setNameMsg(null);
    try {
      const { error } = await updateProfile({ full_name: fullName.trim() || null });
      if (error) throw error;
      await refreshUser();
      const saved = fullName.trim();
      setRow((r) => ({ ...(r ?? EMPTY_ROW), full_name: saved || null }));
      setNameMsg({ ok: true, text: 'Имя сохранено.' });
    } catch (err) {
      setNameMsg({ ok: false, text: `Не удалось сохранить имя: ${err instanceof Error ? err.message : 'попробуйте ещё раз'}` });
    } finally {
      setNameSaving(false);
    }
  };

  // Пишем только notify_audit_completed: остальные флаги ни на что не влияют, и перезаписывать
  // их значениями формы (которые могли не прочитаться) значило бы испортить сохранённое.
  const saveNotify = async () => {
    if (!userId) return;
    setNotifySaving(true);
    setNotifyMsg(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ notify_audit_completed: auditDone })
        .eq('id', userId)
        .select('id');
      if (error) throw error;
      // Без строки профиля update ничего не меняет и ошибки не возвращает.
      if (!data || data.length === 0) throw new Error('профиль не найден');
      setRow((r) => ({ ...(r ?? EMPTY_ROW), notify_audit_completed: auditDone }));
      setNotifyMsg({ ok: true, text: 'Настройки уведомлений сохранены.' });
    } catch (err) {
      setNotifyMsg({ ok: false, text: `Не удалось сохранить: ${err instanceof Error ? err.message : 'попробуйте ещё раз'}` });
    } finally {
      setNotifySaving(false);
    }
  };

  const blocked = loading || !!loadError || !userId;

  return (
    <>
      <SettingsSection title="Профиль">
        {loading && <Loading />}
        {loadError && <ErrorNote>Не удалось загрузить профиль: {loadError}</ErrorNote>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--space-6)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="pf-name">Имя</label>
            <input
              id="pf-name"
              className="input"
              type="text"
              maxLength={120}
              placeholder="Как к вам обращаться"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={blocked}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="pf-mail">Почта</label>
            <input id="pf-mail" className="input" type="email" value={email} readOnly />
            <div style={{ fontSize: 12, color: MUTED, marginTop: 5 }}>Адрес входа. Сменить его здесь нельзя.</div>
          </div>
        </div>
        {nameMsg && (nameMsg.ok ? <AccentNote>{nameMsg.text}</AccentNote> : <FormError>{nameMsg.text}</FormError>)}
        <button
          type="button"
          className="btn btn-secondary"
          style={{ justifySelf: 'start' }}
          onClick={() => void saveName()}
          disabled={blocked || nameSaving || fullName.trim() === (row?.full_name ?? '')}
        >
          {nameSaving ? 'Сохраняем…' : 'Сохранить имя'}
        </button>
      </SettingsSection>

      <SettingsSection title="Уведомления">
        <p style={{ fontSize: 13.5, color: MUTED, margin: 0, maxWidth: '64ch' }}>
          Уведомления появляются в разделе «Уведомления» кабинета. Писем на почту по ним сервис пока не отправляет.
        </p>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <label className="radio">
            <input type="checkbox" checked={auditDone} onChange={(e) => setAuditDone(e.target.checked)} disabled={blocked} />
            <span className="dot" />
            Завершение аудита — запись в разделе «Уведомления»
          </label>
        </div>
        {/* Флаги есть в profiles, но событий под них нет: create-notification вызывает только
            scoring-processor (завершение аудита), писем функция не шлёт (email_sent = false),
            рассылок нет. Показываем сохранённое значение без правки. */}
        <div style={{ display: 'grid', gap: 'var(--space-2)', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)' }}>
          <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 2 }}>Пока недоступно</div>
          {[
            { label: 'Письма на почту по уведомлениям', value: row?.email_notifications ?? true },
            { label: 'Окончание оптимизации', value: row?.notify_optimization ?? true },
            { label: 'Новости и предложения', value: row?.notify_marketing ?? false },
          ].map((o) => (
            <label key={o.label} className="radio" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              <input type="checkbox" checked={o.value} disabled readOnly />
              <span className="dot" />
              {o.label} — не отправляется
            </label>
          ))}
        </div>
        {notifyMsg && (notifyMsg.ok ? <AccentNote>{notifyMsg.text}</AccentNote> : <FormError>{notifyMsg.text}</FormError>)}
        <button
          type="button"
          className="btn btn-secondary"
          style={{ justifySelf: 'start' }}
          onClick={() => void saveNotify()}
          disabled={blocked || notifySaving || auditDone === (row?.notify_audit_completed ?? true)}
        >
          {notifySaving ? 'Сохраняем…' : 'Сохранить уведомления'}
        </button>
      </SettingsSection>
    </>
  );
};
