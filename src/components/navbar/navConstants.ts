
export const NAV_ITEMS = [
  {
    label: 'Главная',
    href: '/',
  },
  {
    label: 'О нас',
    href: '/about',
  },
  {
    label: 'Функции',
    href: '/features',
  },
  {
    label: 'Аудит сайта',
    href: '/audit',
    children: [
      {
        label: 'SEO Аудит',
        href: '/site-audit',
      },
      {
        label: 'Демо оптимизации',
        href: '/optimization-demo',
        isDemo: true,
      }
    ]
  },
  {
    label: 'Позиции',
    href: '/position-tracking',
    children: [
      {
        label: 'Отслеживание позиций',
        href: '/position-tracking',
      },
      {
        label: 'Тарифы отслеживания',
        href: '/position-pricing',
      }
    ]
  },
  {
    label: 'Блог',
    href: '/blog',
  },
  {
    label: 'Справка',
    href: '/documentation',
    children: [
      {
        label: 'Документация',
        href: '/documentation',
      },
      {
        label: 'Руководства',
        href: '/guides',
      },
      {
        label: 'API документация',
        href: '/api-docs',
      },
      {
        label: 'Вебинары',
        href: '/webinars',
        isNew: true,
      },
      {
        label: 'FAQ',
        href: '/faq',
      }
    ]
  },
  {
    label: 'Компания',
    href: '/about',
    children: [
      {
        label: 'О нас',
        href: '/about',
      },
      {
        label: 'Команда',
        href: '/team',
      },
      {
        label: 'Карьера',
        href: '/careers',
      },
      {
        label: 'Партнеры',
        href: '/partners',
      },
      {
        label: 'Контакты',
        href: '/contact',
      }
    ]
  },
  {
    label: 'Цены',
    href: '/pricing',
  },
];

export const CLIENT_ITEMS = [
  {
    label: 'Обзор',
    href: '/client/dashboard',
    icon: 'layout-dashboard',
  },
  {
    label: 'Аудиты',
    href: '/client/audits',
    icon: 'search',
  },
  {
    label: 'Позиции',
    href: '/client/positions',
    icon: 'trending-up',
  },
  {
    label: 'Отчеты',
    href: '/client/reports',
    icon: 'file-text',
  },
  {
    label: 'Настройки',
    href: '/client/settings',
    icon: 'settings',
  },
];

// Add missing items needed for Footer.tsx
export const RESOURCE_ITEMS = [
  {
    label: 'Блог',
    href: '/blog',
  },
  {
    label: 'Руководства',
    href: '/guides',
  },
  {
    label: 'API документация',
    href: '/api-docs',
  },
  {
    label: 'Вебинары',
    href: '/webinars',
  },
  {
    label: 'FAQ',
    href: '/faq',
  },
];

export const COMPANY_ITEMS = [
  {
    label: 'О нас',
    href: '/about',
  },
  {
    label: 'Команда',
    href: '/team',
  },
  {
    label: 'Карьера',
    href: '/careers',
  },
  {
    label: 'Партнеры',
    href: '/partners',
  },
  {
    label: 'Контакты',
    href: '/contact',
  },
];
