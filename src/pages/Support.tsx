
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, FileQuestion, Users, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Support = () => {
  const faqItems = [
    {
      question: 'Как начать использовать SeoMarket?',
      answer: 'Чтобы начать использовать SeoMarket, зарегистрируйтесь на нашем сайте, выберите подходящий тариф и следуйте инструкциям по настройке. После этого вы сможете добавить свой первый сайт для анализа.'
    },
    {
      question: 'Как часто обновляются данные о позициях?',
      answer: 'Частота обновления данных зависит от выбранного тарифа. В бесплатном тарифе - 1 раз в неделю, в базовом - 3 раза в неделю, в PRO тарифе - ежедневно, а в тарифе Агентство вы можете настроить частоту обновления.'
    },
    {
      question: 'Могу ли я отслеживать позиции в разных регионах?',
      answer: 'Да, SeoMarket позволяет отслеживать позиции сайта в разных регионах. Количество доступных регионов зависит от выбранного тарифа.'
    },
    {
      question: 'Как экспортировать отчеты?',
      answer: 'В разделе "Отчеты" выберите интересующий вас отчет и нажмите кнопку "Экспорт". Вы можете выбрать формат экспорта: PDF, CSV или Excel.'
    },
    {
      question: 'Как связаться с технической поддержкой?',
      answer: 'Вы можете связаться с технической поддержкой через форму на сайте, по электронной почте support@seomarket.ru или по телефону +7 (800) 123-45-67.'
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Поддержка клиентов
        </motion.h1>
        <p className="text-lg text-muted-foreground mb-12">
          Мы всегда готовы помочь вам с любыми вопросами о работе нашего сервиса
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="neo-card p-6 flex flex-col items-center text-center">
            <MessageCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Онлайн-чат</h3>
            <p className="text-muted-foreground mb-6">
              Получите мгновенную помощь от наших специалистов через онлайн-чат
            </p>
            <Button variant="outline" className="mt-auto">
              Начать чат
            </Button>
          </div>
          
          <div className="neo-card p-6 flex flex-col items-center text-center">
            <Mail className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email-поддержка</h3>
            <p className="text-muted-foreground mb-6">
              Напишите нам на адрес support@seomarket.ru, и мы ответим в течение 24 часов
            </p>
            <Button variant="outline" className="mt-auto">
              Написать письмо
            </Button>
          </div>
          
          <div className="neo-card p-6 flex flex-col items-center text-center">
            <Phone className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Телефонная поддержка</h3>
            <p className="text-muted-foreground mb-6">
              Позвоните нам по номеру +7 (800) 123-45-67 в рабочее время (9:00-18:00 МСК)
            </p>
            <Button variant="outline" className="mt-auto">
              Позвонить
            </Button>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Часто задаваемые вопросы</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <FileQuestion className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold">База знаний</h4>
              <p className="text-sm text-muted-foreground">Исчерпывающая документация по сервису</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Сообщество</h4>
              <p className="text-sm text-muted-foreground">Форум пользователей SeoMarket</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold">График работы</h4>
              <p className="text-sm text-muted-foreground">Пн-Пт: 9:00-18:00 МСК</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
