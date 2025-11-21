import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { sitemapPages } from '@/utils/sitemap-generator';
import { BreadcrumbsWrapper } from '@/components/navigation/BreadcrumbsWrapper';

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Карта сайта | SeoMarket</title>
        <meta name="description" content="Карта сайта SeoMarket - все страницы нашего сервиса SEO аудита и оптимизации" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://seomarket.app/sitemap" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbsWrapper 
            items={[{ name: 'Карта сайта', url: '/sitemap' }]} 
            className="mb-6"
          />
          <h1 className="text-4xl font-bold mb-8 text-foreground">Карта сайта</h1>
          
          <div className="bg-card rounded-lg border border-border p-8">
            <p className="text-muted-foreground mb-8">
              Все страницы сервиса SEO аудита и оптимизации SeoMarket
            </p>
            
            <nav>
              <ul className="space-y-4">
                {sitemapPages.map((page) => (
                  <li key={page.url}>
                    <Link 
                      to={page.url}
                      className="text-lg text-primary hover:underline flex items-center gap-2"
                    >
                      <span className="text-muted-foreground">→</span>
                      {page.url === '/' ? 'Главная' : 
                       page.url === '/site-audit' ? 'SEO Аудит' :
                       page.url === '/features' ? 'Возможности' :
                       page.url === '/pricing' ? 'Цены' :
                       page.url === '/about' ? 'О нас' :
                       page.url === '/contact' ? 'Контакты' :
                       page.url === '/blog' ? 'Блог' :
                       page.url}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Для поисковых систем доступен{' '}
                <a 
                  href="/sitemap.xml" 
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener"
                >
                  XML sitemap
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
