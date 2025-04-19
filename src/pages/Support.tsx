import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Mail, MessageSquare, Phone, Search } from 'lucide-react';
import Layout from '@/components/Layout';

const Support: React.FC = () => {
  const faqItems = [
    {
      question: "Как начать использовать SeoMarket?",
      answer: "Для начала работы зарегистрируйтесь на платформе, выберите подходящий тариф (включая бесплатный пробный период), и вы сразу получите доступ к базовым инструментам аудита и отслеживания позиций. Подробное руководство по началу работы доступно в разделе Руководства."
    },
    {
      question: "Какие типы аудита доступны на платформе?",
      answer: "SeoMarket предлагает несколько типов аудита: базовый технический аудит, полный SEO аудит, аудит контента, анализ ссылочной массы, проверка скорости и мобильной оптимизации. Каждый тип можно настроить под ваши конкретные потребности."
    },
    {
      question: "Как часто обновляются данные о позициях?",
      answer: "В зависимости от выбранного тарифа, данные о позициях могут обновляться ежедневно, два раза в неделю или еженедельно. Пользователи премиум-тарифов также могут настроить уведомления об изменениях позиций в режиме реального времени."
    },
    {
      question: "Можно ли экспортировать отчеты?",
      answer: "Да, все отчеты можно экспортировать в форматах PDF, CSV, Excel или HTML. Также доступна функция автоматической отправки отчетов на email с выбранной периодичностью."
    },
    {
      question: "Сколько сайтов я могу отслеживать?",
      answer: "Количество отслеживаемых сайтов зависит от выбранного тарифа. На бесплатном тарифе доступен один сайт, на профессиональном - до 5 сайтов, на бизнес-тарифе - до 20 сайтов. Для крупных компаний доступны индивидуальные решения."
    },
    {
      question: "Как сравнивать результаты аудита в динамике?",
      answer: "На платформе есть инструмент сравнения аудитов, который позволяет выбрать два или более отчета по одному сайту и визуально сравнить изменения по всем параметрам. Также доступны графики изменений ключевых метрик за выбранный период."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Поддержка</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Мы всегда готовы помочь вам разобраться с любыми вопросами по использованию платформы
            </p>
          </motion.div>
          
          <div className="relative mx-auto max-w-2xl mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Поиск по базе знаний..." 
                className="pl-12 py-6 text-lg"
              />
              <Button className="absolute right-1.5 top-1.5">
                Найти
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Популярные запросы: настройка аудита, отслеживание позиций, экспорт отчетов
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="neo-card">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Онлайн чат</CardTitle>
                <CardDescription>Мгновенная помощь от наших специалистов</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Доступен 24/7 для всех пользователей премиум-тарифов. Время ответа: до 5 минут.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Начать чат</Button>
              </CardFooter>
            </Card>
            
            <Card className="neo-card">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Email поддержка</CardTitle>
                <CardDescription>Напишите нам о вашем вопросе</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Отправьте подробное описание проблемы, и мы ответим в течение 24 часов.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Написать письмо</Button>
              </CardFooter>
            </Card>
            
            <Card className="neo-card">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Phone className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Телефонная поддержка</CardTitle>
                <CardDescription>Поговорите с нашими специалистами</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Доступна с 9:00 до 18:00 по московскому времени в рабочие дни.
                </p>
                <p className="font-medium">+7 (800) 123-45-67</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Заказать звонок</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Часто задаваемые вопросы</h2>
              <p className="text-muted-foreground mt-2">Быстрые ответы на распространенные вопросы</p>
            </div>
            
            <Tabs defaultValue="general" className="w-full mb-8">
              <TabsList className="w-full flex justify-center flex-wrap">
                <TabsTrigger value="general">Общие вопросы</TabsTrigger>
                <TabsTrigger value="audit">Аудит сайта</TabsTrigger>
                <TabsTrigger value="positions">Отслеживание позиций</TabsTrigger>
                <TabsTrigger value="account">Аккаунт и оплата</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <span>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-7">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">Показать больше вопросов</Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Не нашли ответ на свой вопрос?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Наша команда поддержки готова помочь вам с любыми вопросами по использованию платформы
            </p>
            <Button size="lg">Связаться с поддержкой</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
