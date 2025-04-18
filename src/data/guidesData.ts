import { Guide } from '../types/guides';

export const guides: Guide[] = [
  {
    id: 1,
    title: 'Полное руководство по аудиту сайта',
    description: 'Узнайте как проводить полный технический аудит вашего сайта от начала до конца, используя все доступные инструменты для анализа.',
    category: 'SEO аудит',
    level: 'Начинающий',
    duration: '30 минут',
    image: '/images/audit-guide-cover.jpg',
    videoUrl: '/video/seo-demo.mp4',
    content: [
      {
        title: 'Подготовка к аудиту сайта',
        content: 'Перед началом технического аудита необходимо собрать все важные данные о сайте. Это включает в себя анализ текущей структуры сайта, его производительности и основных метрик. На этом этапе мы подготовим все необходимые инструменты и создадим план работы.',
        image: '/images/audit-preparation.jpg',
        videoUrl: '/video/seo-demo.mp4'
      },
      {
        title: 'Технический анализ структуры',
        content: 'Проведите глубокий технический анализ вашего сайта. Это включает проверку robots.txt, XML sitemap, анализ структуры URL и внутренней перелинковки. Особое внимание уделите скорости загрузки страниц и mobile-friendly оптимизации. В этом разделе мы рассмотрим каждый аспект технического SEO.',
        image: '/images/technical-analysis.jpg',
        videoUrl: '/video/seo-demo.mp4'
      },
      {
        title: 'Оптимизация контента',
        content: 'Проанализируйте качество контента на вашем сайте. Проверьте уникальность текстов, оптимизацию заголовков и мета-тегов. Используйте специальные инструменты для анализа семантического ядра и релевантности контента поисковым запросам. Важно обратить внимание на структуру текстов и их читабельность.',
        image: '/images/content-optimization.jpg',
        videoUrl: '/video/seo-demo.mp4'
      }
    ]
  },
  {
    id: 2,
    title: 'Как отслеживать позиции сайта в поисковых системах',
    description: 'Пошаговое руководство по настройке и использованию инструментов для мониторинга позиций вашего сайта в поисковой выдаче.',
    category: 'Позиции сайта',
    level: 'Средний',
    duration: '45 минут',
    image: '/images/position-tracking-cover.jpg',
    videoUrl: '/video/seo-demo.mp4',
    content: [
      {
        title: 'Настройка инструментов отслеживания',
        content: 'Начните с выбора правильных инструментов для мониторинга позиций. Мы рассмотрим популярные сервисы и их особенности. Научимся настраивать регулярные проверки и автоматические уведомления об изменении позиций. Это поможет вам оперативно реагировать на любые изменения в выдаче.',
        image: '/images/tracking-tools.jpg',
        videoUrl: '/video/seo-demo.mp4'
      },
      {
        title: 'Анализ конкурентов',
        content: 'Изучите, как отслеживать позиции конкурентов и анализировать их стратегии продвижения. Научитесь использовать эти данные для улучшения собственных позиций. Мы покажем, как создавать сравнительные отчеты и выявлять новые возможности для роста.',
        image: '/images/competitor-analysis.jpg',
        videoUrl: '/video/seo-demo.mp4'
      }
    ]
  },
  {
    id: 3,
    title: 'Оптимизация мета-тегов для улучшения CTR',
    description: 'Как создать привлекательные и эффективные title и description для ваших страниц.',
    category: 'Оптимизация',
    level: 'Начинающий',
    duration: '20 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Основы мета-тегов',
        content: 'Что такое мета-теги и почему они важны...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Оптимизация заголовков',
        content: 'Как писать эффективные заголовки...',
        image: '/images/placeholder.jpg'
      }
    ]
  },
  {
    id: 4,
    title: 'Углубленный анализ конкурентов',
    description: 'Методики и инструменты для анализа стратегий ваших конкурентов в поисковой выдаче.',
    category: 'Конкуренты',
    level: 'Продвинутый',
    duration: '60 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Выявление конкурентов',
        content: 'Как определить ваших основных конкурентов в поиске...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Анализ стратегий',
        content: 'Подробный разбор стратегий конкурентов...',
        image: '/images/placeholder.jpg'
      }
    ]
  },
  {
    id: 5,
    title: 'Работа с отчетами и экспорт данных',
    description: 'Как интерпретировать и эффективно использовать отчеты по SEO аудиту и позициям.',
    category: 'Отчеты',
    level: 'Средний',
    duration: '35 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Типы отчетов',
        content: 'Обзор различных типов отчетов и их использование...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Экспорт и анализ',
        content: 'Как экспортировать и анализировать данные...',
        image: '/images/placeholder.jpg'
      }
    ]
  },
  {
    id: 6,
    title: 'Настройка персонализированных уведомлений',
    description: 'Получайте важные уведомления о изменениях позиций и проблемах на сайте.',
    category: 'Уведомления',
    level: 'Начинающий',
    duration: '15 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Настройка уведомлений',
        content: 'Как настроить персонализированные уведомления...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Типы оповещений',
        content: 'Обзор различных типов уведомлений и их важность...',
        image: '/images/placeholder.jpg'
      }
    ]
  }
];
