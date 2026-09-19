import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, CheckCircle, Bot, Settings, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Исправление ошибок.
 *
 * Во вкладке «Результаты» были счётчики «Исправлено проблем 1,247 (+89% за
 * месяц)», «Улучшение позиций +23», «Время экономии 47ч» и лента «последних
 * исправлений» с отметками «2 часа назад»; в демо — «исправлено 199 из 292
 * проблем за 12 минут» и «156 изображений»; во вкладке «Настройки» —
 * переключатели «Включено» для автоматического добавления alt, микроразметки,
 * правки robots.txt и дублей. Такие исправления никто не считал, а сервис не
 * вносит правки на сайт сам и не генерирует alt, разметку и robots.txt.
 *
 * Теперь описано, что происходит на самом деле: по результатам аудита ИИ
 * готовит title, description, рекомендации по заголовкам и тексту, а переносит
 * их на сайт владелец. Примеры подписаны как условные.
 */
const AutoFix: React.FC = () => {
  const aiCapabilities = [
    {
      title: 'Title и meta description',
      description: 'ИИ предлагает новые заголовок и описание для страниц, где они отсутствуют или написаны плохо',
      icon: Sparkles,
      examples: ['Title для страниц, где его нет', 'Описания вместо пустых и дублирующихся', 'Заголовки нужной длины']
    },
    {
      title: 'Структура заголовков',
      description: 'Рекомендации по H1–H3 для страниц без H1 или с несколькими H1',
      icon: Settings,
      examples: ['Где добавить H1', 'Где лишние H1', 'Как выстроить подзаголовки']
    },
    {
      title: 'Текст страницы',
      description: 'Рекомендации по улучшению текста для страниц с малым объёмом контента',
      icon: Target,
      examples: ['Что дописать', 'Как раскрыть тему страницы']
    }
  ];

  return (
    <Layout>
      <PageSeo
        title="Исправление SEO-ошибок: метатеги, заголовки и тексты"
        description="Сервис не только находит проблемы, но и готовит исправления: новые title и description, рекомендации по заголовкам и тексту страниц."
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
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              ИИ-технологии
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Исправление ошибок</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            По результатам аудита ИИ готовит исправления для найденных ошибок: новые title и description,
            рекомендации по заголовкам и тексту. На сайт правки переносите вы — сервис не меняет сайт сам.
          </p>
        </motion.div>

        {/* Возможности ИИ */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="capabilities" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="capabilities">Что готовит ИИ</TabsTrigger>
              <TabsTrigger value="examples">Примеры</TabsTrigger>
            </TabsList>

            <TabsContent value="capabilities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiCapabilities.map((capability, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <capability.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{capability.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{capability.description}</p>
                          <div className="space-y-1">
                            {capability.examples.map((example, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-muted-foreground">{example}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Условный пример: meta-описание</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-semibold text-red-800 mb-2">До оптимизации:</h5>
                        <code className="text-sm text-red-700">
                          &lt;meta name="description" content="Главная страница"&gt;
                        </code>
                        <p className="text-xs text-red-600 mt-1">Слишком короткое и ничего не говорит о странице</p>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">Предложение ИИ:</h5>
                        <code className="text-sm text-green-700">
                          &lt;meta name="description" content="SEO-аудит сайта: проверка страниц на технические ошибки, метатеги и скорость ответа с рекомендациями, что исправить в первую очередь."&gt;
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Условный пример: заголовок H1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-semibold text-red-800 mb-2">До:</h5>
                        <code className="text-sm text-red-700">&lt;h1&gt;Услуги&lt;/h1&gt;</code>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">Предложение ИИ:</h5>
                        <code className="text-sm text-green-700">&lt;h1&gt;SEO-аудит и оптимизация сайта&lt;/h1&gt;</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Получите исправления для своего сайта</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Запустите аудит: по его результатам сервис рассчитает стоимость и подготовит
                исправления для страниц с ошибками.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Запустить аудит</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/features">Все возможности</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AutoFix;
