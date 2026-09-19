import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, MUTED, NotConnected } from '../ui';
import { AccentNote, FormError, OffTag, Row } from './parts';
import { MIN_PASSWORD_LENGTH } from './helpers';
import { SettingsSection } from './SettingsSection';

/**
 * Безопасность (макет: двухфакторный вход, ключ API, активные сессии).
 *
 * Настоящее:
 * - смена пароля — supabase.auth.updateUser, как в существующей ClientPasswordTab;
 * - «Завершить остальные сессии» — supabase.auth.signOut({ scope: 'others' }): отзывает все
 *   токены обновления, кроме текущего. Это работает без списка сессий.
 *
 * Не подключено и почему:
 * - 2FA. Supabase MFA (TOTP) технически можно включить из браузера, но защитой это станет
 *   только когда вход требует второй уровень (aal2): ProtectedRoute и политики RLS уровень не
 *   проверяют, и с одним паролем пускали бы как раньше. Показать «Включён» при таком входе —
 *   ложное чувство защиты, поэтому 2FA не включаем до доработки входа.
 * - Ключ API — публичного API и таблицы ключей нет.
 * - Список активных сессий — клиентский SDK Supabase список устройств не отдаёт.
 */
export const SecuritySection: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwDone, setPwDone] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [outResult, setOutResult] = useState<'ok' | 'error' | null>(null);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwDone(false);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setPwError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`);
      return;
    }
    if (password !== confirm) {
      setPwError('Пароли не совпадают.');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        const msg = error.message.toLowerCase();
        setPwError(
          msg.includes('different from the old')
            ? 'Новый пароль совпадает со старым.'
            : msg.includes('reauthentication')
              ? 'Для смены пароля нужно войти заново: выйдите и войдите, затем повторите.'
              : `Не удалось сменить пароль: ${error.message}`,
        );
        return;
      }
      setPassword('');
      setConfirm('');
      setPwDone(true);
    } catch {
      setPwError('Нет связи с сервером. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  };

  const signOutOthers = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      setOutResult(error ? 'error' : 'ok');
    } catch {
      setOutResult('error');
    } finally {
      setSigningOut(false);
      setConfirmOpen(false);
    }
  };

  return (
    <SettingsSection title="Безопасность">
      <form onSubmit={changePassword} noValidate style={{ display: 'grid', gap: 'var(--space-3)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-divider)' }}>
        <span>
          <span style={{ display: 'block', fontSize: 14 }}>Пароль</span>
          <span style={{ fontSize: 12, color: MUTED }}>Новый пароль для входа, не короче {MIN_PASSWORD_LENGTH} символов</span>
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--space-4)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="sec-pw1">Новый пароль</label>
            <input id="sec-pw1" className="input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="sec-pw2">Повторите пароль</label>
            <input id="sec-pw2" className="input" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>
        {pwError && <FormError>{pwError}</FormError>}
        {pwDone && <AccentNote>Пароль изменён. В следующий раз входите с новым паролем.</AccentNote>}
        <button type="submit" className="btn btn-secondary" style={{ justifySelf: 'start' }} disabled={saving || !password || !confirm}>
          {saving ? 'Сохраняем…' : 'Сменить пароль'}
        </button>
      </form>

      <Row title="Двухфакторный вход" sub="Код из приложения при входе с нового устройства" right={<OffTag />} />
      <Row title="Ключ API" sub="Доступ к данным кабинета из своих систем" right={<OffTag />} />

      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED }}>Активные сессии</div>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
          Список устройств не показываем — его нет в данных, доступных кабинету. Завершить входы на всех устройствах, кроме этого,
          можно кнопкой ниже.
        </p>
        {outResult === 'ok' && <AccentNote>Остальные сессии завершены. На других устройствах потребуется войти заново.</AccentNote>}
        {outResult === 'error' && <FormError>Не удалось завершить остальные сессии. Попробуйте ещё раз.</FormError>}
      </div>
      <button type="button" className="btn btn-secondary" style={{ justifySelf: 'start' }} onClick={() => setConfirmOpen(true)}>
        Завершить остальные сессии
      </button>

      <NotConnected
        title="Второй фактор, ключи API и список сессий"
        needs={[
          '2FA: проверка уровня входа (aal2) в защищённых маршрутах и политиках базы — без неё код из приложения не защищает',
          'ключ API: публичное API кабинета и таблица ключей с отзывом',
          'список сессий: серверная функция, читающая сессии пользователя',
        ]}
      />

      <Dialog
        open={confirmOpen}
        title="Завершить остальные сессии?"
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmOpen(false)} disabled={signingOut}>
              Отмена
            </button>
            <button type="button" className="btn btn-primary" onClick={() => void signOutOthers()} disabled={signingOut}>
              {signingOut ? 'Завершаем…' : 'Завершить'}
            </button>
          </>
        }
      >
        На всех устройствах, кроме этого, кабинет попросит войти заново. Текущая сессия останется.
      </Dialog>
    </SettingsSection>
  );
};
