
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
    label: 'Канал',
    href: '/channel',
  },
  {
    label: 'Аудит сайта',
    href: '/audit',
    children: [
      {
        label: 'SEO Аудит',
        href: '/site-audit',
        isNew: false,
      },
      {
        label: 'Демо оптимизации',
        href: '/optimization-demo',
        isDemo: true,
        isNew: false,
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
    isNew: false,
  },
  {
    label: 'Руководства',
    href: '/guides',
    isNew: false,
  },
  {
    label: 'API документация',
    href: '/api-docs',
    isNew: false,
  },
  {
    label: 'Вебинары',
    href: '/webinars',
    isNew: false,
  },
  {
    label: 'FAQ',
    href: '/faq',
    isNew: false,
  },
];

export const COMPANY_ITEMS = [
  {
    label: 'О нас',
    href: '/about',
    isNew: false,
  },
  {
    label: 'Команда',
    href: '/team',
    isNew: false,
  },
  {
    label: 'Карьера',
    href: '/careers',
    isNew: false,
  },
  {
    label: 'Партнеры',
    href: '/partners',
    isNew: false,
  },
  {
    label: 'Контакты',
    href: '/contact',
    isNew: false,
  },
];

export const FEATURES_ITEMS = [
  {
    label: 'Функции',
    href: '/features',
    isNew: false,
  },
  {
    label: 'Тарифы отслеживания',
    href: '/position-pricing',
    isNew: false,
  },
  {
    label: 'Документация',
    href: '/documentation',
    isNew: false,
  },
];

export const SUPPORT_ITEMS = [
  {
    label: 'Справка',
    href: '/documentation',
    isNew: false,
  },
  {
    label: 'Руководства',
    href: '/guides',
    isNew: false,
  },
  {
    label: 'Поддержка',
    href: '/support',
    isNew: false,
  },
];
