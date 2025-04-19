
import React from 'react';
import { MapPin } from 'lucide-react';
import ContactCard from './ContactCard';

const AddressCard = () => {
  return (
    <ContactCard
      icon={MapPin}
      title="Адрес"
      subtitle="Центральный офис"
    >
      <address className="not-italic">
        Москва, ул. Примерная, д. 123,<br />
        БЦ "Технополис", офис 456
      </address>
    </ContactCard>
  );
};

export default AddressCard;
