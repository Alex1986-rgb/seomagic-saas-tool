import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmail } from '@/services/auth/authService';
import { Blueprint } from '../ui';
import { AuthFrame, FormError, FrameNote, Logo } from '../account/parts';
import { isEmail, loginErrorText, safeRedirect } from '../account/helpers';

/**
 * Вход в кабинет (макет, строки 2562–2588). Экран без оболочки.
 *
 * Пароль проверяем через signInWithEmail из authService, а не через login() контекста:
 * login() показывает ошибку тостом и ничего не возвращает, а в макете ошибка должна стоять
 * под полями формы. Сессию после входа контекст подхватывает сам (onAuthStateChange);
 * refreshUser только ускоряет это, чтобы ProtectedRoute не увидел «не вошёл» и не отправил на /auth.
 */
const Login: React.FC = () => {
  const { user, isLoading, refreshUser, loginWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const target = safeRedirect((location.state as { from?: unknown } | null)?.from);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Переход — по факту входа в контексте, а не сразу после запроса: так уже вошедший человек,
  // открывший /app/login, тоже уходит в кабинет, а гонки с ProtectedRoute нет.
  useEffect(() => {
    if (!isLoading && user.isLoggedIn) navigate(target, { replace: true });
  }, [isLoading, user.isLoggedIn, navigate, target]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEmail(email)) {
      setError('Введите почту в виде name@example.ru.');
      return;
    }
    if (!password) {
      setError('Введите пароль.');
      return;
    }
    setBusy(true);
    try {
      const { error: authError } = await signInWithEmail(email.trim(), password);
      if (authError) {
        setError(loginErrorText(authError as { message?: string; status?: number; name?: string; code?: string }));
        return;
      }
      await refreshUser();
    } catch (err) {
      setError(loginErrorText(err as { message?: string }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame title="Вход">
      <Logo to="/" />

      <Blueprint style={{ padding: 'var(--space-6)' }}>
        <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>Вход в кабинет</h1>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="lg1">Почта</label>
            <input
              id="lg1"
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
            <label htmlFor="lg2">Пароль</label>
            <input
              id="lg2"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ minHeight: 42 }}
            />
          </div>
          {error && <FormError>{error}</FormError>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Входим…' : 'Войти'}
          </button>
          {/* Вход через Google уже работает в продукте (useAuth().loginWithGoogle) — в макете его нет,
              но убрать работающий способ входа из нового кабинета значило бы запереть таких клиентов. */}
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => void loginWithGoogle()}>
            Войти через Google
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 12.5, flexWrap: 'wrap' }}>
            <Link to="/app/reset">Забыли пароль?</Link>
            {/* Регистрация — свой экран кабинета; state передаём дальше, чтобы после неё вернуться туда же. */}
            <Link to="/app/register" state={location.state}>
              Создать аккаунт
            </Link>
          </div>
        </form>
      </Blueprint>

      <FrameNote>
        Аккаунт нужен, чтобы сохранить отчёт, историю аудитов и смету — без него результаты проверки негде держать.
        Сам аудит бесплатный, карта не требуется.
      </FrameNote>
    </AuthFrame>
  );
};

export default Login;
