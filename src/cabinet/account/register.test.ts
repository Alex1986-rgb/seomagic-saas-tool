import { describe, expect, it } from 'vitest';
import { registerErrorText, registerOutcome } from './register';

describe('registerOutcome', () => {
  it('сессия есть — сразу в кабинет', () => {
    expect(registerOutcome({ user: { identities: [{}] }, session: {} }, null)).toEqual({ kind: 'signed-in' });
  });

  it('нужно подтверждение почты', () => {
    expect(registerOutcome({ user: { identities: [{}] }, session: null }, null)).toEqual({ kind: 'confirm' });
  });

  // Занятый адрес при включённом подтверждении: ответ неотличим от успешной регистрации.
  it('занятый адрес не раскрывается', () => {
    expect(registerOutcome({ user: { identities: [] }, session: null }, null)).toEqual({ kind: 'confirm' });
  });

  it('ошибка переводится', () => {
    const r = registerOutcome(null, { code: 'weak_password', message: 'Password should be at least 8 characters' });
    expect(r.kind).toBe('error');
  });
});

describe('registerErrorText', () => {
  it('частые ошибки Supabase по-русски', () => {
    expect(registerErrorText({ code: 'user_already_exists', message: 'User already registered' })).toMatch(/восстановите пароль/);
    expect(registerErrorText({ status: 429, message: 'email rate limit exceeded' })).toMatch(/Слишком много/);
    expect(registerErrorText({ message: 'Unable to validate email address: invalid format' })).toMatch(/Почта указана неверно/);
    expect(registerErrorText({ name: 'AuthRetryableFetchError', message: 'Failed to fetch' })).toMatch(/Нет связи/);
    expect(registerErrorText({ message: 'something else' })).toBe('Не удалось создать аккаунт. Попробуйте ещё раз.');
  });
});
