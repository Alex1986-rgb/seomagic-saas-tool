import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const resourceItems = [
    { label: "Блог", href: "/blog" },
    { label: "Руководства", href: "/guides" },
    { label: "Документация API", href: "/documentation" },
    { label: "Партнерская программа", href: "/partnership" },
    { label: "Поддержка", href: "/support" },
  ];

  const companyItems = [
    { label: "О нас", href: "/about" },
    { label: "Контакты", href: "/contact" },
    { label: "Карьера", href: "/careers" },
    { label: "Правовая информация", href: "/legal" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">О сервисе</h3>
            <p className="text-sm text-muted-foreground">
              SeoMarket - это платформа для SEO-аудита и оптимизации сайтов.
              Мы помогаем улучшить позиции вашего сайта в поисковых системах и увеличить органический трафик.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Ресурсы</h3>
            <ul className="space-y-2">
              {resourceItems.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              {companyItems.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Подпишитесь на рассылку</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Получайте последние новости и обновления.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Ваш email"
                className="border rounded-l-md px-3 py-2 text-sm w-full focus:outline-none"
              />
              <button className="bg-primary text-primary-foreground rounded-r-md px-4 py-2 text-sm hover:bg-primary/90">
                Подписаться
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 py-4 border-t border-border text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SeoMarket. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
