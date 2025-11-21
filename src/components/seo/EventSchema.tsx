import React from 'react';
import { Helmet } from 'react-helmet-async';

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

export const EventSchema: React.FC<EventSchemaProps> = ({
  events = [
    {
      name: 'Бесплатный вебинар: SEO аудит сайта за 60 минут',
      description: 'Узнайте, как провести комплексный SEO аудит вашего сайта всего за 1 час. Разберем основные ошибки, инструменты анализа и приоритизацию задач. Живые примеры и ответы на вопросы.',
      startDate: '2025-02-15T18:00:00+03:00',
      endDate: '2025-02-15T19:30:00+03:00',
      location: {
        type: 'VirtualLocation',
        url: 'https://seomarket.app/webinar/seo-audit-basics'
      },
      image: '/images/event-seo-audit-webinar.jpg',
      price: '0',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      performer: 'Алексей Иванов, ведущий SEO специалист'
    },
    {
      name: 'Мастер-класс: Продвинутые техники мониторинга позиций',
      description: 'Углубленный мастер-класс по настройке и использованию инструментов мониторинга позиций. Изучим стратегии отслеживания, анализ конкурентов и автоматизацию отчетности.',
      startDate: '2025-02-22T19:00:00+03:00',
      endDate: '2025-02-22T21:00:00+03:00',
      location: {
        type: 'VirtualLocation',
        url: 'https://seomarket.app/webinar/position-tracking-advanced'
      },
      image: '/images/event-position-tracking.jpg',
      price: '1990',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      performer: 'Марина Петрова, SEO эксперт'
    },
    {
      name: 'Конференция SEO Market Summit 2025',
      description: 'Крупнейшая конференция по SEO в России. Два дня насыщенной программы: доклады экспертов, мастер-классы, нетворкинг. Обсудим последние тренды, алгоритмы поисковых систем и успешные кейсы.',
      startDate: '2025-03-20T10:00:00+03:00',
      endDate: '2025-03-21T18:00:00+03:00',
      location: {
        type: 'Place',
        name: 'Конгресс-центр "Технополис"',
        address: 'Москва, ул. Примерная, д. 123'
      },
      image: '/images/event-seo-summit.jpg',
      price: '9990',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      performer: 'Более 20 спикеров из ведущих компаний'
    },
    {
      name: 'Интенсив: SEO стратегия для e-commerce',
      description: 'Трехдневный онлайн-интенсив по разработке SEO стратегии для интернет-магазинов. Структура каталога, оптимизация карточек товаров, работа с фильтрами и пагинацией.',
      startDate: '2025-03-10T10:00:00+03:00',
      endDate: '2025-03-12T13:00:00+03:00',
      location: {
        type: 'VirtualLocation',
        url: 'https://seomarket.app/intensive/ecommerce-seo'
      },
      image: '/images/event-ecommerce-seo.jpg',
      price: '4990',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      performer: 'Дмитрий Волков, специалист по e-commerce SEO'
    }
  ]
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const eventSchemas = events.map((event, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${siteUrl}/#event-${index + 1}`,
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
        streetAddress: event.location?.address,
        addressLocality: 'Москва',
        addressCountry: 'RU'
      }
    },
    image: event.image ? [`${siteUrl}${event.image}`] : undefined,
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
      url: `${siteUrl}/events`,
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
