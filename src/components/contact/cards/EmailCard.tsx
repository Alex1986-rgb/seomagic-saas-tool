
import React from 'react';
import { Mail } from 'lucide-react';
import ContactCard from './ContactCard';

const EmailCard = () => {
  return (
    <ContactCard
      icon={Mail}
      title="Email"
      subtitle="Мы отвечаем в течение 24 часов"
    >
      <a href="mailto:info@seomarket.ru" className="font-medium hover:text-primary transition-colors">
        info@seomarket.ru
      </a>
    </ContactCard>
  );
};

export default EmailCard;
