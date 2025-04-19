
// Navigation items for the navbar
export const NAV_ITEMS = [
  { label: "Аудит", href: "/audit" },
  { label: "Позиции", href: "/position-tracking" },
  { label: "Цены", href: "/pricing" },
  { label: "Возможности", href: "/features" },
];

// Resources dropdown items
export const RESOURCE_ITEMS = [
  { label: "Блог", href: "/blog" },
  { label: "Руководства", href: "/guides" },
  { label: "Документация", href: "/documentation" },
  { label: "Демо", href: "/demo" },
];

// Company dropdown items
export const COMPANY_ITEMS = [
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contact" },
  { label: "Поддержка", href: "/support" },
  { label: "Условия использования", href: "/terms" },
  { label: "Политика конфиденциальности", href: "/privacy" },
];

// Client area items (for logged in users)
export const CLIENT_ITEMS = [
  { label: "Панель управления", href: "/dashboard" },
  { label: "Мои аудиты", href: "/audit-history" },
  { label: "Отчеты", href: "/reports" },
  { label: "Настройки", href: "/settings" },
  { label: "Администратор", href: "/admin", admin: true },
];
