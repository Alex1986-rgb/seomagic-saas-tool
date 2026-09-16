
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Карьера.
 *
 * Здесь висели три вакансии — Senior Full Stack Developer, SEO-аналитик и
 * UX/UI дизайнер — с кнопками «Откликнуться» и «Отправить резюме» без
 * обработчиков, а над ними «продукты, которыми пользуются тысячи компаний»,
 * курсы, конференции и корпоративные мероприятия. Таких вакансий нет и не было
 * (их разметку JobPosting уже убрали как выдуманную), отклик никуда не уходил.
 *
 * Пока открытых вакансий нет, страница честно говорит об этом и ведёт на форму
 * связи — там сообщение действительно сохраняется.
 */
const Careers: React.FC = () => {
  return (
    <Layout>
      {/* Страница-заглушка без содержания: в поиске ей делать нечего. */}
      <PageSeo
        title="Вакансии и карьера в SeoMarket"
        description="Открытых вакансий сейчас нет. Если хотите предложить сотрудничество, напишите нам через форму связи."
        noindex
      />
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Карьера в SeoMarket</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Мы развиваем сервис SEO-аудита, оптимизации сайтов и проверки позиций
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Открытых вакансий сейчас нет</h2>
            <p className="text-muted-foreground mb-6">
              Когда появятся вакансии, они будут опубликованы на этой странице. Если хотите
              предложить сотрудничество, напишите нам — расскажите о себе и приложите ссылку
              на резюме или портфолио.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Написать нам</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Careers;
