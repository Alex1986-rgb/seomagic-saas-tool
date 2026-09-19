import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, CheckCircle, Settings, Sparkles, Brain, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSeo from '@/components/seo/PageSeo';

/**
 * ИИ-оптимизация.
 *
 * Страница была витриной несуществующих результатов: «До 90% автоматизации»,
 * «156 автоматических исправлений», «2.3 сек», «99.8% точность», «ожидаемые
 * результаты» +150% трафика, +85% CTR, +40 позиций в ТОП-10, у примеров
 * «+85% кликабельность» и «+120% конверсия», в призыве — «в 10 раз быстрее с
 * гарантией качества». Ничего из этого не измерялось. Ещё обещались генерация
 * alt по содержимому картинок, внутренняя перелинковка, разметка Schema.org,
 * резервные копии и откат изменений на сайте — таких функций нет: сервис
 * готовит тексты, а на сайт их переносит владелец.
 *
 * Теперь описано то, что делает оптимизация на самом деле: по результатам
 * аудита языковая модель предлагает title, description, структуру заголовков и
 * правки текста. Кнопка «Посмотреть демо» ведёт на демо оптимизации.
 */
const AIOptimization: React.FC = () => {
  const aiFeatures = [
    {
      title: 'Title и meta description',
      description: 'ИИ анализирует страницу и предлагает новые заголовок и описание для выдачи',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Структура заголовков',
      description: 'Рекомендации по H1–H3: где заголовка не хватает, где их слишком много',
      icon: Settings,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Правки текста',
      description: 'Предложения по улучшению текста страницы для лучшего ранжирования',
      icon: Brain,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const optimizationSteps = [
    {
      step: 1,
      title: 'Аудит сайта',
      description: 'Сервис обходит страницы и находит ошибки'
    },
    {
      step: 2,
      title: 'Расчёт стоимости',
      description: 'До запуска вы видите смету по страницам, которые нужно исправить'
    },
    {
      step: 3,
      title: 'Подготовка исправлений',
      description: 'ИИ пишет новые title, description и рекомендации по тексту'
    },
    {
      step: 4,
      title: 'Просмотр результата',
      description: 'Вы проверяете предложенные тексты и переносите их на сайт'
    }
  ];

  // Условные примеры: показывают вид правки, а не результат конкретного сайта.
  const beforeAfter = [
    {
      element: 'Title тег',
      before: 'Главная - Мой сайт',
      after: 'Ремонт квартир под ключ в Казани — смета и сроки | Мой сайт'
    },
    {
      element: 'Meta описание',
      before: 'Описание сайта',
      after: 'Ремонт квартир под ключ: замер, смета до начала работ, фотоотчёты по этапам. Оставьте заявку на расчёт.'
    },
    {
      element: 'H1 заголовок',
      before: 'Добро пожаловать',
      after: 'Ремонт квартир под ключ в Казани'
    }
  ];

  return (
    <Layout>
      <PageSeo
        title="ИИ-оптимизация контента: переписываем тексты страниц"
        description="Как нейросеть улучшает заголовки, описания и тексты страниц: что именно меняется, на каких данных и как проверить результат."
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
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 relative">
              <Zap className="h-8 w-8 text-purple-600" />
              <Sparkles className="h-4 w-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              Тексты готовит ИИ
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ИИ Оптимизация
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            По результатам аудита языковая модель предлагает новые title, description,
            структуру заголовков и правки текста для страниц с ошибками.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link to="/audit">Запустить ИИ оптимизацию</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/optimization-demo">Посмотреть демо</Link>
            </Button>
          </div>
        </motion.div>

        {/* ИИ возможности */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Возможности ИИ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ИИ готовит исправления для проблем, которые нашёл аудит
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardContent className="p-6 relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-10`}>
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Табы с процессом */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="process" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="process">Процесс</TabsTrigger>
              <TabsTrigger value="before-after">До и После</TabsTrigger>
              <TabsTrigger value="safety">Безопасность</TabsTrigger>
            </TabsList>

            <TabsContent value="process" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Этапы ИИ оптимизации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizationSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary/10 text-primary">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="before-after" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Примеры правок (условные)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {beforeAfter.map((example, index) => (
                      <motion.div
                        key={index}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{example.element}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <div className="text-xs text-red-600 font-medium mb-1">ДО:</div>
                            <div className="text-sm">{example.before}</div>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="text-xs text-green-600 font-medium mb-1">ПОСЛЕ:</div>
                            <div className="text-sm">{example.after}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Безопасность и контроль</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Сайт не меняется без вас</h4>
                        <p className="text-sm text-muted-foreground">Сервис не вносит правки на сайт сам: он готовит тексты, а переносите их вы</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Смета до запуска</h4>
                        <p className="text-sm text-muted-foreground">Оптимизация запускается только после расчёта стоимости</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Проверка перед переносом</h4>
                        <p className="text-sm text-muted-foreground">Предложенные тексты можно прочитать до того, как переносить их на сайт</p>
                      </div>
                    </div>
                  </div>
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
          <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-purple-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Исправьте найденные ошибки с помощью ИИ</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Запустите аудит сайта: по его результатам сервис рассчитает стоимость и подготовит
                новые тексты для страниц с ошибками.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Link to="/audit">Запустить ИИ оптимизацию</Link>
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

export default AIOptimization;
