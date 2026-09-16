import React from 'react';
import { Link } from 'react-router-dom';
import { sitemapPages } from '@/utils/sitemap-generator';
import { BreadcrumbsWrapper } from '@/components/navigation/BreadcrumbsWrapper';
import PageSeo from '@/components/seo/PageSeo';

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Карта сайта: структура разделов и все страницы сервиса"
        description="Навигация по сайту одним списком: аудит, отслеживание позиций, тарифы, документация, блог, справка и юридические документы."
      />

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

            {/*
              Здесь была ссылка «Для поисковых систем доступен XML sitemap» на
              /sitemap.xml. Такого файла сайт не публикует (в public его нет, при
              сборке он не создаётся), а ссылка от корня домена к тому же шла мимо
              подпути публикации — человек получал 404. Вернуть ссылку можно, когда
              sitemap.xml начнёт собираться, через assetUrl('sitemap.xml').
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
