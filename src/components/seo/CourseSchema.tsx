import React from 'react';
import { Helmet } from 'react-helmet-async';

interface CourseSchemaProps {
  courses?: Array<{
    name: string;
    description: string;
    provider: string;
    instructor?: string;
    price?: string;
    priceCurrency?: string;
    courseMode?: string;
    duration?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export const CourseSchema: React.FC<CourseSchemaProps> = ({
  courses = [
    {
      name: 'SEO Оптимизация: от основ до профессионала',
      description: 'Комплексный курс по SEO оптимизации сайтов. Изучите технический SEO, контентную оптимизацию, линкбилдинг и аналитику. Получите практические навыки работы с инструментами и реальными проектами.',
      provider: 'SeoMarket Academy',
      instructor: 'Алексей Иванов, SEO эксперт с 10+ летним опытом',
      price: '29990',
      priceCurrency: 'RUB',
      courseMode: 'online',
      duration: 'P8W',
      startDate: '2025-03-01',
      endDate: '2025-04-26'
    },
    {
      name: 'Технический SEO: глубокое погружение',
      description: 'Углубленный курс по техническому SEO. Оптимизация скорости загрузки, структура сайта, JavaScript SEO, международное SEO, схемы данных и продвинутые техники индексации.',
      provider: 'SeoMarket Academy',
      instructor: 'Марина Петрова, технический SEO специалист',
      price: '19990',
      priceCurrency: 'RUB',
      courseMode: 'online',
      duration: 'P6W',
      startDate: '2025-03-15',
      endDate: '2025-04-26'
    },
    {
      name: 'Контентная стратегия для SEO',
      description: 'Научитесь создавать эффективную контентную стратегию для SEO. Исследование ключевых слов, создание семантического ядра, оптимизация текстов и работа с различными форматами контента.',
      provider: 'SeoMarket Academy',
      instructor: 'Елена Смирнова, контент-маркетолог и SEO специалист',
      price: '14990',
      priceCurrency: 'RUB',
      courseMode: 'online',
      duration: 'P4W',
      startDate: '2025-03-10',
      endDate: '2025-04-07'
    },
    {
      name: 'SEO для E-commerce: продвижение интернет-магазинов',
      description: 'Специализированный курс по SEO для интернет-магазинов. Структура каталога, оптимизация карточек товаров, работа с фильтрами, фасетная навигация и увеличение конверсии.',
      provider: 'SeoMarket Academy',
      instructor: 'Дмитрий Волков, специалист по e-commerce SEO',
      price: '24990',
      priceCurrency: 'RUB',
      courseMode: 'online',
      duration: 'P6W',
      startDate: '2025-03-20',
      endDate: '2025-05-01'
    }
  ]
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const courseSchemas = courses.map((course, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${siteUrl}/courses#course-${index + 1}`,
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`
      }
    },
    instructor: course.instructor ? {
      '@type': 'Person',
      name: course.instructor.split(',')[0],
      description: course.instructor
    } : undefined,
    offers: {
      '@type': 'Offer',
      category: 'Paid',
      price: course.price,
      priceCurrency: course.priceCurrency || 'RUB',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/courses`,
      validFrom: new Date().toISOString()
    },
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: course.courseMode || 'online',
        courseWorkload: course.duration,
        startDate: course.startDate,
        endDate: course.endDate,
        instructor: course.instructor ? {
          '@type': 'Person',
          name: course.instructor.split(',')[0]
        } : undefined
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '156',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Анна Козлова'
        },
        datePublished: '2024-12-15',
        reviewBody: 'Отличный курс! Структурированная подача материала, много практики. Преподаватель всегда отвечает на вопросы.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        }
      }
    ],
    educationalLevel: 'Beginner to Advanced',
    inLanguage: 'ru-RU',
    availableLanguage: ['Russian'],
    isAccessibleForFree: false,
    hasCertificate: true
  }));

  return (
    <Helmet>
      {courseSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
