
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, FileText, BarChart2, Settings, 
  Download, PenTool, Share2, Users, Bell, 
  CreditCard, HelpCircle, BookOpen
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const DemoUserGuide: React.FC = () => {
  const guideCategories = [
    {
      title: "Начало работы",
      icon: <Search className="w-5 h-5 text-primary" />,
      items: [
        { title: "Регистрация и вход в систему", content: "Подробная инструкция по созданию учетной записи и входу в личный кабинет SeoMarket." },
        { title: "Добавление сайта для анализа", content: "Как добавить ваш сайт в систему и настроить параметры анализа." },
        { title: "Проведение первого аудита", content: "Пошаговая инструкция по запуску и настройке первого SEO-аудита вашего сайта." },
        { title: "Интерфейс панели управления", content: "Обзор основных разделов панели управления и их функциональности." }
      ]
    },
    {
      title: "Анализ и отчеты",
      icon: <FileText className="w-5 h-5 text-primary" />,
      items: [
        { title: "Понимание общего SEO-рейтинга", content: "Как интерпретировать общий SEO-рейтинг сайта и что он означает для вашего бизнеса." },
        { title: "Анализ технических проблем", content: "Подробное руководство по выявлению и устранению технических проблем сайта." },
        { title: "Контент-анализ", content: "Как анализировать и оптимизировать контент сайта для улучшения ранжирования." },
        { title: "Создание и экспорт отчетов", content: "Инструкция по созданию и экспорту детальных отчетов для клиентов или руководства." }
      ]
    },
    {
      title: "Мониторинг позиций",
      icon: <BarChart2 className="w-5 h-5 text-primary" />,
      items: [
        { title: "Настройка отслеживания ключевых слов", content: "Как добавить и настроить отслеживание позиций по важным для вас ключевым словам." },
        { title: "Анализ динамики позиций", content: "Интерпретация графиков и данных по изменению позиций сайта в поисковых системах." },
        { title: "Сравнение с конкурентами", content: "Как сравнивать позиции вашего сайта с конкурентами в одной нише." },
        { title: "Настройка оповещений", content: "Настройка автоматических уведомлений при изменении позиций или появлении новых возможностей." }
      ]
    },
    {
      title: "Оптимизация сайта",
      icon: <Settings className="w-5 h-5 text-primary" />,
      items: [
        { title: "Автоматическая оптимизация", content: "Как запустить и настроить процесс автоматической оптимизации сайта." },
        { title: "Ручное внедрение рекомендаций", content: "Пошаговые инструкции по внедрению рекомендаций по оптимизации вручную." },
        { title: "Оптимизация мета-тегов", content: "Руководство по оптимизации заголовков, описаний и других мета-тегов." },
        { title: "Улучшение структуры сайта", content: "Как оптимизировать структуру сайта для лучшей индексации поисковыми системами." }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Руководство пользователя</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Подробные инструкции по использованию всех возможностей платформы SeoMarket
        </p>
        <Button className="gap-2 mb-8">
          <Download className="w-4 h-4" /> Скачать полное руководство (PDF)
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {guideCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              {category.icon}
              <h3 className="text-xl font-semibold">{category.title}</h3>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {category.items.map((item, itemIndex) => (
                <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                  <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.content}</p>
                    <Button variant="link" className="p-0 mt-2">Подробнее</Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-10">
        {[
          { icon: <PenTool className="w-5 h-5" />, label: "Руководства" },
          { icon: <BookOpen className="w-5 h-5" />, label: "Обучение" },
          { icon: <HelpCircle className="w-5 h-5" />, label: "FAQ" },
          { icon: <Users className="w-5 h-5" />, label: "Вебинары" },
          { icon: <Bell className="w-5 h-5" />, label: "Обновления" },
          { icon: <Share2 className="w-5 h-5" />, label: "Поддержка" }
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-2 p-4 border rounded-lg text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="p-3 rounded-full bg-primary/10">{item.icon}</div>
            <span className="text-sm font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DemoUserGuide;
