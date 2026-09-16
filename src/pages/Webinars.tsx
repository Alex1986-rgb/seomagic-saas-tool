
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Вебинары.
 *
 * Здесь были три карточки «записей» — «Основы SEO оптимизации» (45 минут),
 * «Продвинутый аудит сайта» (60 минут), «Отслеживание позиций» (50 минут) — с
 * заглушкой «Превью вебинара» и кнопками «Смотреть запись» без обработчиков.
 * Этих вебинаров никогда не было (их разметку Event уже убрали как выдуманную),
 * смотреть было нечего.
 *
 * Пока вебинаров нет, страница честно говорит об этом и предлагает материалы,
 * которые на сайте действительно есть.
 */
const Webinars: React.FC = () => {
  return (
    <Layout>
      {/* Страница-заглушка без содержания: в поиске ей делать нечего. */}
      <PageSeo
        title="Вебинары по SEO от SeoMarket"
        description="Вебинаров пока нет. Материалы об аудите сайта, позициях и оптимизации — в блоге и руководствах сервиса."
        noindex
      />
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Вебинары</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Обучающие встречи по SEO и работе с платформой
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Вебинаров пока нет</h2>
            <p className="text-muted-foreground mb-6">
              Ни прошедших записей, ни запланированных эфиров сейчас нет. Разобраться с аудитом,
              позициями и оптимизацией помогут статьи блога и руководства. Если есть вопрос —
              напишите нам.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/guides">Руководства</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/blog">Блог</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Задать вопрос</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Webinars;
