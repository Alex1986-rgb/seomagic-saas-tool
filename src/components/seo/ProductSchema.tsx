import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductSchemaProps {
  products?: Array<{
    name: string;
    description: string;
    price: string;
    priceCurrency?: string;
    features: string[];
    sku?: string;
  }>;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  products = [
    {
      name: 'SeoMarket Базовый',
      description: 'Базовый тариф для малого бизнеса с основными функциями SEO аудита и мониторинга позиций',
      price: '2990',
      priceCurrency: 'RUB',
      sku: 'SEOMARKET-BASIC',
      features: [
        '5 сайтов в проекте',
        '100 ключевых слов',
        'Ежедневные проверки',
        'Базовые отчеты',
        'Email поддержка'
      ]
    },
    {
      name: 'SeoMarket Профессиональный',
      description: 'Профессиональный тариф с расширенными возможностями для SEO специалистов и агентств',
      price: '9990',
      priceCurrency: 'RUB',
      sku: 'SEOMARKET-PRO',
      features: [
        '25 сайтов в проекте',
        '1000 ключевых слов',
        'Почасовые проверки',
        'Расширенные отчеты',
        'Анализ конкурентов',
        'API доступ',
        'Приоритетная поддержка'
      ]
    },
    {
      name: 'SeoMarket Корпоративный',
      description: 'Корпоративное решение для крупных компаний с неограниченными возможностями и персональным менеджером',
      price: '29990',
      priceCurrency: 'RUB',
      sku: 'SEOMARKET-ENTERPRISE',
      features: [
        'Неограниченные сайты',
        'Неограниченные ключевые слова',
        'Мониторинг в реальном времени',
        'Персональные отчеты',
        'White Label решения',
        'Выделенный менеджер',
        'SLA гарантии'
      ]
    }
  ]
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const productSchemas = products.map((product, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteUrl}/pricing#product-${index + 1}`,
    name: product.name,
    description: product.description,
    image: `${siteUrl}/images/product-${product.sku?.toLowerCase()}.jpg`,
    brand: {
      '@type': 'Brand',
      name: 'SeoMarket'
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/pricing`,
      priceCurrency: product.priceCurrency || 'RUB',
      price: product.price,
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'SeoMarket',
        url: siteUrl
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'RU',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Алексей Морозов'
        },
        datePublished: '2024-01-15',
        reviewBody: 'Отличный сервис для SEO аудита! Детальный анализ помог выявить и исправить критические ошибки на сайте.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        }
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Марина Соколова'
        },
        datePublished: '2024-02-20',
        reviewBody: 'Инструменты мониторинга позиций работают безупречно. Очень удобный интерфейс и быстрая генерация отчётов.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        }
      }
    ],
    sku: product.sku,
    category: 'Software > SEO Tools',
    additionalProperty: product.features.map(feature => ({
      '@type': 'PropertyValue',
      name: 'Feature',
      value: feature
    }))
  }));

  return (
    <Helmet>
      {productSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
