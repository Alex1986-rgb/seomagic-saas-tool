import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absolutePageUrl } from '@/lib/asset-url';

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

  const siteUrl = absolutePageUrl('/');
  
  const courseSchemas = courses.map((course, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': absolutePageUrl(`/courses#course-${index + 1}`),
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
      url: absolutePageUrl('/courses'),
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
    // Оценка 4,9 по 156 отзывам и отзыв «Анны Козловой» были вписаны в код и
    // подставлялись к любому курсу — убраны. Настоящие отзывы передавать явно.
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
