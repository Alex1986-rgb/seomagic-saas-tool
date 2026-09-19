/**
 * Проверка формы заявки до отправки. Отдельным модулем — чтобы покрыть тестом без отрисовки формы.
 */

export type ContactField = 'name' | 'email' | 'site' | 'message' | 'consent';
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Адрес сайта: домен с точкой, без пробелов; протокол необязателен. */
const SITE_RE = /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i;

export function validateContact(v: { name: string; email: string; site: string; message: string; consent: boolean }): ContactErrors {
  const e: ContactErrors = {};
  if (!v.email.trim()) e.email = 'Укажите почту — ответ придёт на неё.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Похоже, в адресе почты опечатка.';
  if (v.site.trim() && !SITE_RE.test(v.site.trim())) e.site = 'Укажите адрес сайта, например example.ru.';
  // Пустая заявка — только почта — ничего не говорит администратору: нужен сайт или сообщение.
  if (!v.message.trim() && !v.site.trim()) e.message = 'Напишите, чем помочь, или укажите сайт.';
  if (!v.consent) e.consent = 'Без согласия на обработку данных мы не можем принять заявку.';
  return e;
}
