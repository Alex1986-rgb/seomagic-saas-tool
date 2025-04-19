
import React from 'react';
import { Phone } from 'lucide-react';
import ContactCard from './ContactCard';

const PhoneCard = () => {
  return (
    <ContactCard
      icon={Phone}
      title="Телефон"
      subtitle="Пн-Пт с 9:00 до 18:00 (МСК)"
    >
      <a href="tel:+78001234567" className="font-medium text-lg hover:text-primary transition-colors">
        +7 (800) 123-45-67
      </a>
    </ContactCard>
  );
};

export default PhoneCard;
