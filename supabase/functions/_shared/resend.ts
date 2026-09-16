/**
 * Отправка писем через Resend.
 *
 * Отправитель был зашит как `onboarding@resend.dev`. Это тестовый адрес
 * Resend: с него письма доходят только до владельца аккаунта Resend, всем
 * остальным API отвечает отказом, и функция возвращала 500. Отправитель
 * должен быть на своём домене, подтверждённом в Resend, — его задаёт владелец
 * в секрете RESEND_FROM (например, «SeoMarket <mail@ваш-домен>»).
 */

export class EmailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailConfigError';
  }
}

/** Отправитель из секрета RESEND_FROM или понятная ошибка настройки. */
export function resendSender(): string {
  const from = (Deno.env.get('RESEND_FROM') ?? '').trim();
  if (!from) {
    throw new EmailConfigError(
      'Отправка писем не настроена: задайте секрет RESEND_FROM — адрес на домене, подтверждённом в Resend',
    );
  }
  return from;
}

/** Ключ Resend или понятная ошибка настройки. */
export function resendApiKey(): string {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) {
    throw new EmailConfigError('Отправка писем не настроена: не задан секрет RESEND_API_KEY');
  }
  return key;
}

/**
 * Понятный текст вместо сырого ответа Resend. Отказ из-за неподтверждённого
 * домена или тестового отправителя — ошибка настройки, а не сбой сервиса.
 */
export function describeResendError(status: number, body: string): string {
  const text = body.toLowerCase();
  if (
    text.includes('domain is not verified') ||
    text.includes('verify a domain') ||
    text.includes('testing emails to your own email')
  ) {
    return 'Письмо не отправлено: домен отправителя (RESEND_FROM) не подтверждён в Resend';
  }
  if (status === 401 || status === 403) {
    return `Письмо не отправлено: Resend отказал в доступе (${status}). Проверьте RESEND_API_KEY и домен отправителя`;
  }
  if (status === 429) {
    return 'Письмо не отправлено: превышен лимит отправки Resend, попробуйте позже';
  }
  return `Письмо не отправлено: Resend ответил ${status}`;
}
