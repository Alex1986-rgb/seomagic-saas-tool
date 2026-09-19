
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Документация API.
 *
 * Здесь была документация REST API, которого не существует: базовый адрес
 * https://api.seomarket.com/v1, авторизация «API-ключом из личного кабинета»
 * (такого ключа в кабинете нет), эндпоинты POST /audit и POST /positions/track
 * и примеры на cURL и JavaScript. Разработчик, который пробовал по ним
 * подключиться, получал ошибку домена и терял время.
 *
 * Пока публичного API нет, страница честно говорит об этом.
 */
const ApiDocs: React.FC = () => {
  return (
    <Layout>
      {/* Страница-заглушка без содержания: в поиске ей делать нечего. */}
      <PageSeo
        title="API SeoMarket"
        description="Публичного API у сервиса пока нет. Аудит сайта и проверка позиций доступны в веб-интерфейсе; по вопросам интеграции напишите нам."
        noindex
      />
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">API</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Программный доступ к аудиту и проверке позиций
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Публичного API пока нет</h2>
            <p className="text-muted-foreground mb-6">
              Аудит сайта, оптимизация и проверка позиций сейчас работают только через
              веб-интерфейс. Ключей доступа и документированных адресов для внешних запросов нет.
              Если вам нужна интеграция с вашей системой, расскажите о задаче — обсудим.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/audit">Проверить сайт</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Обсудить интеграцию</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApiDocs;
