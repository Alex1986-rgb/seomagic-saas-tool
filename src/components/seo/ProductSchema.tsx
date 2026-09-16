import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absolutePageUrl } from '@/lib/asset-url';

/**
 * Разметка тарифов как товаров.
 *
 * По умолчанию здесь были вписаны три тарифа «Базовый / Профессиональный /
 * Корпоративный» за 2 990 / 9 990 / 29 990 ₽, которых на странице цен нет,
 * общая оценка 5,0 по 127 отзывам, два придуманных отзыва, возврат в течение
 * 14 дней и срок действия цены до 31.12.2025, давно прошедший. Поисковики
 * показывали по этой разметке звёзды и цены, не совпадающие со страницей, —
 * прямой повод для ручных санкций.
 *
 * Теперь разметка выводится только по переданным тарифам, без отзывов,
 * рейтинга, политики возврата и срока цены. Передавать сюда нужно ровно те
 * названия и цены, что показаны на странице.
 */

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

export const ProductSchema: React.FC<ProductSchemaProps> = ({ products = [] }) => {
  if (products.length === 0) return null;

  const pricingUrl = absolutePageUrl('/pricing');

  const productSchemas = products.map((product, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${pricingUrl}#product-${index + 1}`,
    name: product.name,
    description: product.description,
    // Картинок тарифов (/images/product-*.jpg) в проекте нет — поле убрано.
    brand: {
      '@type': 'Brand',
      name: 'SeoMarket'
    },
    offers: {
      '@type': 'Offer',
      url: pricingUrl,
      priceCurrency: product.priceCurrency || 'RUB',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'SeoMarket',
        url: absolutePageUrl('/')
      }
    },
    ...(product.sku ? { sku: product.sku } : {}),
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
