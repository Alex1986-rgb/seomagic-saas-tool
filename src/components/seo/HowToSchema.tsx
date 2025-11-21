import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  steps = [
    {
      name: 'Шаг 1: Анализ технических параметров',
      text: 'Проверьте скорость загрузки сайта, мобильную адаптацию, корректность robots.txt и sitemap.xml. Используйте инструменты Google PageSpeed Insights и наш сервис для полного технического анализа.',
      image: '/images/seo-technical-audit.jpg',
      url: 'https://seomarket.app/features'
    },
    {
      name: 'Шаг 2: Проверка контента',
      text: 'Оцените качество текстов, наличие дублей, правильность использования заголовков H1-H6, мета-тегов title и description. Убедитесь, что контент уникален и релевантен запросам.',
      image: '/images/seo-content-check.jpg',
      url: 'https://seomarket.app/features'
    },
    {
      name: 'Шаг 3: Анализ внутренней перелинковки',
      text: 'Проверьте структуру сайта, глубину вложенности страниц, наличие битых ссылок. Оптимизируйте внутреннюю перелинковку для улучшения индексации.',
      image: '/images/seo-internal-links.jpg',
      url: 'https://seomarket.app/features'
    },
    {
      name: 'Шаг 4: Мониторинг позиций',
      text: 'Настройте отслеживание позиций по ключевым запросам. Регулярно проверяйте динамику и корректируйте стратегию продвижения на основе полученных данных.',
      image: '/images/seo-position-tracking.jpg',
      url: 'https://seomarket.app/features'
    },
    {
      name: 'Шаг 5: Генерация отчёта',
      text: 'Создайте детальный отчёт с найденными проблемами и рекомендациями по их устранению. Используйте визуализацию данных для лучшего понимания ситуации.',
      image: '/images/seo-report.jpg',
      url: 'https://seomarket.app/features'
    }
  ]
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/seo-audit-guide.jpg`,
      width: 1200,
      height: 630
    },
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
        url: `${siteUrl}${step.image}`,
        width: 800,
        height: 450
      } : undefined,
      url: step.url || `${siteUrl}/features`
    })),
    video: {
      '@type': 'VideoObject',
      name: 'Видео руководство по SEO аудиту',
      description: 'Подробное видео о том, как провести комплексный SEO аудит сайта',
      thumbnailUrl: `${siteUrl}/images/video-thumbnail.jpg`,
      uploadDate: '2024-01-15T00:00:00Z',
      duration: 'PT10M30S',
      contentUrl: `${siteUrl}/videos/seo-audit-guide.mp4`,
      embedUrl: `${siteUrl}/embed/seo-audit-guide`
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
    </Helmet>
  );
};
