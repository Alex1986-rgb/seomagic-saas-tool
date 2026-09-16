import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, CircleCheck, Send } from 'lucide-react';
import { submitContactRequest } from '@/services/contact/submitRequest';
import { MUTED } from '@/site/SiteLayout';
import { Blueprint } from './parts';
import { validateContact, type ContactErrors as Errors, type ContactField as Field } from './contact-validate';

/**
 * Форма заявки на /contact (якорь #zayavka).
 *
 * Пишет в contact_requests через общий submitContactRequest — тот же путь, что заявка на счёт из
 * кабинета, поэтому администратор видит обе в одном списке. Вставка идёт без .select(): читать
 * заявки аноним не вправе (RLS), и insert(...).select() падал бы с 42501 после успешной записи.
 *
 * Письмо не отправляется ни клиенту, ни нам — и форма так и говорит, а не обещает «ответ
 * в течение часа». Скрытое поле-ловушку не ставим: автозаполнение браузеров (Яндекс.Браузер)
 * заполняет его и молча отбрасывает настоящие заявки.
 */

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [site, setSite] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (sending) return;
    const found = validateContact({ name, email, site, message, consent });
    setErrors(found);
    setFailure(null);
    if (Object.keys(found).length > 0) {
      // Фокус на первое поле с ошибкой: иначе на телефоне ошибка остаётся за экраном.
      const first = (['email', 'site', 'message', 'consent'] as Field[]).find((f) => found[f]);
      if (first) document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    setSending(true);
    try {
      await submitContactRequest({
        kind: 'contact',
        name: name.trim() || undefined,
        email: email.trim(),
        siteUrl: site.trim() || undefined,
        subject: 'Заявка со страницы «Контакты»',
        message: message.trim() || undefined,
      });
      setSentTo(email.trim());
      setName('');
      setSite('');
      setMessage('');
      setConsent(false);
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Не удалось отправить заявку. Попробуйте ещё раз.');
    } finally {
      setSending(false);
    }
  };

  if (sentTo) {
    return (
      <Blueprint style={{ padding: 'var(--space-6)', maxWidth: '78ch' }}>
        <div role="status" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
          <CircleCheck size={20} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 2, color: 'var(--color-accent)' }} />
          <div style={{ display: 'grid', gap: 10 }}>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
              Заявка сохранена. Мы ответим на <strong>{sentTo}</strong>. Автоматического письма-подтверждения нет — не
              ищите его во входящих.
            </p>
            <button type="button" className="btn btn-secondary" style={{ justifySelf: 'start' }} onClick={() => setSentTo(null)}>
              Отправить ещё одну
            </button>
          </div>
        </div>
      </Blueprint>
    );
  }

  const err = (f: Field) =>
    errors[f] ? (
      <span data-fielderror id={`cf-${f}-err`}>
        {errors[f]}
      </span>
    ) : null;
  const aria = (f: Field) => ({
    'aria-invalid': errors[f] ? ('true' as const) : undefined,
    'aria-describedby': errors[f] ? `cf-${f}-err` : undefined,
  });

  return (
    <Blueprint style={{ padding: 'clamp(20px,2.6vw,32px)', maxWidth: '78ch' }}>
      <form data-form onSubmit={submit} noValidate style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div data-two style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="cf-name">Имя</label>
            <input id="cf-name" className="input" type="text" autoComplete="name" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} style={{ minHeight: 42 }} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="cf-email">Почта *</label>
            <input
              id="cf-email"
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ minHeight: 42 }}
              {...aria('email')}
            />
            {err('email')}
          </div>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label htmlFor="cf-site">Сайт</label>
          <input
            id="cf-site"
            className="input"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="example.ru"
            maxLength={300}
            value={site}
            onChange={(e) => setSite(e.target.value)}
            style={{ minHeight: 42 }}
            {...aria('site')}
          />
          {err('site')}
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label htmlFor="cf-message">Сообщение</label>
          <textarea
            id="cf-message"
            className="input"
            rows={5}
            maxLength={4000}
            placeholder="Что нужно сделать или что непонятно. Пароли и доступы сюда не пишите."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            {...aria('message')}
          />
          {err('message')}
        </div>
        <div>
          <label htmlFor="cf-consent" style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.5, cursor: 'pointer' }}>
            <input id="cf-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} {...aria('consent')} />
            <span>
              Согласен на обработку персональных данных по{' '}
              <Link to="/privacy" style={{ textDecoration: 'underline' }}>
                политике конфиденциальности
              </Link>
            </span>
          </label>
          {err('consent')}
        </div>

        {failure && (
          <div role="alert" style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5, color: 'var(--color-critical-ink)' }}>
            <CircleAlert size={18} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />
            <span>{failure}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
          <button type="submit" className="btn btn-primary" disabled={sending} style={{ minHeight: 42 }}>
            <Send size={16} strokeWidth={1.5} aria-hidden="true" />
            {sending ? 'Отправляем…' : 'Отправить заявку'}
          </button>
          <span style={{ fontSize: 12.5, color: MUTED }}>* — обязательное поле. Нужен сайт или сообщение.</span>
        </div>
      </form>
    </Blueprint>
  );
};

export default ContactForm;
