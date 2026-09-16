
import React from 'react';
import { Phone } from 'lucide-react';
import ContactCard from './ContactCard';
import { SITE_CONTACTS } from '@/config/site-contacts';

/**
 * Здесь стоял несуществующий номер +7 (800) 123-45-67 — люди по нему звонили
 * и попадали в никуда. Теперь номер берётся из SITE_CONTACTS, а если его нет,
 * карточка не показывается вовсе.
 */
const PhoneCard = () => {
  const { telephone } = SITE_CONTACTS;
  if (!telephone) return null;

  return (
    <ContactCard
      icon={Phone}
      title="Телефон"
      subtitle="Пн-Пт с 9:00 до 18:00 (МСК)"
    >
      <a
        href={`tel:${telephone.replace(/[^+\d]/g, '')}`}
        className="font-medium text-lg hover:text-primary transition-colors"
      >
        {telephone}
      </a>
    </ContactCard>
  );
};

export default PhoneCard;
