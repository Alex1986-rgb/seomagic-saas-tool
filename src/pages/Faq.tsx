
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Search, 
  CreditCard, 
  Settings, 
  BarChart3, 
  Shield,
  Users,
  Zap
} from 'lucide-react';

const Faq: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все вопросы', icon: HelpCircle },
    { id: 'general', name: 'Общие', icon: Settings },
    { id: 'pricing', name: 'Тарифы', icon: CreditCard },
    { id: 'features', name: 'Функции', icon: BarChart3 },
    { id: 'technical', name: 'Технические', icon: Zap },
    { id: 'security', name: 'Безопасность', icon: Shield },
    { id: 'team', name: 'Команда', icon: Users },
  ];

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: 'Что такое SEO аудит и зачем он нужен?',
      answer: 'SEO аудит — это комплексный анализ сайта, который помогает выявить проблемы, мешающие продвижению в поисковых системах. Аудит включает проверку технических аспектов, контента, структуры сайта, мета-тегов и других факторов ранжирования. Результаты аудита помогают улучшить видимость сайта в поисковой выдаче и увеличить органический трафик.'
    },
    {
      id: 2,
      category: 'general',
      question: 'Как быстро я получу результаты анализа?',
      answer: 'Время анализа зависит от размера сайта. Базовый анализ небольшого сайта (до 100 страниц) занимает 2-5 минут. Глубокий анализ крупного сайта (1000+ страниц) может занять до 30 минут. Вы получите уведомление на email сразу после завершения анализа.'
    },
    {
      id: 3,
      category: 'pricing',
      question: 'Можно ли использовать платформу бесплатно?',
      answer: 'Да! В бесплатном тарифе доступно 3 анализа в месяц с базовым функционалом. Этого достаточно для знакомства с платформой и анализа небольших проектов. Для расширенного функционала и большего количества анализов доступны платные тарифы.'
    },
    {
      id: 4,
      category: 'pricing',
      question: 'Как происходит оплата и можно ли отменить подписку?',
      answer: 'Оплата производится ежемесячно или ежегодно банковской картой через защищённый платёжный шлюз. Подписку можно отменить в любой момент в личном кабинете. При отмене доступ к платным функциям сохраняется до конца оплаченного периода.'
    },
    {
      id: 5,
      category: 'pricing',
      question: 'Предоставляете ли вы возврат средств?',
      answer: 'Да, мы предоставляем полный возврат средств в течение 14 дней с момента оплаты, если сервис не был использован. Для возврата обратитесь в службу поддержки с указанием причины.'
    },
    {
      id: 6,
      category: 'features',
      question: 'Какие форматы экспорта отчётов поддерживаются?',
      answer: 'Отчёты можно экспортировать в следующих форматах: PDF (для презентаций), Excel/XLSX (для анализа данных), CSV (для импорта в другие системы), JSON (для разработчиков). Также доступен белый лейбл для агентств.'
    },
    {
      id: 7,
      category: 'features',
      question: 'Есть ли API для интеграции с другими системами?',
      answer: 'Да, мы предоставляем RESTful API для интеграции с CRM, аналитическими системами и другими инструментами. API доступен в тарифах Pro и Enterprise. Документация включает примеры кода и SDK для популярных языков программирования.'
    },
    {
      id: 8,
      category: 'features',
      question: 'Можно ли отслеживать позиции сайта в поисковых системах?',
      answer: 'Да, в платформе есть модуль мониторинга позиций. Вы можете отслеживать позиции по ключевым словам в Яндекс и Google, получать уведомления об изменениях и анализировать динамику продвижения с помощью графиков и отчётов.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'Какие типы сайтов можно анализировать?',
      answer: 'Платформа поддерживает анализ любых сайтов: одностраничные лендинги, многостраничные корпоративные сайты, интернет-магазины, блоги. Анализируются сайты на любых CMS (WordPress, 1C-Битрикс, Tilda и др.) и статические сайты.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'Поддерживается ли анализ сайтов на мобильных устройствах?',
      answer: 'Да, анализ включает проверку мобильной версии сайта: скорость загрузки на мобильных устройствах, адаптивность дизайна, удобство использования на смартфонах. Это критически важно, так как Google использует mobile-first индексацию.'
    },
    {
      id: 11,
      category: 'technical',
      question: 'Что делать если анализ не запускается или завис?',
      answer: 'Проверьте доступность сайта по URL, убедитесь что сайт не блокирует роботов через robots.txt. Если проблема сохраняется, обратитесь в техподдержку через чат или email. Мы оперативно решаем технические проблемы.'
    },
    {
      id: 12,
      category: 'security',
      question: 'Как обеспечивается безопасность данных?',
      answer: 'Мы используем SSL шифрование для всех передач данных, храним данные на защищённых серверах в России, регулярно создаём резервные копии. Соблюдаем требования GDPR и российского законодательства о персональных данных.'
    },
    {
      id: 13,
      category: 'security',
      question: 'Кто имеет доступ к результатам моих анализов?',
      answer: 'Доступ к вашим данным имеете только вы и пользователи, которых вы пригласили в команду. Наши сотрудники могут получить доступ только для технической поддержки и только с вашего согласия. Данные не передаются третьим лицам.'
    },
    {
      id: 14,
      category: 'team',
      question: 'Как пригласить коллег для совместной работы?',
      answer: 'В тарифах Pro и Enterprise доступна командная работа. Перейдите в раздел "Команда" в личном кабинете, нажмите "Пригласить пользователя", укажите email и назначьте роль (администратор, аналитик, просмотр). Приглашённый пользователь получит email с инструкциями.'
    },
    {
      id: 15,
      category: 'team',
      question: 'Какие роли доступны для участников команды?',
      answer: 'Доступны три роли: Администратор (полный доступ), Аналитик (создание анализов, просмотр всех данных), Просмотр (только просмотр готовых отчётов). Роли можно изменять в любое время в настройках команды.'
    }
  ];

  const filteredFaq = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Helmet>
        <title>Часто задаваемые вопросы | SEO Platform</title>
        <meta name="description" content="Ответы на часто задаваемые вопросы о нашей SEO платформе. Узнайте как пользоваться сервисом, тарифах и возможностях." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <HelpCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Часто задаваемые вопросы
            </h1>
            <p className="text-xl text-muted-foreground">
              Найдите ответы на популярные вопросы о нашей SEO платформе
            </p>
          </div>

          {/* Поиск */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по вопросам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Категории */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Результаты поиска */}
          {searchTerm && (
            <div className="mb-6">
              <p className="text-muted-foreground">
                Найдено {filteredFaq.length} {filteredFaq.length === 1 ? 'результат' : 'результатов'} 
                {searchTerm && ` по запросу "${searchTerm}"`}
              </p>
            </div>
          )}

          {/* FAQ Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Ответы на вопросы</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFaq.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaq.map((item) => (
                    <AccordionItem key={item.id} value={`item-${item.id}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
                  <p className="text-muted-foreground">
                    Попробуйте изменить поисковый запрос или выбрать другую категорию
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Блок помощи */}
          <Card className="mt-12">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Не нашли ответ на свой вопрос?</h3>
              <p className="text-muted-foreground mb-6">
                Наша команда поддержки готова помочь вам с любыми вопросами
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-center">
                  <p className="font-medium">Email поддержка</p>
                  <p className="text-primary">support@seoplatform.com</p>
                  <p className="text-sm text-muted-foreground">Ответ в течение 24 часов</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Онлайн чат</p>
                  <p className="text-primary">Доступен в интерфейсе</p>
                  <p className="text-sm text-muted-foreground">пн-пт 9:00-18:00 МСК</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
