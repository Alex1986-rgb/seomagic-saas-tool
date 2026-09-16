
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, FileText, BarChart2, Settings, 
  PenTool, Share2, HelpCircle, BookOpen
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

/**
 * Кнопка «Скачать полное руководство (PDF)» и ссылки «Подробнее» под каждым
 * пунктом ничего не делали: PDF-руководства нет, отдельных статей под пункты
 * тоже. Плитки внизу выглядели кликабельными, но никуда не вели, а среди них
 * были «Вебинары», которых нет. Кнопку и «Подробнее» убрали, плитки стали
 * ссылками на существующие разделы. Пункты про сравнение с конкурентами и
 * оповещения об изменении позиций заменены: таких функций в трекере нет.
 */
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
        { title: "Яндекс и Google", content: "Как проверить позиции в одной поисковой системе или сразу в обеих." },
        { title: "Регион и глубина проверки", content: "Как выбрать регион выдачи и на какую глубину искать сайт в результатах поиска." }
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
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
        {[
          { icon: <PenTool className="w-5 h-5" />, label: "Руководства", to: "/guides" },
          { icon: <BookOpen className="w-5 h-5" />, label: "Документация", to: "/documentation" },
          { icon: <HelpCircle className="w-5 h-5" />, label: "FAQ", to: "/faq" },
          { icon: <Share2 className="w-5 h-5" />, label: "Поддержка", to: "/support" }
        ].map((item) => (
          <motion.div
            key={item.to}
            whileHover={{ y: -5 }}
          >
            <Link
              to={item.to}
              className="flex flex-col items-center gap-2 p-4 border rounded-lg text-center hover:border-primary/50 transition-colors"
            >
              <div className="p-3 rounded-full bg-primary/10">{item.icon}</div>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DemoUserGuide;
