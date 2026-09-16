import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absoluteAssetUrl, absolutePageUrl } from '@/lib/asset-url';

interface EventSchemaProps {
  events?: Array<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location?: {
      type: 'VirtualLocation' | 'Place';
      name?: string;
      address?: string;
      url?: string;
    };
    image?: string;
    price?: string;
    priceCurrency?: string;
    availability?: string;
    performer?: string;
  }>;
}

export const EventSchema: React.FC<EventSchemaProps> = ({ events = [] }) => {
  // Здесь были описаны четыре мероприятия, которых никогда не было: вебинар
  // 15 февраля 2025 года, мастер-класс 22 февраля, конференция «SEO Market
  // Summit 2025» в офисе на «ул. Примерной» и ещё одно. Поисковые системы
  // показывали их как предстоящие события, люди могли собраться. Без настоящих
  // мероприятий разметки нет.
  if (events.length === 0) return null;

  const siteUrl = absolutePageUrl('/');
  
  const eventSchemas = events.map((event, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': absolutePageUrl(`/#event-${index + 1}`),
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.location?.type === 'VirtualLocation' 
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.location?.type === 'VirtualLocation' ? {
      '@type': 'VirtualLocation',
      url: event.location.url
    } : {
      '@type': 'Place',
      name: event.location?.name,
      address: {
        '@type': 'PostalAddress',
        // Город «Москва» подставлялся к любому очному мероприятию — убран:
        // адрес берётся только из переданных данных.
        streetAddress: event.location?.address,
        addressCountry: 'RU'
      }
    },
    image: event.image ? [absoluteAssetUrl(event.image)] : undefined,
    organizer: {
      '@type': 'Organization',
      name: 'SeoMarket',
      url: siteUrl
    },
    performer: event.performer ? {
      '@type': 'Person',
      name: event.performer
    } : undefined,
    offers: {
      '@type': 'Offer',
      url: absolutePageUrl('/events'),
      price: event.price,
      priceCurrency: event.priceCurrency || 'RUB',
      availability: event.availability || 'https://schema.org/InStock',
      validFrom: new Date().toISOString()
    }
  }));

  return (
    <Helmet>
      {eventSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
