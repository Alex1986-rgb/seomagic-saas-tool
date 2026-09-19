
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Партнёрам.
 *
 * Страница описывала готовую партнёрскую программу, которой нет: «скидка до
 * 30%», White Label, «полный доступ к REST API», выделенный менеджер, двенадцать
 * «наших интеграций» (SEMrush, Ahrefs, Moz, Majestic, Serpstat и другие — ни с
 * одним из этих сервисов платформа не связана), три отзыва партнёров с именами
 * и компаниями, а внизу «50+ активных партнёров», «98% satisfaction rate» и
 * «поддержка 24/7». Все кнопки «Стать партнером» и «Связаться с нами» ничего не
 * делали.
 *
 * Выдуманное убрано. Остались форматы, которые можно обсудить, и кнопки на
 * форму связи — там обращение действительно сохраняется.
 */
const Partners: React.FC = () => {
  return (
    <Layout>
      <PageSeo
        title="Партнёрам: сотрудничество с агентствами и специалистами"
        description="Готовой партнёрской программы с фиксированными условиями пока нет. Агентствам и SEO-специалистам — условия сотрудничества обсуждаем по заявке."
      />
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Партнёрам</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Готовой партнёрской программы с фиксированными скидками и условиями пока нет.
            Если вы агентство или SEO-специалист и хотите работать с сервисом для своих
            клиентов — напишите нам, обсудим условия.
          </p>
        </div>

        <Tabs defaultValue="agency" className="max-w-4xl mx-auto mb-16">
          <TabsList className="grid grid-cols-2 w-full mb-8">
            <TabsTrigger value="agency">Для агентств</TabsTrigger>
            <TabsTrigger value="freelancer">Для специалистов</TabsTrigger>
          </TabsList>

          <TabsContent value="agency">
            <Card>
              <CardHeader>
                <CardTitle>Агентствам и студиям</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Сервис проводит аудит сайтов клиентов, готовит тексты для оптимизации страниц
                  и проверяет позиции в Яндексе и Google. Если у вас поток проектов, расскажите
                  об объёме — согласуем условия и порядок расчётов.
                </p>
                <p className="text-muted-foreground">
                  Брендированных отчётов, публичного API и кабинета для клиентов агентства
                  сейчас нет.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link to="/contact">Обсудить сотрудничество</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="freelancer">
            <Card>
              <CardHeader>
                <CardTitle>SEO-специалистам и консультантам</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Запустите аудит сайта клиента и скачайте отчёт в PDF со страницы результатов —
                  его можно приложить к своему предложению. Если нужны особые условия для
                  регулярной работы, напишите нам.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link to="/audit">Проверить сайт</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">Написать нам</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA секция */}
        <div className="bg-accent/20 rounded-xl p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Хотите сотрудничать?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Расскажите о себе и своих проектах через форму связи — ответим на указанную почту
          </p>

          <Button size="lg" asChild>
            <Link to="/contact">Связаться с нами</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;
