
// Navigation items for the navbar
export const NAV_ITEMS = [
  { label: "Аудит", href: "/audit" },
  { label: "Отслеживание", href: "/position-tracking" },
  { label: "Блог", href: "/blog" },
  { label: "О нас", href: "/about" },
  { label: "Цены", href: "/pricing" },
  { label: "Контакты", href: "/contact" },
];

// Client area items (for logged in users)
export const CLIENT_ITEMS = [
  { label: "Панель управления", href: "/dashboard" },
  { label: "Мои аудиты", href: "/audit-history" },
  { label: "Отчеты", href: "/reports" },
  { label: "Настройки", href: "/settings" },
  { label: "Администратор", href: "/admin", admin: true },
];

// Resource items for footer and mobile menu
export const RESOURCE_ITEMS = [
  { label: "Блог", href: "/blog" },
  { label: "Документация", href: "/documentation" },
  { label: "Руководства", href: "/guides" },
  { label: "API", href: "/documentation#api" },
  { label: "Поддержка", href: "/support" },
];

// Company items for footer and mobile menu
export const COMPANY_ITEMS = [
  { label: "О нас", href: "/about" },
  { label: "Карьера", href: "/careers" },
  { label: "Партнерство", href: "/partnership" },
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Условия использования", href: "/terms" },
];
