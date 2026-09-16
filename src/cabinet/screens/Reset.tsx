import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Blueprint, Loading, MONO } from '../ui';
import { AuthFrame, FormError, FrameNote, Logo, SOFT } from '../account/parts';
import { MIN_PASSWORD_LENGTH, isEmail, resetRequestOutcome } from '../account/helpers';

/**
 * Восстановление пароля (макет, строки 2480–2518). Экран без оболочки, две ветви:
 *
 * 1. Запрос ссылки: supabase.auth.resetPasswordForEmail. Ответ «письмо отправлено» одинаковый
 *    для существующего и несуществующего адреса (см. resetRequestOutcome) — форма не должна
 *    отвечать на вопрос «есть ли у вас такой клиент».
 * 2. ?mode=update — человек пришёл по ссылке из письма. Supabase сам разбирает токен из адреса
 *    при старте клиента и создаёт сессию восстановления; здесь задаётся новый пароль через
 *    updateUser. Если сессии нет — ссылка устарела или уже использована.
 */

/** Куда ведёт ссылка из письма. BASE_URL — подпуть публикации (GitHub Pages), всегда с «/» на конце. */
function recoveryRedirectUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${window.location.origin}${base.endsWith('/') ? base : `${base}/`}app/reset?mode=update`;
}

type UpdateState = 'checking' | 'ready' | 'invalid' | 'done';

const Reset: React.FC = () => {
  const [params] = useSearchParams();
  const mode = params.get('mode') === 'update' ? 'update' : 'request';
  return <AuthFrame title="Восстановление пароля">{mode === 'update' ? <UpdatePassword /> : <RequestLink />}</AuthFrame>;
};

const RequestLink: React.FC = () => {
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEmail(mail)) {
      setError('Введите почту в виде name@example.ru.');
      return;
    }
    setBusy(true);
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(mail.trim(), {
        redirectTo: recoveryRedirectUrl(),
      });
      const outcome = resetRequestOutcome(authError);
      if (outcome.sent) setSent(true);
      else if ('text' in outcome) setError(outcome.text); // strict: false — без in-проверки TS не сужает объединение по sent
    } catch (err) {
      const outcome = resetRequestOutcome(err as { message?: string; name?: string });
      if (outcome.sent) setSent(true);
      else if ('text' in outcome) setError(outcome.text); // strict: false — без in-проверки TS не сужает объединение по sent
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Logo to="/app/login" />

      {sent ? (
        <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, flex: 'none', background: 'var(--color-accent)' }} />
            <h1 style={{ fontSize: 22, margin: 0 }}>Письмо отправлено</h1>
          </div>
          {/* Срок жизни ссылки задаётся в настройках Supabase Auth, в коде его нет — поэтому без «один час». */}
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: SOFT }}>
            Если адрес <span style={{ fontFamily: MONO, fontSize: 12.5, wordBreak: 'break-all' }}>{mail.trim()}</span>{' '}
            зарегистрирован, на него ушла ссылка для смены пароля. Ссылка одноразовая и действует ограниченное время.
          </p>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, margin: 0, color: 'var(--color-muted)' }}>
            Письма нет через пять минут — проверьте папку «Спам» и нет ли опечатки в адресе, затем запросите ссылку ещё раз.
          </p>
          <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate('/app/login')}>
            Вернуться к входу
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ justifySelf: 'start' }}
            onClick={() => {
              setSent(false);
              setError(null);
            }}
          >
            Отправить на другой адрес
          </button>
        </Blueprint>
      ) : (
        <Blueprint style={{ padding: 'var(--space-6)' }}>
          <form onSubmit={send} noValidate style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <h1 style={{ fontSize: 24, margin: 0 }}>Восстановление пароля</h1>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0, color: SOFT }}>
              Укажите почту, на которую зарегистрирован аккаунт. Пришлём ссылку для смены пароля.
            </p>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="rs1">Почта</label>
              <input
                id="rs1"
                className="input"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                style={{ minHeight: 42 }}
              />
            </div>
            {error && <FormError>{error}</FormError>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy || !mail.trim()}>
              {busy ? 'Отправляем…' : 'Отправить ссылку'}
            </button>
            <Link to="/app/login" style={{ fontSize: 12.5 }}>
              Вспомнил пароль — войти
            </Link>
          </form>
        </Blueprint>
      )}

      {/* В макете здесь обещание про «доступы к хостингу и SSH-ключи, зашифрованные отдельным
          ключом». Хранилища доступов в продукте нет — обещание заменено правдой о защите формы. */}
      <FrameNote>
        Мы не сообщаем, зарегистрирован ли адрес: ответ одинаковый для любой почты, чтобы чужой адрес нельзя было проверить
        перебором.
      </FrameNote>
    </>
  );
};

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<UpdateState>('checking');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [othersSignedOut, setOthersSignedOut] = useState(true);

  useEffect(() => {
    let alive = true;
    // Ошибку ссылки (просрочена, уже использована) Supabase возвращает в хэше адреса.
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const hashError = hash.get('error_code') || hash.get('error');
    if (hashError) setLinkError(hashError === 'otp_expired' ? 'Срок действия ссылки истёк.' : 'Ссылка недействительна.');

    // Токен из письма клиент разбирает при старте; getSession дожидается этого разбора.
    // Экран грузится лениво, событие PASSWORD_RECOVERY могло пройти раньше — поэтому
    // проверяем и текущую сессию, и подписываемся на событие.
    //
    // Решение по безопасности: форма откроется и у просто вошедшего человека, открывшего этот
    // адрес вручную. Это не шире существующей смены пароля в настройках — она тоже работает от
    // текущей сессии без старого пароля (ClientPasswordTab).
    void supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setState((s) => (s === 'checking' ? (data.session ? 'ready' : 'invalid') : s));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!alive) return;
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
        setState((s) => (s === 'done' ? s : 'ready'));
      }
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`);
      return;
    }
    if (password !== confirm) {
      setError('Пароли не совпадают.');
      return;
    }
    setBusy(true);
    try {
      const { error: updError } = await supabase.auth.updateUser({ password });
      if (updError) {
        const msg = updError.message.toLowerCase();
        setError(
          msg.includes('different from the old')
            ? 'Новый пароль совпадает со старым. Придумайте другой.'
            : msg.includes('weak') || msg.includes('should be')
              ? 'Пароль слишком простой. Добавьте цифры и буквы разного регистра.'
              : 'Не удалось сменить пароль. Запросите новую ссылку и попробуйте ещё раз.',
        );
        return;
      }
      // Пароль меняют, когда забыли его — или когда доступ мог утечь. Поэтому сразу завершаем
      // входы на других устройствах; текущая сессия остаётся, чтобы человек попал в кабинет.
      const { error: outError } = await supabase.auth.signOut({ scope: 'others' });
      setOthersSignedOut(!outError);
      setPassword('');
      setConfirm('');
      setState('done');
    } catch {
      setError('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Logo to="/app/login" />

      {state === 'checking' && <Loading label="Проверяем ссылку…" />}

      {state === 'invalid' && (
        <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>Ссылка не сработала</h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: SOFT }}>
            {linkError ?? 'Ссылка устарела или уже использована.'} Ссылка из письма одноразовая — запросите новую.
          </p>
          <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/app/reset')}>
            Запросить новую ссылку
          </button>
          <Link to="/app/login" style={{ fontSize: 12.5 }}>
            Вернуться к входу
          </Link>
        </Blueprint>
      )}

      {state === 'ready' && (
        <Blueprint style={{ padding: 'var(--space-6)' }}>
          <form onSubmit={save} noValidate style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <h1 style={{ fontSize: 24, margin: 0 }}>Новый пароль</h1>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0, color: SOFT }}>
              Не короче {MIN_PASSWORD_LENGTH} символов. После сохранения входы на других устройствах завершатся.
            </p>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="rs2">Новый пароль</label>
              <input
                id="rs2"
                className="input"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ minHeight: 42 }}
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="rs3">Повторите пароль</label>
              <input
                id="rs3"
                className="input"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={{ minHeight: 42 }}
              />
            </div>
            {error && <FormError>{error}</FormError>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy || !password || !confirm}>
              {busy ? 'Сохраняем…' : 'Сохранить пароль'}
            </button>
          </form>
        </Blueprint>
      )}

      {state === 'done' && (
        <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, flex: 'none', background: 'var(--color-accent)' }} />
            <h1 style={{ fontSize: 22, margin: 0 }}>Пароль изменён</h1>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: SOFT }}>
            {othersSignedOut
              ? 'Входы на других устройствах завершены. В следующий раз входите с новым паролем.'
              : 'Пароль сохранён, но завершить входы на других устройствах не получилось — сделайте это в настройках, раздел «Безопасность».'}
          </p>
          <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/app', { replace: true })}>
            Перейти в кабинет
          </button>
        </Blueprint>
      )}

      <FrameNote>
        Не запрашивали смену пароля? Закройте страницу, не сохраняя новый пароль, — старый продолжит работать.
      </FrameNote>
    </>
  );
};

export default Reset;
