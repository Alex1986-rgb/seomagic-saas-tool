
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
