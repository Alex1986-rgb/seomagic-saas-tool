
import React from 'react';
import { MapPin } from 'lucide-react';
import ContactCard from './ContactCard';
import { SITE_CONTACTS, hasPostalAddress } from '@/config/site-contacts';

/**
 * Здесь был описан офис, которого нет: «Москва, ул. Примерная, д. 123,
 * БЦ "Технополис", офис 456». Адрес берётся из SITE_CONTACTS, и пока он не
 * заполнен, карточка не выводится — приезжать всё равно некуда.
 */
const AddressCard = () => {
  if (!hasPostalAddress()) return null;

  const { streetAddress, addressLocality } = SITE_CONTACTS;

  return (
    <ContactCard
      icon={MapPin}
      title="Адрес"
      subtitle="Офис"
    >
      <address className="not-italic">
        {addressLocality}, {streetAddress}
      </address>
    </ContactCard>
  );
};

export default AddressCard;
