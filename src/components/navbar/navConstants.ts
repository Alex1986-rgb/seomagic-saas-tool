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

// Footer navigation items organized by category
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

export const FEATURES_ITEMS = [
  {
    label: 'Функции',
    href: '/features',
  },
  {
    label: 'Тарифы отслеживания',
    href: '/position-pricing',
  },
  {
    label: 'Документация',
    href: '/documentation',
  },
];

export const SUPPORT_ITEMS = [
  {
    label: 'Справка',
    href: '/documentation',
  },
  {
    label: 'Руководства',
    href: '/guides',
  },
  {
    label: 'Поддержка',
    href: '/support',
  },
];
