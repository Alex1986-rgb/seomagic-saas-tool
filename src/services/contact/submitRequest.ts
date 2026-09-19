import { supabase } from '@/integrations/supabase/client';
import { SITE_CONTACTS } from '@/config/site-contacts';

/**
 * Отправка заявки с сайта.
 *
 * Форма обратной связи раньше писала сообщение в консоль браузера и отвечала
 * «Сообщение отправлено» — до нас не доходило ничего. Теперь заявка ложится в
 * таблицу `contact_requests`, а при сбое пользователь получает честный ответ и
 * адрес почты, а не обещание, которое никто не выполнит.
 */

export interface ContactRequest {
  kind?: 'contact' | 'invoice';
  name?: string;
  email: string;
  subject?: string;
  message?: string;
  siteUrl?: string;
  amount?: number;
  taskId?: string | null;
}

/**
 * Адрес поддержки — тот же единый источник правды, что и на страницах контактов.
 * Здесь был жёстко вписан support@seomarket.app; пока настоящий адрес не задан
 * в SITE_CONTACTS, мы просто не называем никакого — лучше молчать, чем звать
 * писать в несуществующий ящик.
 */
export const SUPPORT_EMAIL = SITE_CONTACTS.email;

/** Приписка «напишите нам на …» — пустая, если писать пока некуда. */
export const supportEmailHint = (): string =>
  SUPPORT_EMAIL ? ` Напишите нам на ${SUPPORT_EMAIL}.` : '';

export async function submitContactRequest(request: ContactRequest): Promise<void> {
  const { data: session } = await supabase.auth.getUser();

  const { error } = await supabase.from('contact_requests').insert({
    kind: request.kind ?? 'contact',
    name: request.name ?? null,
    email: request.email,
    subject: request.subject ?? null,
    message: request.message ?? null,
    site_url: request.siteUrl ?? null,
    amount: request.amount ?? null,
    task_id: request.taskId ?? null,
    user_id: session?.user?.id ?? null,
  });

  if (error) {
    throw new Error(
      `Не удалось отправить заявку: ${error.message}.${supportEmailHint()}`,
    );
  }
}
