
import React from 'react';
import PhoneCard from './cards/PhoneCard';
import EmailCard from './cards/EmailCard';
import AddressCard from './cards/AddressCard';
import MapCard from './cards/MapCard';
import { hasPostalAddress } from '@/config/site-contacts';

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <PhoneCard />
      <EmailCard />
      <AddressCard />
      {/* Карта проезда имеет смысл только тогда, когда есть куда ехать. */}
      {hasPostalAddress() && <MapCard />}
    </div>
  );
};

export default ContactInfo;
