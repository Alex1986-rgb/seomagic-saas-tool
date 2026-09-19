
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { YoutubeIcon } from 'lucide-react';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Видеоканал.
 *
 * Здесь была витрина YouTube-канала «SeoMarket»: «5.2K подписчиков», «48 видео»,
 * три ролика с датами 2024 года и просмотрами 1250 / 980 / 1520, ссылка
 * «Открыть канал на YouTube» на главную youtube.com и кнопки «Подписаться»,
 * «Все видео» и «Play» без обработчиков. Канала нет, роликов нет, цифры
 * придуманы — а страница ещё и продвигалась в поиске как «разборы на реальных
 * примерах».
 *
 * Пока канала нет, страница честно говорит об этом и ведёт к материалам,
 * которые на сайте действительно есть.
 */
const Channel: React.FC = () => {
  return (
    <Layout>
      {/* Страница-заглушка без содержания: в поиске ей делать нечего. */}
      <PageSeo
        title="Видеоканал SeoMarket"
        description="Видеоканала у сервиса пока нет. Материалы об аудите сайтов, позициях и оптимизации — в блоге и руководствах."
        noindex
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <YoutubeIcon size={48} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Видеоканал</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Видеоканала пока нет</h2>
            <p className="text-muted-foreground mb-6">
              Видео о работе с сервисом мы пока не публиковали. Когда канал появится, ссылка на
              него будет здесь. А пока разобраться с аудитом, позициями и оптимизацией помогут
              статьи блога и руководства.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/guides">Руководства</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/blog">Блог</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Channel;
