import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absoluteAssetUrl, absolutePageUrl } from '@/lib/asset-url';

interface HowToSchemaProps {
  name?: string;
  description?: string;
  totalTime?: string;
  steps?: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
}

export const HowToSchema: React.FC<HowToSchemaProps> = ({
  name = 'Как провести SEO аудит сайта',
  description = 'Полное руководство по проведению комплексного SEO аудита для улучшения позиций сайта в поисковых системах',
  totalTime = 'PT2H',
  steps = [] }) => {
  // Инструкция для поисковой выдачи должна соответствовать странице.
  // Без переданных шагов разметку не выводим.
  if (steps.length === 0) return null;

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    // Обложки /images/seo-audit-guide.jpg в проекте нет — поле убрано.
    totalTime: totalTime,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'RUB',
      value: '0'
    },
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'SEO аудит платформа SeoMarket'
      },
      {
        '@type': 'HowToSupply',
        name: 'Доступ к Google Search Console'
      }
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'SeoMarket SEO Audit Tool'
      },
      {
        '@type': 'HowToTool',
        name: 'Google PageSpeed Insights'
      }
    ],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image ? {
        '@type': 'ImageObject',
        url: absoluteAssetUrl(step.image),
        width: 800,
        height: 450
      } : undefined,
      url: absolutePageUrl(step.url || '/features')
    }))
    // Блок video описывал ролик seo-audit-guide.mp4 с превью
    // /images/video-thumbnail.jpg: ни файла, ни страницы /embed/... не
    // существует, поисковики показывали в выдаче видео, которого нет.
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
    </Helmet>
  );
};
