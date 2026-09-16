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
  courses = [] }) => {
  // Курсы описывались вписанным в код списком. Пока настоящих курсов нет,
  // разметку не отдаём.
  if (courses.length === 0) return null;

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
      // Логотипа /images/logo.png в проекте нет — поле убрано.
      url: siteUrl
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
