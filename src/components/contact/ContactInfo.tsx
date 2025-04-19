
import React from 'react';
import PhoneCard from './cards/PhoneCard';
import EmailCard from './cards/EmailCard';
import AddressCard from './cards/AddressCard';
import MapCard from './cards/MapCard';

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <PhoneCard />
      <EmailCard />
      <AddressCard />
      <MapCard />
    </div>
  );
};

export default ContactInfo;
