import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plug, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Интеграция с CMS.
 *
 * Страница описывала готовые интеграции, которых нет: плагин WordPress
 * «SeoMarket SEO Audit» v2.1.3 с «10,000+ установок» и рейтингом «⭐ 4.9»,
 * компонент 1C-Bitrix v1.8.2 «из Маркетплейса», модули Joomla и Drupal со
 * статусом «Доступно», пошаговые инструкции установки, «REST API» на
 * api.seomarket.com и кнопки «Скачать плагин» / «Скачать компонент»,
 * «Связаться с поддержкой», «Заказать разработку» без обработчиков. Ни одного
 * плагина, компонента или API не существует — скачать было нечего, а по
 * инструкции человек искал плагин в каталоге WordPress и не находил.
 *
 * Пока интеграций нет, страница честно говорит об этом и объясняет, как
 * сейчас переносить правки на сайт.
 */
const CMSIntegration: React.FC = () => {
  const currentWorkflow = [
    'Запустите аудит сайта — сервис найдёт ошибки на страницах',
    'Запустите ИИ-оптимизацию — сервис подготовит новые title, description и рекомендации по тексту',
    'Перенесите правки в админке своей CMS вручную',
    'Запустите аудит повторно, чтобы проверить результат'
  ];

  return (
    <Layout>
      <PageSeo
        title="Интеграция с CMS: как перенести правки на сайт"
        description="Готовых плагинов для CMS и публичного API у сервиса пока нет. Как сейчас переносить результаты аудита и оптимизации на сайт."
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Навигация */}
        <div className="mb-8">
          <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Все возможности</span>
          </Link>
        </div>

        {/* Шапка */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Plug className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="outline" className="text-xs">
              Пока недоступно
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Интеграция с CMS</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Готовых плагинов для WordPress, 1C-Bitrix, Joomla, Drupal, Tilda и других CMS,
            а также публичного API у сервиса пока нет. Правки, которые готовит сервис,
            переносятся на сайт вручную.
          </p>
        </motion.div>

        {/* Как работать сейчас */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Как работать с сайтом на любой CMS сейчас</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {currentWorkflow.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-primary text-white text-xs rounded-full font-semibold shrink-0">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Аудит проверяет опубликованные страницы сайта, поэтому от CMS он не зависит.</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Нужна интеграция с вашей CMS?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Расскажите, на какой системе работает сайт и что нужно автоматизировать, —
                обсудим. А пока можно проверить сайт и получить готовые правки.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Проверить сайт</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Обсудить интеграцию</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CMSIntegration;
