
export const NAV_ITEMS = [
  {
    label: "Главная",
    href: "/",
  },
  {
    label: "Продукт",
    href: "#",
    children: [
      {
        label: "Возможности",
        href: "/features",
      },
      {
        label: "Демо",
        href: "/demo",
        isDemo: true,
      },
      {
        label: "Документация",
        href: "/documentation",
      },
      {
        label: "API Документация",
        href: "/api-docs",
      },
    ],
  },
  {
    label: "Аудит сайта",
    href: "/site-audit",
  },
  {
    label: "Демонстрация оптимизации",
    href: "/optimization-demo",
    isDemo: true,
  },
  {
    label: "Цены",
    href: "/pricing",
  },
  {
    label: "Анализ позиций",
    href: "/position-tracking",
  },
  {
    label: "Ресурсы",
    href: "#",
    children: [
      {
        label: "Блог",
        href: "/blog",
      },
      {
        label: "Руководства",
        href: "/guides",
      },
      {
        label: "Вебинары",
        href: "/webinars",
      },
      {
        label: "FAQ",
        href: "/faq",
      },
    ],
  },
  {
    label: "О нас",
    href: "/about",
  },
  {
    label: "Контакты",
    href: "/contact",
  },
];

export const CLIENT_ITEMS = [
  {
    label: "Дашборд",
    href: "/dashboard",
  },
  {
    label: "Аудиты",
    href: "/dashboard/audits",
  },
  {
    label: "Позиции",
    href: "/dashboard/positions",
  },
  {
    label: "Настройки",
    href: "/dashboard/settings",
  },
];

// Resource links for footer
export const RESOURCE_ITEMS = [
  {
    label: "Блог",
    href: "/blog",
  },
  {
    label: "Руководства",
    href: "/guides",
  },
  {
    label: "Вебинары",
    href: "/webinars",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "API Документация",
    href: "/api-docs",
  }
];

// Company links for footer
export const COMPANY_ITEMS = [
  {
    label: "О нас",
    href: "/about",
  },
  {
    label: "Команда",
    href: "/team",
  },
  {
    label: "Карьера",
    href: "/careers",
  },
  {
    label: "Партнеры",
    href: "/partners",
  },
  {
    label: "Контакты",
    href: "/contact",
  }
];
