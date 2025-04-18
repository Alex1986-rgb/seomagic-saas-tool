import React from 'react';
import { Link } from 'react-router-dom';
import { RESOURCE_ITEMS, COMPANY_ITEMS } from './navbar/navConstants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link
              to="/"
              className="text-2xl font-bold inline-flex items-center"
            >
              <span className="text-primary">Seo</span>Market
            </Link>
            <p className="mt-4 text-muted-foreground">
              Комплексное решение для профессионального SEO аудита и оптимизации.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Продукт</h3>
            <ul className="space-y-3">
              <FooterLink to="/features">Возможности</FooterLink>
              <FooterLink to="/pricing">Цены</FooterLink>
              <FooterLink to="/position-tracking">Анализ позиций</FooterLink>
              <FooterLink to="/demo">Демо</FooterLink>
              <FooterLink to="/documentation">Документация</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Ресурсы</h3>
            <ul className="space-y-3">
              {RESOURCE_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Компания</h3>
            <ul className="space-y-3">
              {COMPANY_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground mb-2">
              &copy; {new Date().getFullYear()} SeoMarket. Все права защищены.
            </p>
            <p className="text-xs text-muted-foreground">
              Разработчик и веб-дизайнер: Kyrlan Alexandr
            </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <SocialLink href="https://twitter.com" aria-label="Twitter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </SocialLink>
            <SocialLink href="https://linkedin.com" aria-label="LinkedIn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </SocialLink>
            <SocialLink href="https://github.com" aria-label="GitHub">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </SocialLink>
          </div>
        </div>
      </div>
      <div className="bg-background/80 text-center py-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} SeoMarket. MIT License. </span>
        <Link to="/terms" className="hover:text-foreground">Условия использования</Link>
        <span> · </span>
        <Link to="/privacy" className="hover:text-foreground">Политика конфиденциальности</Link>
        <span> · </span>
        <Link to="/ip-info" className="hover:text-foreground">IP-адрес</Link>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <li>
    <Link
      to={to}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  </li>
);

const SocialLink: React.FC<{
  href: string;
  'aria-label': string;
  children: React.ReactNode;
}> = ({ href, children, ...props }) => (
  <a
    href={href}
    className="text-muted-foreground hover:text-foreground transition-colors"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  >
    {children}
  </a>
);

export default Footer;
