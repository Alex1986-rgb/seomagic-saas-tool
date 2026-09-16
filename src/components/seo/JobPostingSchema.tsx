import React from 'react';
import { Helmet } from 'react-helmet-async';

interface JobPostingSchemaProps {
  jobs?: Array<{
    title: string;
    description: string;
    salaryMin: string;
    salaryMax: string;
    salaryCurrency?: string;
    employmentType?: string;
    datePosted: string;
    validThrough?: string;
    workLocation?: string;
  }>;
}

export const JobPostingSchema: React.FC<JobPostingSchemaProps> = ({ jobs = [] }) => {
  // Здесь висели две придуманные вакансии со сроком действия до весны 2025 года:
  // поисковики показывали их как открытые, хотя таких вакансий нет и не было.
  // Просроченная разметка вакансий — повод для санкций, поэтому без настоящих
  // данных не выводим ничего.
  if (jobs.length === 0) return null;

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const jobSchemas = jobs.map((job, index) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': `${siteUrl}/careers#job-${index + 1}`,
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'SeoMarket',
      // Логотипа /images/logo.png в проекте нет — поле убрано.
      sameAs: siteUrl
    },
    jobLocation: job.workLocation === 'remote' ? {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Удаленная работа',
        addressCountry: 'RU'
      }
    } : job.workLocation === 'hybrid' ? {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Примерная, д. 123, БЦ "Технополис"',
        addressLocality: 'Москва',
        addressCountry: 'RU'
      }
    } : {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Примерная, д. 123, БЦ "Технополис"',
        addressLocality: 'Москва',
        postalCode: '123456',
        addressCountry: 'RU'
      }
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: job.salaryCurrency || 'RUB',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: 'MONTH'
      }
    },
    workHours: '9:00-18:00',
    jobBenefits: [
      'Гибкий график работы',
      'Удаленная работа',
      'Обучение и развитие',
      'ДМС после испытательного срока',
      'Корпоративные мероприятия',
      'Современное оборудование'
    ],
    skills: job.title.includes('Senior') || job.title.includes('Team Lead') 
      ? 'SEO, Google Analytics, Управление командой, Стратегическое планирование'
      : job.title.includes('Технический')
      ? 'Технический SEO, Python, JavaScript, SQL, Системное администрирование'
      : job.title.includes('Контент')
      ? 'Контент-маркетинг, SEO копирайтинг, Работа с CMS'
      : 'SEO, Google Analytics, Техническая оптимизация',
    experienceRequirements: {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: job.title.includes('Senior') ? 60 
        : job.title.includes('Middle') ? 24 
        : job.title.includes('Технический') ? 36 
        : 0
    },
    qualifications: 'Высшее образование приветствуется',
    responsibilities: job.title.includes('Senior') || job.title.includes('Team Lead')
      ? 'Разработка SEO стратегий, Управление командой, Работа с клиентами, Контроль качества'
      : job.title.includes('Технический')
      ? 'Технический аудит сайтов, Оптимизация производительности, Работа с разработчиками'
      : 'Создание контента, Оптимизация текстов, Анализ конкурентов',
    applicationContact: {
      '@type': 'ContactPoint',
      email: 'hr@seomarket.ru',
      telephone: '+78001234567',
      contactType: 'HR Department'
    },
    industry: 'Internet',
    occupationalCategory: 'Marketing and Communications'
  }));

  return (
    <Helmet>
      {jobSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
