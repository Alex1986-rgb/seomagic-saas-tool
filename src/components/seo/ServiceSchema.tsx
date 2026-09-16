import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_CONTACTS } from '@/config/site-contacts';
import { absolutePageUrl } from '@/lib/asset-url';

/**
 * В разметке услуг пятью строками был прописан телефон +7 800 123-45-67,
 * которого не существует: поисковики показывали его рядом с каждой услугой.
 * Номер берётся из SITE_CONTACTS, и пока его нет, поле servicePhone в разметку
 * просто не попадает.
 *
 * Цены здесь тоже были свои: аудит за 15 000 ₽, «Стартовый план, до 100
 * запросов» за 5 000 ₽, анализ конкурентов, техоптимизация и контент за
 * 20 000 / 25 000 / 18 000 ₽. На страницах тарифов суммы другие, и разметка,
 * не подтверждённая содержимым страницы, считается недостоверной. Блок offers
 * убран: цены показывают страницы тарифов. Услуги оставлены те, что сервис
 * действительно выполняет и что показаны на главной: аудит, ИИ-оптимизация
 * текстов и отслеживание позиций.
 */
export const ServiceSchema: React.FC = () => {
  const servicePhone = SITE_CONTACTS.telephone ? { servicePhone: SITE_CONTACTS.telephone } : {};
  const organizationId = absolutePageUrl('/#organization');

  const services = [
    {
      '@type': 'Service',
      '@id': absolutePageUrl('/features/seo-audit#service'),
      serviceType: 'SEO Аудит',
      name: 'SEO-аудит сайта',
      description: 'Проверка сайта на технические и контентные ошибки: мета-теги, заголовки, скорость загрузки страниц. Итог — список найденных проблем и рекомендации по правкам.',
      provider: {
        '@id': organizationId
      },
      areaServed: 'RU',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: absolutePageUrl('/features/seo-audit'),
        ...servicePhone,
        availableLanguage: 'Russian'
      },
      category: 'SEO Services'
    },
    {
      '@type': 'Service',
      '@id': absolutePageUrl('/features/ai-optimization#service'),
      serviceType: 'Оптимизация контента',
      name: 'ИИ-оптимизация текстов страниц',
      description: 'Новые варианты заголовков, мета-описаний и текстов страниц по результатам аудита: их пишет нейросеть.',
      provider: {
        '@id': organizationId
      },
      areaServed: 'RU',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: absolutePageUrl('/features/ai-optimization'),
        ...servicePhone,
        availableLanguage: 'Russian'
      },
      category: 'SEO Services'
    },
    {
      '@type': 'Service',
      '@id': absolutePageUrl('/position-tracking#service'),
      serviceType: 'Мониторинг позиций',
      name: 'Отслеживание позиций в поисковых системах',
      description: 'Проверка мест сайта в выдаче Яндекса и Google по списку запросов.',
      provider: {
        '@id': organizationId
      },
      areaServed: 'RU',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: absolutePageUrl('/position-tracking'),
        ...servicePhone,
        availableLanguage: 'Russian'
      },
      category: 'SEO Services'
    }
  ];

  const serviceListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: service
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceListSchema)}
      </script>
    </Helmet>
  );
};
