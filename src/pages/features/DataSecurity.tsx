
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, CheckCircle, TrendingUp, Eye, Server, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DataSecurity: React.FC = () => {
  const securityFeatures = [
    {
      title: 'Шифрование данных',
      description: 'Все данные шифруются с использованием AES-256',
      icon: Lock,
      status: 'active'
    },
    {
      title: 'Безопасная передача',
      description: 'Использование HTTPS/TLS 1.3 для всех соединений',
      icon: Shield,
      status: 'active'
    },
    {
      title: 'Контроль доступа',
      description: 'Многофакторная аутентификация и управление правами',
      icon: Key,
      status: 'active'
    },
    {
      title: 'Изолированные серверы',
      description: 'Данные хранятся на изолированных серверах',
      icon: Server,
      status: 'active'
    }
  ];

  const compliance = [
    {
      standard: 'GDPR',
      description: 'Соответствие Европейскому регламенту защиты данных',
      status: 'certified'
    },
    {
      standard: 'ISO 27001',
      description: 'Стандарт информационной безопасности',
      status: 'certified'
    },
    {
      standard: 'SOC 2 Type II',
      description: 'Аудит безопасности и доступности',
      status: 'certified'
    },
    {
      standard: 'РФ 152-ФЗ',
      description: 'Российский закон о персональных данных',
      status: 'certified'
    }
  ];

  const dataProcessing = [
    {
      type: 'URL и домены',
      description: 'Анализируемые веб-адреса',
      retention: '30 дней',
      encryption: true
    },
    {
      type: 'Результаты аудита',
      description: 'Отчеты и рекомендации',
      retention: '1 год',
      encryption: true
    },
    {
      type: 'Метаданные',
      description: 'Техническая информация о проверках',
      retention: '90 дней',
      encryption: true
    },
    {
      type: 'Аналитика',
      description: 'Обезличенные данные использования',
      retention: '2 года',
      encryption: true
    }
  ];

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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Безопасность
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Безопасность данных</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Полная конфиденциальность и безопасность ваших данных с соблюдением международных стандартов и GDPR.
          </p>
        </motion.div>

        {/* Меры безопасности */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Меры безопасности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 border rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-3 rounded-full bg-green-100">
                      <feature.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{feature.title}</h4>
                        <Badge variant="default">Активно</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
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
          <Tabs defaultValue="compliance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="compliance">Соответствие</TabsTrigger>
              <TabsTrigger value="data-processing">Обработка данных</TabsTrigger>
              <TabsTrigger value="privacy">Конфиденциальность</TabsTrigger>
              <TabsTrigger value="transparency">Прозрачность</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Сертификации и соответствие стандартам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {compliance.map((item, index) => (
                      <motion.div
                        key={index}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.standard}</h4>
                          <Badge variant="default">Сертифицирован</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>Действующий сертификат</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data-processing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Типы обрабатываемых данных</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataProcessing.map((data, index) => (
                      <motion.div
                        key={index}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{data.type}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{data.description}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-muted-foreground">Хранение: {data.retention}</span>
                              {data.encryption && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <Lock className="h-3 w-3" />
                                  <span>Зашифровано</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Принципы конфиденциальности</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Минимизация данных</h4>
                        <p className="text-sm text-muted-foreground">Собираем только необходимые для анализа данные</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Ограниченное хранение</h4>
                        <p className="text-sm text-muted-foreground">Данные удаляются согласно политике хранения</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Право на удаление</h4>
                        <p className="text-sm text-muted-foreground">Возможность удалить все данные по запросу</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Согласие пользователя</h4>
                        <p className="text-sm text-muted-foreground">Явное согласие на обработку данных</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Отсутствие передачи третьим лицам</h4>
                        <p className="text-sm text-muted-foreground">Данные не передаются внешним организациям</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transparency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Прозрачность процессов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Что мы делаем с вашими данными</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Анализируем техническое состояние сайта</li>
                        <li>• Проверяем SEO-оптимизацию страниц</li>
                        <li>• Генерируем отчеты и рекомендации</li>
                        <li>• Предоставляем статистику использования</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Чего мы НЕ делаем</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Не продаем данные третьим лицам</li>
                        <li>• Не используем для рекламы</li>
                        <li>• Не передаем конкурентам</li>
                        <li>• Не храним дольше необходимого</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Контакты по вопросам безопасности</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Ответственный за защиту данных: security@seomarket.com</p>
                        <p>Горячая линия: +7 (495) 123-45-67</p>
                        <p>Время ответа: в течение 24 часов</p>
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
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ваши данные в безопасности</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Мы используем лучшие практики безопасности и соблюдаем все международные 
                стандарты защиты данных. Доверьте нам анализ вашего сайта.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Безопасный аудит</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/privacy">Политика конфиденциальности</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DataSecurity;
