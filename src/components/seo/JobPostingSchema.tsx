import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_CONTACTS, hasPostalAddress } from '@/config/site-contacts';
import { absolutePageUrl } from '@/lib/asset-url';

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

  const siteUrl = absolutePageUrl('/');

  // К любой вакансии дописывались офис «ул. Примерная, д. 123, БЦ "Технополис"»,
  // почта hr@seomarket.ru, телефон +7 800 123-45-67, часы работы, ДМС, навыки
  // и опыт, угаданные по словам в названии. Ничего из этого не существует —
  // убрано. Офисный адрес берётся из SITE_CONTACTS, а если его нет, вакансия
  // размечается как удалённая.
  const officeLocation = hasPostalAddress()
    ? {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE_CONTACTS.streetAddress,
          addressLocality: SITE_CONTACTS.addressLocality,
          addressCountry: SITE_CONTACTS.addressCountry
        }
      }
    : null;

  const jobSchemas = jobs.map((job, index) => {
    const isRemote = job.workLocation === 'remote' || !officeLocation;

    return {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      '@id': absolutePageUrl(`/careers#job-${index + 1}`),
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
      ...(isRemote
        ? {
            jobLocationType: 'TELECOMMUTE',
            applicantLocationRequirements: {
              '@type': 'Country',
              name: SITE_CONTACTS.addressCountry
            }
          }
        : { jobLocation: officeLocation }),
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salaryCurrency || 'RUB',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salaryMin,
          maxValue: job.salaryMax,
          unitText: 'MONTH'
        }
      }
    };
  });

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
