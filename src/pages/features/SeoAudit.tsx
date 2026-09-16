import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, CheckCircle, Globe, FileText, Zap, Smartphone, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSeo from '@/components/seo/PageSeo';

/**
 * SEO-аудит.
 *
 * Страница обещала «200+ проверок» (по категориям 45 + 38 + 32 + 28 + 22 + 18),
 * а в списке были Core Web Vitals, кэширование, минификация CSS/JS, touch-
 * элементы, безопасные заголовки, поиск уязвимостей, проверка Google Analytics
 * и Search Console — аудит ничего из этого не делает. Во вкладке
 * «Автоматизация» стояли «Еженедельный аудит — Включено», email-уведомления и
 * интеграция с CMS, которых нет; кнопки «Посмотреть демо», «Исправить»,
 * «Скачать», «Открыть», «Экспорт» ничего не делали, CSV-выгрузки не существует.
 *
 * Теперь список проверок собран по тому, что аудит действительно сохраняет о
 * каждой странице, демо подписано как условный пример, выгрузка — PDF и JSON.
 */
const SeoAudit: React.FC = () => {
  const auditChecks = [
    {
      category: 'Ответ сервера и индексация',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      items: ['Код ответа', 'Цепочки редиректов', 'Canonical', 'Meta robots и X-Robots-Tag', 'Индексируемость страницы']
    },
    {
      category: 'Метатеги и заголовки',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      items: ['Title', 'Meta description', 'Заголовки H1–H3', 'Hreflang']
    },
    {
      category: 'Скорость',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      items: ['Время ответа сервера (TTFB)', 'Время загрузки', 'Сжатие страницы', 'Размер ответа']
    },
    {
      category: 'Контент',
      icon: Search,
      color: 'from-orange-500 to-red-500',
      items: ['Объём текста', 'Страницы с малым количеством текста', 'Соотношение текста и кода', 'Язык страницы']
    },
    {
      category: 'Изображения и мобильные',
      icon: Smartphone,
      color: 'from-gray-500 to-slate-500',
      items: ['Изображения без alt', 'Meta viewport']
    },
    {
      category: 'Ссылки и структура',
      icon: Link2,
      color: 'from-indigo-500 to-blue-500',
      items: ['Внутренние ссылки', 'Внешние ссылки', 'Глубина вложенности страницы']
    }
  ];

  // Условный пример: показывает вид отчёта, а не данные реального сайта.
  const demoResults = [
    { issue: 'Отсутствуют title теги', priority: 'Критично', pages: 12 },
    { issue: 'Медленный ответ сервера', priority: 'Высокий', pages: 8 },
    { issue: 'Нет alt атрибутов у изображений', priority: 'Средний', pages: 156 },
    { issue: 'Дублированные meta описания', priority: 'Средний', pages: 23 },
    { issue: 'Страницы с малым объёмом текста', priority: 'Низкий', pages: 45 }
  ];

  return (
    <Layout>
      <PageSeo
        title="SEO-аудит сайта: что проверяет сервис и как читать отчёт"
        description="Список проверок каждой страницы: код ответа, метатеги, заголовки, canonical, скорость ответа, сжатие, изображения без alt. Как устроен отчёт."
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Навигация */}
        <div className="mb-8">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>На главную</span>
          </Link>
        </div>

        {/* Шапка */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Проверка каждой страницы
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            SEO Аудит
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Сервис обходит страницы сайта и по каждой проверяет ответ сервера, метатеги, заголовки,
            индексацию, скорость и контент — и показывает, что исправить в первую очередь.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Link to="/audit">Запустить аудит</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/demo">Посмотреть демо</Link>
            </Button>
          </div>
        </motion.div>

        {/* Категории проверок */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Что мы проверяем</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Эти данные аудит собирает о каждой просканированной странице
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auditChecks.map((check, index) => {
              const IconComponent = check.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${check.color} bg-opacity-10`}>
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{check.category}</h3>
                      </div>

                      <ul className="space-y-2">
                        {check.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Табы с подробностями */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Результаты</TabsTrigger>
              <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
              <TabsTrigger value="reports">Отчеты</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Найденные проблемы (условный пример)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoResults.map((result, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={
                              result.priority === 'Критично' ? 'destructive' :
                              result.priority === 'Высокий' ? 'secondary' : 'outline'
                            }>
                              {result.priority}
                            </Badge>
                            <h4 className="font-semibold">{result.issue}</h4>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Страниц: {result.pages}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>С чего начать правки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Добавить недостающие title теги</h4>
                        <p className="text-sm text-muted-foreground">Без title страница хуже показывается в выдаче</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Ускорить ответ сервера</h4>
                        <p className="text-sm text-muted-foreground">Долгий ответ и отсутствие сжатия замедляют загрузку</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Добавить alt атрибуты к изображениям</h4>
                        <p className="text-sm text-muted-foreground">Описания помогают поисковикам понять содержимое картинок</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Где смотреть результаты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">Страница результатов</h4>
                      <p className="text-sm text-muted-foreground">Проблемы и данные по каждой странице</p>
                    </div>

                    <div className="p-4 border rounded-lg text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">PDF отчет</h4>
                      <p className="text-sm text-muted-foreground">Для печати и отправки клиенту</p>
                    </div>

                    <div className="p-4 border rounded-lg text-center">
                      <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">JSON</h4>
                      <p className="text-sm text-muted-foreground">Исходные данные для своей обработки</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    PDF и JSON выгружаются кнопками на странице результатов аудита. Проверок по
                    расписанию и уведомлений на почту сейчас нет.
                  </p>
                </CardContent>
              </Card>
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
          <Card className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Начните SEO аудит прямо сейчас</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Укажите адрес сайта — сервис просканирует страницы и покажет найденные ошибки.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600">
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

export default SeoAudit;
