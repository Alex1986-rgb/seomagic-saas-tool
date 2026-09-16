
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Страница «Команда».
 *
 * Здесь были шесть выдуманных сотрудников: «основатель и CEO, эксперт в
 * области SEO с 10-летним опытом», «технический директор», «ведущий
 * SEO-специалист», два ведущих разработчика и дизайнер — с придуманными
 * именами и биографиями, а их иконки Twitter, LinkedIn и GitHub вели на «#».
 * Таких людей в команде нет.
 *
 * Пока владелец не опубликует настоящий состав, страница честно говорит об
 * этом, ведёт на форму обратной связи и закрыта от индексации (как и другие
 * заглушки: /careers, /webinars).
 */
const Team: React.FC = () => {
  return (
    <Layout>
      <PageSeo
        title="Команда SeoMarket"
        description="Состав команды сервиса на сайте пока не опубликован. Связаться с нами можно через форму обратной связи."
        noindex
      />
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Команда</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Состав команды на сайте пока не опубликован. Если у вас вопрос о сервисе, аудите
            или сотрудничестве — напишите нам.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/contact">Написать нам</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/about">О сервисе</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
