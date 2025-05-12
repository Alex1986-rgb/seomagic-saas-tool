
import React from 'react';
import Layout from '@/components/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Часто задаваемые вопросы</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ответы на самые популярные вопросы о платформе SeoMarket
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Что такое SEO аудит сайта?</AccordionTrigger>
              <AccordionContent>
                SEO аудит сайта - это комплексный анализ веб-ресурса для выявления технических и контентных проблем, 
                которые могут влиять на его ранжирование в поисковых системах. Наша платформа автоматизирует этот 
                процесс, предоставляя подробный отчет о состоянии вашего сайта и рекомендации по его оптимизации.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Как отслеживать позиции сайта в поисковых системах?</AccordionTrigger>
              <AccordionContent>
                Для отслеживания позиций вашего сайта необходимо добавить домен и ключевые слова в 
                инструмент "Анализ позиций". Система будет регулярно проверять позиции вашего сайта по 
                выбранным ключевым словам и предоставлять актуальные данные в виде отчетов и графиков.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Что включает в себя демонстрация оптимизации?</AccordionTrigger>
              <AccordionContent>
                Демонстрация оптимизации показывает, как наша система может улучшить контент вашего сайта 
                для повышения его релевантности и привлекательности для поисковых систем. Вы сможете увидеть 
                примеры оптимизации мета-тегов, заголовков, текстов и структуры страниц.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Какие тарифные планы доступны?</AccordionTrigger>
              <AccordionContent>
                Мы предлагаем несколько тарифных планов, от базового до расширенного, которые 
                отличаются набором функций и количеством проектов. Подробную информацию о тарифах и 
                их стоимости вы можете найти на странице "Цены". Также доступны индивидуальные решения 
                для крупных проектов.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Как часто обновляются данные в отчетах?</AccordionTrigger>
              <AccordionContent>
                Частота обновления данных зависит от выбранного тарифного плана. В базовых тарифах 
                обновление происходит раз в неделю, в расширенных - ежедневно. Вы также можете запустить 
                обновление вручную в любое удобное время.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>Можно ли экспортировать отчеты?</AccordionTrigger>
              <AccordionContent>
                Да, все отчеты можно экспортировать в различных форматах: PDF, Excel, CSV и HTML. 
                Это позволяет вам сохранять данные для офлайн-анализа или делиться ими с коллегами 
                и клиентами.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger>Как использовать API платформы?</AccordionTrigger>
              <AccordionContent>
                Для использования нашего API необходимо получить API-ключ в личном кабинете. 
                Подробная документация по всем доступным методам и примеры их использования 
                представлены на странице "API Документация".
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
