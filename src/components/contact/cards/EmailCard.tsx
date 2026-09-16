
import React from 'react';
import { Mail } from 'lucide-react';
import ContactCard from './ContactCard';
import { SITE_CONTACTS } from '@/config/site-contacts';

/**
 * Здесь была придуманная почта info@seomarket.ru — письма на неё не доходили
 * никому. Адрес берётся из SITE_CONTACTS; пока он пуст, карточки нет.
 */
const EmailCard = () => {
  const { email } = SITE_CONTACTS;
  if (!email) return null;

  return (
    <ContactCard
      icon={Mail}
      title="Email"
      subtitle="Мы отвечаем в течение 24 часов"
    >
      <a href={`mailto:${email}`} className="font-medium hover:text-primary transition-colors">
        {email}
      </a>
    </ContactCard>
  );
};

export default EmailCard;
