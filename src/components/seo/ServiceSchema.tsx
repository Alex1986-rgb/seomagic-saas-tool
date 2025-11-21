import React from 'react';
import { Helmet } from 'react-helmet-async';

export const ServiceSchema: React.FC = () => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const services = [
    {
      '@type': 'Service',
      '@id': `${siteUrl}/features#seo-audit`,
      serviceType: 'SEO Аудит',
      name: 'Комплексный SEO аудит сайта',
      description: 'Глубокий анализ технического состояния сайта, контента, структуры и выявление проблем, мешающих продвижению в поисковых системах.',
      provider: {
        '@id': `${siteUrl}/#organization`
      },
      areaServed: 'RU',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${siteUrl}/features`,
        servicePhone: '+78001234567',
        availableLanguage: 'Russian'
      },
      category: 'SEO Services',
      offers: {
        '@type': 'Offer',
        price: '15000',
        priceCurrency: 'RUB',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '15000',
          priceCurrency: 'RUB',
          name: 'Базовый тариф'
        }
      }
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl}/features#position-monitoring`,
      serviceType: 'Мониторинг позиций',
      name: 'Отслеживание позиций в поисковых системах',
      description: 'Автоматический мониторинг позиций сайта по ключевым запросам в Яндекс и Google с ежедневной проверкой и детальной аналитикой.',
      provider: {
        '@id': `${siteUrl}/#organization`
      },
      areaServed: 'RU',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${siteUrl}/position-pricing`,
        servicePhone: '+78001234567',
        availableLanguage: 'Russian'
      },
      category: 'SEO Services',
      offers: {
        '@type': 'Offer',
        price: '5000',
        priceCurrency: 'RUB',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '5000',
          priceCurrency: 'RUB',
          name: 'Стартовый план',
          description: 'До 100 запросов'
        }
      }
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl}/features#competitor-analysis`,
      serviceType: 'Анализ конкурентов',
      name: 'Конкурентный анализ в SEO',
      description: 'Подробное исследование стратегий продвижения конкурентов, анализ их сильных и слабых сторон для разработки эффективной SEO-стратегии.',
      provider: {
        '@id': `${siteUrl}/#organization`
      },
      areaServed: 'RU',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${siteUrl}/features`,
        servicePhone: '+78001234567',
        availableLanguage: 'Russian'
      },
      category: 'SEO Services',
      offers: {
        '@type': 'Offer',
        price: '20000',
        priceCurrency: 'RUB'
      }
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl}/features#technical-optimization`,
      serviceType: 'Техническая оптимизация',
      name: 'Техническая оптимизация сайта',
      description: 'Улучшение технических характеристик сайта: скорость загрузки, мобильная версия, исправление ошибок, оптимизация кода и структуры.',
      provider: {
        '@id': `${siteUrl}/#organization`
      },
      areaServed: 'RU',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${siteUrl}/features`,
        servicePhone: '+78001234567',
        availableLanguage: 'Russian'
      },
      category: 'SEO Services',
      offers: {
        '@type': 'Offer',
        price: '25000',
        priceCurrency: 'RUB'
      }
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl}/features#content-optimization`,
      serviceType: 'Контент-оптимизация',
      name: 'Оптимизация контента для SEO',
      description: 'Анализ и улучшение контента сайта: оптимизация заголовков, мета-тегов, текстов, изображений для повышения релевантности поисковым запросам.',
      provider: {
        '@id': `${siteUrl}/#organization`
      },
      areaServed: 'RU',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${siteUrl}/features`,
        servicePhone: '+78001234567',
        availableLanguage: 'Russian'
      },
      category: 'SEO Services',
      offers: {
        '@type': 'Offer',
        price: '18000',
        priceCurrency: 'RUB'
      }
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
