/**
 * Чистые функции экрана регистрации (/app/register). Вынесены из компонента, чтобы проверяться
 * тестом без браузера и Supabase. Общий helpers.ts не трогаем — он принадлежит экрану входа.
 */
import type { AuthErrorLike } from './helpers';

/** Что вернул supabase.auth.signUp — только поля, от которых зависит экран. */
export interface SignUpDataLike {
  user?: { identities?: unknown[] | null } | null;
  session?: unknown | null;
}

export type RegisterOutcome =
  /** Подтверждение почты выключено: сессия уже есть, человека можно вести в кабинет. */
  | { kind: 'signed-in' }
  /** Нужно подтверждение — или адрес уже занят (см. ниже), ответ одинаковый. */
  | { kind: 'confirm' }
  | { kind: 'error'; text: string };

/**
 * Итог регистрации.
 *
 * Защита от перебора адресов: при включённом подтверждении почты Supabase на уже занятый адрес
 * не возвращает ошибку, а отдаёт «пустого» пользователя (identities = []) и письма не шлёт.
 * Такой случай показываем тем же экраном «проверьте почту», что и успешную регистрацию, —
 * иначе форма отвечала бы на вопрос «есть ли у вас такой клиент». Текст экрана это учитывает:
 * «если письма нет — возможно, аккаунт уже есть, войдите или восстановите пароль».
 *
 * При выключенном подтверждении Supabase сам отвечает ошибкой user_already_exists — скрыть факт
 * уже нельзя, поэтому текст мягкий и сразу подсказывает вход и восстановление.
 */
export function registerOutcome(data: SignUpDataLike | null | undefined, err: AuthErrorLike | null | undefined): RegisterOutcome {
  if (err) return { kind: 'error', text: registerErrorText(err) };
  if (data?.session) return { kind: 'signed-in' };
  return { kind: 'confirm' };
}

/** Ошибки Supabase Auth при регистрации приходят по-английски — показываем русский текст. */
export function registerErrorText(err: AuthErrorLike): string {
  const msg = (err.message ?? '').toLowerCase();
  const code = err.code ?? '';
  if (code === 'user_already_exists' || code === 'email_exists' || msg.includes('already registered')) {
    return 'Не получилось создать аккаунт с этой почтой. Если вы уже регистрировались — войдите или восстановите пароль.';
  }
  if (code === 'weak_password' || msg.includes('password should') || msg.includes('weak password')) {
    return 'Пароль слишком простой. Возьмите длиннее и добавьте цифры или знаки.';
  }
  if (code === 'email_address_invalid' || msg.includes('invalid format') || (msg.includes('email address') && msg.includes('invalid'))) {
    return 'Почта указана неверно. Проверьте адрес.';
  }
  if (code === 'signup_disabled' || msg.includes('signups not allowed')) {
    return 'Регистрация сейчас закрыта. Попробуйте позже.';
  }
  if (err.status === 429 || code.startsWith('over_') || msg.includes('rate limit') || msg.includes('security purposes')) {
    return 'Слишком много попыток. Подождите несколько минут.';
  }
  if (err.name === 'AuthRetryableFetchError' || msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.';
  }
  return 'Не удалось создать аккаунт. Попробуйте ещё раз.';
}
