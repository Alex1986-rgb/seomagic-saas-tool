import React from 'react';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageSchemaProps {
  faqs?: FAQItem[];
}

/**
 * По умолчанию здесь было десять вопросов, которых нет ни на одной странице,
 * с обещаниями, которых сервис не даёт: «14 дней бесплатного доступа к тарифу
 * Профессиональный» (такого тарифа нет), почасовые проверки позиций, поддержка
 * 24/7 с гарантией SLA, White Label. Поисковики показывали это в расширенном
 * сниппете, а на /pricing получался второй FAQPage рядом с разметкой видимых
 * вопросов. Вопросы в разметке должны быть видны на странице, поэтому без
 * переданного списка компонент ничего не выводит.
 */
export const FAQPageSchema: React.FC<FAQPageSchemaProps> = ({ faqs = [] }) => {
  if (faqs.length === 0) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};
