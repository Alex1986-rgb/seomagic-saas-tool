
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Partners: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Партнерская программа</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Развивайте свой бизнес вместе с SeoMarket. Мы предлагаем 
            различные варианты партнерства и взаимовыгодного сотрудничества.
          </p>
        </div>
        
        <Tabs defaultValue="agency" className="max-w-4xl mx-auto mb-16">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="agency">Для агентств</TabsTrigger>
            <TabsTrigger value="freelancer">Для фрилансеров</TabsTrigger>
            <TabsTrigger value="integration">Интеграции</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agency">
            <Card>
              <CardHeader>
                <CardTitle>Партнерская программа для агентств</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Наша партнерская программа для агентств предоставляет специальные условия использования 
                  платформы SeoMarket для работы с клиентами. Получите доступ к расширенному функционалу, 
                  брендированным отчетам и выгодным тарифам.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Преимущества:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Скидка до 30%</span> 
                      <p className="text-muted-foreground">На все тарифные планы в зависимости от объема использования</p>
                    </li>
                    <li>
                      <span className="font-medium">White Label</span> 
                      <p className="text-muted-foreground">Возможность использования платформы под вашим брендом</p>
                    </li>
                    <li>
                      <span className="font-medium">API доступ</span> 
                      <p className="text-muted-foreground">Полный доступ к API для интеграции с вашими системами</p>
                    </li>
                    <li>
                      <span className="font-medium">Выделенный менеджер</span> 
                      <p className="text-muted-foreground">Персональная поддержка и консультации по использованию платформы</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Стать партнером</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="freelancer">
            <Card>
              <CardHeader>
                <CardTitle>Программа для фрилансеров</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Идеальное решение для независимых SEO-специалистов и консультантов. Получите инструменты для 
                  эффективной работы с клиентами и создания профессиональных отчетов.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Преимущества:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Специальный тариф</span> 
                      <p className="text-muted-foreground">Доступ к профессиональным инструментам по сниженной цене</p>
                    </li>
                    <li>
                      <span className="font-medium">Экспорт отчетов</span> 
                      <p className="text-muted-foreground">Возможность экспорта отчетов в PDF с вашим логотипом</p>
                    </li>
                    <li>
                      <span className="font-medium">Обучающие материалы</span> 
                      <p className="text-muted-foreground">Доступ к расширенным обучающим материалам и вебинарам</p>
                    </li>
                    <li>
                      <span className="font-medium">Личный кабинет клиентов</span> 
                      <p className="text-muted-foreground">Создавайте аккаунты для ваших клиентов с ограниченным доступом</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Присоединиться к программе</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle>Интеграции и технологические партнерства</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Разрабатываете свой SEO-сервис или смежное решение? Интегрируйте наши технологии анализа и 
                  оптимизации сайтов в ваш продукт через наш API.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Возможности:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">API доступ</span> 
                      <p className="text-muted-foreground">Полный доступ к функционалу платформы через REST API</p>
                    </li>
                    <li>
                      <span className="font-medium">Техническая документация</span> 
                      <p className="text-muted-foreground">Подробная документация и примеры интеграции</p>
                    </li>
                    <li>
                      <span className="font-medium">Техническая поддержка</span> 
                      <p className="text-muted-foreground">Выделенная техническая поддержка для ваших разработчиков</p>
                    </li>
                    <li>
                      <span className="font-medium">Индивидуальные условия</span> 
                      <p className="text-muted-foreground">Возможность обсуждения индивидуальных условий интеграции</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Связаться с нами</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-accent/20 rounded-xl p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Наши партнеры</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Мы гордимся сотрудничеством с ведущими компаниями отрасли
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center h-16 bg-background/50 rounded-md">
              <div className="w-24 h-8 bg-muted/30"></div>
            </div>
            <div className="flex items-center justify-center h-16 bg-background/50 rounded-md">
              <div className="w-24 h-8 bg-muted/30"></div>
            </div>
            <div className="flex items-center justify-center h-16 bg-background/50 rounded-md">
              <div className="w-24 h-8 bg-muted/30"></div>
            </div>
            <div className="flex items-center justify-center h-16 bg-background/50 rounded-md">
              <div className="w-24 h-8 bg-muted/30"></div>
            </div>
            <div className="flex items-center justify-center h-16 bg-background/50 rounded-md">
              <div className="w-24 h-8 bg-muted/30"></div>
            </div>
            <div className="flex items-center justify-center h-16 bg-background/50 rounded-md">
              <div className="w-24 h-8 bg-muted/30"></div>
            </div>
            <div className="flex items-center justify-center h-16 bg-background/50 rounded-md">
              <div className="w-24 h-8 bg-muted/30"></div>
            </div>
            <div className="flex items-center justify-center h-16 bg-background/50 rounded-md">
              <div className="w-24 h-8 bg-muted/30"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;
