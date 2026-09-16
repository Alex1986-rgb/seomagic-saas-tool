import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signUpUser } from '@/services/auth/authService';
import { Blueprint } from '../ui';
import { AuthFrame, FormError, FrameNote, Logo, SOFT } from '../account/parts';
import { MIN_PASSWORD_LENGTH, isEmail, safeRedirect } from '../account/helpers';
import { registerOutcome } from '../account/register';

/**
 * Регистрация в кабинете (/app/register). Экран без оболочки, в стиле входа (Login.tsx).
 *
 * Своего экрана регистрации в макете нет, а старая страница /auth теперь переадресует на /app/login —
 * без этого экрана новый клиент не смог бы создать аккаунт иначе как через Google.
 *
 * Запрос — signUpUser из authService (его же вызывает useAuth().register), но напрямую, по той же
 * причине, что и вход: register() контекста показывает итог тостом и ничего не возвращает, а экрану
 * нужно знать, выдана ли сессия сразу или требуется подтверждение почты, и показать ошибку под полями.
 * Тема и класс ds-industry ставятся в AuthFrame через useCabinetTheme().
 */

type Stage = 'form' | 'confirm';

const Register: React.FC = () => {
  const { user, isLoading, refreshUser, loginWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const rawTarget = safeRedirect((location.state as { from?: unknown } | null)?.from);
  // Регистрация как цель возврата крутила бы человека по кругу — как вход и сброс в safeRedirect.
  const target = /^\/(app\/)?register(\/|\?|#|$)/.test(rawTarget) ? '/app' : rawTarget;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('form');

  // Уже вошедший (или получивший сессию сразу после регистрации) уходит в кабинет по факту входа
  // в контексте — так нет гонки с ProtectedRoute, которая вернула бы его на вход.
  useEffect(() => {
    if (!isLoading && user.isLoggedIn) navigate(target, { replace: true });
  }, [isLoading, user.isLoggedIn, navigate, target]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Введите имя.');
      return;
    }
    if (!isEmail(email)) {
      setError('Введите почту в виде name@example.ru.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Пароль — не короче ${MIN_PASSWORD_LENGTH} символов.`);
      return;
    }
    if (!agree) {
      setError('Чтобы создать аккаунт, примите условия оферты и политики конфиденциальности.');
      return;
    }
    setBusy(true);
    try {
      const { data, error: authError } = await signUpUser(email.trim(), password, name.trim());
      const outcome = registerOutcome(data, authError as { message?: string; status?: number; name?: string; code?: string } | null);
      if (outcome.kind === 'error') {
        // strict: false — без in-проверки TS не сужает объединение по kind
        if ('text' in outcome) setError(outcome.text);
        return;
      }
      if (outcome.kind === 'signed-in') {
        await refreshUser();
        return;
      }
      setStage('confirm');
    } catch (err) {
      const outcome = registerOutcome(null, err as { message?: string });
      if ('text' in outcome) setError(outcome.text);
    } finally {
      setBusy(false);
    }
  };

  const google = () => {
    setError(null);
    // Согласие с офертой нужно и при входе через Google: аккаунт создаётся так же.
    if (!agree) {
      setError('Отметьте согласие с условиями оферты и политикой конфиденциальности.');
      return;
    }
    void loginWithGoogle();
  };

  if (stage === 'confirm') {
    return (
      <AuthFrame title="Регистрация">
        <Logo to="/" />
        <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>Проверьте почту</h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Отправили письмо со ссылкой на <strong style={{ wordBreak: 'break-all' }}>{email.trim()}</strong>. Откройте его и
            подтвердите адрес — после этого войдите в кабинет.
          </p>
          {/* Тот же экран видит и тот, чей адрес уже зарегистрирован (см. registerOutcome), — поэтому
              подсказка про вход и восстановление здесь обязательна: письма ему не придёт. */}
          <p style={{ fontSize: 13, lineHeight: 1.55, margin: 0, color: SOFT }}>
            Письма нет несколько минут — загляните в «Спам». Если вы уже регистрировались с этой почтой, письмо не придёт:
            войдите или восстановите пароль.
          </p>
          <Link to="/app/login" state={location.state} className="btn btn-primary btn-block">
            Перейти ко входу
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 12.5, flexWrap: 'wrap' }}>
            <Link to="/app/reset">Восстановить пароль</Link>
            <button
              type="button"
              onClick={() => setStage('form')}
              style={{ background: 'none', border: 0, padding: 0, color: 'var(--color-accent-700)', cursor: 'pointer', font: 'inherit' }}
            >
              Указать другую почту
            </button>
          </div>
        </Blueprint>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame title="Регистрация">
      <Logo to="/" />

      <Blueprint style={{ padding: 'var(--space-6)' }}>
        <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>Создать аккаунт</h1>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="rg1">Имя</label>
            <input
              id="rg1"
              className="input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ minHeight: 42 }}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="rg2">Почта</label>
            <input
              id="rg2"
              className="input"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ minHeight: 42 }}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="rg3">Пароль</label>
            <input
              id="rg3"
              className="input"
              type="password"
              autoComplete="new-password"
              aria-describedby="rg3-hint"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ minHeight: 42 }}
            />
            <span id="rg3-hint" style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              Не короче {MIN_PASSWORD_LENGTH} символов
            </span>
          </div>
          <label style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', fontSize: 13, lineHeight: 1.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 3, flex: 'none' }} />
            {/* Документы — в новой вкладке: переход в той же вкладке стёр бы заполненную форму. */}
            <span>
              Принимаю условия{' '}
              <Link to="/oferta" target="_blank" rel="noopener noreferrer">
                оферты
              </Link>{' '}
              и{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                политики конфиденциальности
              </Link>
            </span>
          </label>
          {error && <FormError>{error}</FormError>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Создаём…' : 'Создать аккаунт'}
          </button>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={google}>
            Продолжить через Google
          </button>
          <div style={{ fontSize: 12.5 }}>
            Уже есть аккаунт?{' '}
            <Link to="/app/login" state={location.state}>
              Войти
            </Link>
          </div>
        </form>
      </Blueprint>

      <FrameNote>
        Аккаунт нужен, чтобы сохранить отчёт, историю аудитов и смету. Регистрация и аудит бесплатные, карта не требуется.
      </FrameNote>
    </AuthFrame>
  );
};

export default Register;
