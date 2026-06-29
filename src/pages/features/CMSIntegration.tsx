
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plug, Target, CheckCircle, TrendingUp, Settings, Code, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CMSIntegration: React.FC = () => {
  const [selectedCMS, setSelectedCMS] = useState('wordpress');

  const supportedCMS = [
    {
      id: 'wordpress',
      name: 'WordPress',
      logo: '🪄',
      popularity: 95,
      features: ['Автоматический мониторинг', 'Плагин одним кликом', 'SEO рекомендации', 'Автообновления'],
      status: 'available'
    },
    {
      id: 'joomla',
      name: 'Joomla',
      logo: '🔧',
      popularity: 75,
      features: ['Компонент для админки', 'Автоматические отчеты', 'Интеграция с контентом'],
      status: 'available'
    },
    {
      id: 'drupal',
      name: 'Drupal',
      logo: '💧',
      popularity: 70,
      features: ['Модуль для Drupal', 'API интеграция', 'Контроль контента'],
      status: 'available'
    },
    {
      id: 'bitrix',
      name: '1C-Bitrix',
      logo: '🏢',
      popularity: 85,
      features: ['Компонент для админки', 'Интеграция с каталогом', 'Российская локализация'],
      status: 'available'
    },
    {
      id: 'tilda',
      name: 'Tilda',
      logo: '🎨',
      popularity: 60,
      features: ['Виджет для страниц', 'Мониторинг лендингов', 'Простая установка'],
      status: 'beta'
    },
    {
      id: 'shopify',
      name: 'Shopify',
      logo: '🛒',
      popularity: 80,
      features: ['Приложение для магазина', 'SEO товаров', 'Мониторинг продаж'],
      status: 'coming-soon'
    }
  ];

  const integrationFeatures = [
    {
      title: 'Автоматический мониторинг',
      description: 'Плагин автоматически отслеживает изменения на сайте',
      icon: Settings
    },
    {
      title: 'SEO рекомендации в админке',
      description: 'Получайте рекомендации прямо в панели управления CMS',
      icon: Target
    },
    {
      title: 'API для разработчиков',
      description: 'Полноценное API для создания собственных интеграций',
      icon: Code
    },
    {
      title: 'Готовые плагины',
      description: 'Установка одним кликом из репозитория CMS',
      icon: Download
    }
  ];

  const installationSteps = {
    wordpress: [
      'Перейдите в раздел "Плагины" → "Добавить новый"',
      'Найдите "SeoMarket SEO Audit"',
      'Нажмите "Установить" и "Активировать"',
      'Введите API ключ в настройках плагина',
      'Готово! Мониторинг активен'
    ],
    joomla: [
      'Скачайте компонент с официального сайта',
      'Установите через менеджер расширений',
      'Активируйте компонент в админке',
      'Настройте подключение к API',
      'Запустите первое сканирование'
    ],
    drupal: [
      'Скачайте модуль через Composer',
      'Активируйте модуль в админке',
      'Настройте права доступа',
      'Введите настройки API',
      'Настройте автоматические задачи'
    ],
    bitrix: [
      'Скачайте решение из Маркетплейса',
      'Установите через "Управление структурой"',
      'Настройте доступы пользователей',
      'Подключите API ключ',
      'Активируйте мониторинг сайта'
    ]
  };

  return (
    <Layout>
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
            <Badge variant="secondary" className="text-xs">
              Интеграции
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Интеграция с CMS</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Совместимость с популярными CMS-системами: WordPress, Joomla, Drupal, 1C-Bitrix и другими.
          </p>
        </motion.div>

        {/* Поддерживаемые CMS */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Поддерживаемые CMS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {supportedCMS.map((cms) => (
                  <motion.div
                    key={cms.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCMS === cms.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCMS(cms.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{cms.logo}</span>
                      <div>
                        <h4 className="font-semibold">{cms.name}</h4>
                        <Badge variant={
                          cms.status === 'available' ? 'default' :
                          cms.status === 'beta' ? 'secondary' : 'outline'
                        }>
                          {cms.status === 'available' ? 'Доступно' :
                           cms.status === 'beta' ? 'Бета' : 'Скоро'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Популярность:</span>
                        <span>{cms.popularity}%</span>
                      </div>
                      
                      <div className="space-y-1">
                        {cms.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {selectedCMS && installationSteps[selectedCMS as keyof typeof installationSteps] && (
                <motion.div
                  key={selectedCMS}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <h4 className="font-semibold mb-3">
                    Установка для {supportedCMS.find(cms => cms.id === selectedCMS)?.name}:
                  </h4>
                  <ol className="space-y-2 text-sm">
                    {installationSteps[selectedCMS as keyof typeof installationSteps].map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-5 h-5 bg-primary text-white text-xs rounded-full font-semibold">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Основной контент */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="features">Возможности</TabsTrigger>
              <TabsTrigger value="api">API документация</TabsTrigger>
              <TabsTrigger value="plugins">Плагины</TabsTrigger>
              <TabsTrigger value="support">Поддержка</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrationFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>REST API для разработчиков</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Базовый URL:</h5>
                      <code className="text-sm">https://api.seomarket.com/v1/</code>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-semibold">Основные эндпоинты:</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <code>POST /audit/start</code>
                          <span className="text-muted-foreground">Запуск аудита</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <code>GET /audit/{selectedCMS}/status</code>
                          <span className="text-muted-foreground">Статус проверки</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <code>GET /audit/{selectedCMS}/results</code>
                          <span className="text-muted-foreground">Результаты аудита</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <code>GET /positions/track</code>
                          <span className="text-muted-foreground">Отслеживание позиций</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">Аутентификация:</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Используйте API ключ в заголовке Authorization:
                      </p>
                      <code className="text-xs bg-muted p-2 rounded block">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="plugins" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>WordPress плагин</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Версия:</span>
                        <Badge>v2.1.3</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Установок:</span>
                        <span className="text-sm font-semibold">10,000+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Рейтинг:</span>
                        <span className="text-sm">⭐⭐⭐⭐⭐ 4.9</span>
                      </div>
                      <Button className="w-full mt-4">Скачать плагин</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>1C-Bitrix компонент</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Версия:</span>
                        <Badge>v1.8.2</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Совместимость:</span>
                        <span className="text-sm">Bitrix 20+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Локализация:</span>
                        <span className="text-sm">RU/EN</span>
                      </div>
                      <Button className="w-full mt-4">Скачать компонент</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="support" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Техническая поддержка</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Документация</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Подробные инструкции по установке и настройке для каждой CMS
                      </p>
                      <Button variant="outline" size="sm">Открыть документацию</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Техническая поддержка</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Помощь с установкой и настройкой интеграций
                      </p>
                      <Button variant="outline" size="sm">Связаться с поддержкой</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Разработка под заказ</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Создание интеграции для вашей CMS или платформы
                      </p>
                      <Button variant="outline" size="sm">Заказать разработку</Button>
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
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Интегрируйте SeoMarket с вашей CMS</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Установите плагин для вашей CMS и получайте автоматические уведомления 
                о SEO проблемах прямо в панели управления сайтом.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Начать интеграцию</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/api-docs">API документация</Link>
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
