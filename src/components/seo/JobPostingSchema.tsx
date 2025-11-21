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

export const JobPostingSchema: React.FC<JobPostingSchemaProps> = ({
  jobs = [
    {
      title: 'SEO специалист (Middle)',
      description: 'Ищем опытного SEO специалиста для работы над крупными проектами. Вы будете проводить технические аудиты, разрабатывать стратегии продвижения и работать с клиентами. Требования: опыт работы от 2 лет, знание инструментов аналитики, понимание технического SEO. Мы предлагаем: интересные проекты, удаленную работу, профессиональное развитие.',
      salaryMin: '120000',
      salaryMax: '180000',
      salaryCurrency: 'RUB',
      employmentType: 'FULL_TIME',
      datePosted: '2025-01-15',
      validThrough: '2025-03-15',
      workLocation: 'remote'
    },
    {
      title: 'Senior SEO специалист / Team Lead',
      description: 'В команду SeoMarket требуется Senior SEO специалист с опытом управления командой. Обязанности: разработка SEO стратегий для сложных проектов, управление командой специалистов, коммуникация с клиентами, наставничество. Требования: опыт от 5 лет, опыт руководства командой от 1 года, глубокие знания SEO, навыки управления проектами.',
      salaryMin: '200000',
      salaryMax: '300000',
      salaryCurrency: 'RUB',
      employmentType: 'FULL_TIME',
      datePosted: '2025-01-20',
      validThrough: '2025-04-20',
      workLocation: 'hybrid'
    },
    {
      title: 'Контент-менеджер с знанием SEO',
      description: 'Ищем контент-менеджера для работы над SEO проектами. Создание и оптимизация контента, работа с семантическим ядром, анализ конкурентов. Требования: грамотная письменная речь, базовые знания SEO, опыт работы с CMS, внимание к деталям. Мы предлагаем гибкий график, обучение, молодую команду.',
      salaryMin: '80000',
      salaryMax: '120000',
      salaryCurrency: 'RUB',
      employmentType: 'FULL_TIME',
      datePosted: '2025-01-25',
      validThrough: '2025-03-25',
      workLocation: 'remote'
    },
    {
      title: 'Технический SEO специалист',
      description: 'В команду требуется технический SEO специалист. Работа с крупными сайтами, техническая оптимизация, работа с разработчиками, JavaScript SEO. Требования: опыт от 3 лет, знание Python/JavaScript, опыт работы с большими сайтами (10000+ страниц), понимание веб-технологий. Предлагаем высокую зарплату и сложные задачи.',
      salaryMin: '150000',
      salaryMax: '220000',
      salaryCurrency: 'RUB',
      employmentType: 'FULL_TIME',
      datePosted: '2025-01-18',
      validThrough: '2025-04-18',
      workLocation: 'remote'
    }
  ]
}) => {
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
      sameAs: siteUrl,
      logo: `${siteUrl}/images/logo.png`
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
