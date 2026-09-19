import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, LayoutDashboard, Mail, MessageSquare, Phone, type LucideIcon } from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';
import { SITE_CONTACTS, SITE_LEGAL, hasLegalDetails } from '@/config/site-contacts';
import { ContactForm } from '@/site/docs/ContactForm';
import { DocsLayout } from '@/site/docs/DocsLayout';
import { Blueprint, DocTitle, H2, Kicker, Lead, SOFTER, TableBox } from '@/site/docs/parts';
import { MUTED } from '@/site/SiteLayout';

/**
 * «Контакты и реквизиты» (макет, строки 90–134).
 *
 * Всё — только из src/config/site-contacts.ts. В макете были hello@seomarket.ru, +7 495 123-45-67,
 * ИНН 7712345678, счёт из нулей и «[ФИО]» — не переносим: выдуманная организация на странице
 * контактов вредит и клиенту, и проверке сайта поисковиком. Часы работы «10:00–19:00» тоже
 * не подтверждены — не пишем. Пустое поле не показывается; нет реквизитов — честный блок вместо таблицы.
 */

const ContactCard: React.FC<{ icon: LucideIcon; label: string; children: React.ReactNode; note: string }> = ({
  icon: Icon,
  label,
  children,
  note,
}) => (
  <Blueprint style={{ padding: 'var(--space-6)' }}>
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontSize: 11,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: MUTED,
        marginBottom: 8,
      }}
    >
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', color: 'var(--color-accent)' }} />
      {label}
    </span>
    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, overflowWrap: 'anywhere' }}>{children}</div>
    <p style={{ fontSize: 13, lineHeight: 1.5, margin: '10px 0 0', color: SOFTER }}>{note}</p>
  </Blueprint>
);

/** Строки реквизитов: подпись, значение, моноширинный ли шрифт. Пустые значения отбрасываются. */
const legalRows = (): [string, string, boolean][] =>
  (
    [
      ['Полное наименование', SITE_LEGAL.legalName, false],
      ['ИНН', SITE_LEGAL.inn, true],
      ['ОГРН', SITE_LEGAL.ogrn, true],
      ['ОГРНИП', SITE_LEGAL.ogrnip, true],
      ['Юридический адрес', SITE_LEGAL.legalAddress, false],
      ['Банк', SITE_LEGAL.bankName, false],
      ['БИК', SITE_LEGAL.bik, true],
      ['Расчётный счёт', SITE_LEGAL.account, true],
      ['Корреспондентский счёт', SITE_LEGAL.corrAccount, true],
    ] as [string, string, boolean][]
  ).filter(([, value]) => value.trim() !== '');

const Contacts: React.FC = () => {
  const c = SITE_CONTACTS;
  const legal = hasLegalDetails();

  return (
    <DocsLayout current="contacts">
      <PageSeo
        title="Контакты и реквизиты"
        description="Как связаться с SeoMarket: заявка через форму на сайте, личный кабинет. Реквизиты публикуются после регистрации юрлица — до этого договор не заключается и оплата не принимается."
      />
      <Kicker>Контакты</Kicker>
      <DocTitle>Контакты и реквизиты</DocTitle>
      <Lead>
        {legal
          ? 'Полные реквизиты — требование поисковиков к коммерческому сайту и признак добросовестного подрядчика. Реквизиты на этой странице совпадают с данными в договоре и счёте.'
          : 'Сервис работает до регистрации юрлица, поэтому реквизитов на странице пока нет. Написать нам можно через форму заявки ниже — ответим на почту, которую вы укажете.'}
      </Lead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 'var(--space-6)', marginBottom: 32 }}>
        {c.email && (
          <ContactCard icon={Mail} label="Почта" note="Ответ придёт с этого же адреса.">
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </ContactCard>
        )}
        {c.telephone && (
          <ContactCard icon={Phone} label="Телефон" note="Звонки по заказам и сметам.">
            <a href={`tel:${c.telephone.replace(/[^\d+]/g, '')}`}>{c.telephone}</a>
          </ContactCard>
        )}
        <ContactCard icon={MessageSquare} label="Заявка" note="Сохраняется в базе сервиса, её разбирает администратор.">
          <a href="#zayavka">Оставить заявку</a>
        </ContactCard>
        <ContactCard icon={LayoutDashboard} label="Личный кабинет" note="Аудит, смета и заявка на счёт по согласованной смете.">
          <Link to="/app">Открыть кабинет</Link>
        </ContactCard>
      </div>

      <H2 size={26} gap={16}>Реквизиты</H2>
      {legal ? (
        <TableBox minWidth={560} mb={32} label="Реквизиты">
          <tbody>
            {legalRows().map(([label, value, mono]) => (
              <tr key={label}>
                <td style={{ paddingLeft: 24, width: '34%', fontSize: 14, color: SOFTER }}>{label}</td>
                <td style={{ fontSize: 15, fontFamily: mono ? 'var(--font-mono)' : undefined, overflowWrap: 'anywhere' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </TableBox>
      ) : (
        <Blueprint style={{ padding: 'clamp(20px,2.6vw,32px)', maxWidth: '78ch', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
            <Building2 size={20} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 2, color: 'var(--color-accent)' }} />
            <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>
              Реквизиты публикуются после регистрации юрлица; до этого договор не заключается, оплата не принимается.
              Аудит и смета в кабинете доступны бесплатно, а заявку на счёт можно оставить заранее — счёт выставим, когда
              появятся реквизиты.
            </p>
          </div>
        </Blueprint>
      )}

      <div id="zayavka" style={{ scrollMarginTop: 88 }}>
        <H2 size={26} gap={16}>Оставить заявку</H2>
        <p style={{ fontSize: 15, lineHeight: 1.65, maxWidth: '74ch', margin: '0 0 20px' }}>
          Опишите задачу или вопрос. Чтобы увидеть ошибки сайта, не дожидаясь ответа, запустите{' '}
          <Link to="/app/audit">бесплатный аудит</Link> — отчёт будет готов без нашего участия.
        </p>
        <ContactForm />
      </div>
    </DocsLayout>
  );
};

export default Contacts;
