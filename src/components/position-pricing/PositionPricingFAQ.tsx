import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQSchema } from '@/components/seo/FAQSchema';

/**
 * Ответы описывали сервис, которого нет: поддержку Mail.ru и Bing, импорт
 * запросов из Метрики и Вебмастера, уведомления на почту, API для тарифа
 * «Профессионал» и смену тарифа с расчётным периодом. Эти же ответы уходили в
 * разметку FAQ для поисковиков. Теперь ответы — по тому, как работает трекер:
 * Яндекс и Google, регион, глубина, запуск проверки вручную, оплата по заявке.
 */
const PositionPricingFAQ: React.FC = () => {
  const faqs = [
    {
      question: "Как часто обновляются данные о позициях?",
      answer: "Позиции снимаются в момент проверки: вы запускаете её в трекере, и результат сохраняется. Проверок по расписанию и уведомлений об изменениях сейчас нет — если нужен регулярный мониторинг, оставьте заявку."
    },
    {
      question: "Какие поисковые системы поддерживаются?",
      answer: "Яндекс и Google. Проверять можно по одной системе или по обеим сразу."
    },
    {
      question: "Как добавить ключевые слова для проверки?",
      answer: "Введите запросы в форме трекера вместе с доменом сайта. Импорта из Яндекс.Метрики, Google Analytics и других сервисов нет."
    },
    {
      question: "Можно ли проверять позиции для разных регионов?",
      answer: "Да. Для Яндекса указывается номер региона (например, 213 — Москва), для Google — код страны."
    },
    {
      question: "Что означает позиция 0?",
      answer: "Сайт не найден в просмотренной части выдачи. Глубина проверки — от 10 до 100 позиций."
    },
    {
      question: "Есть ли API для получения данных о позициях?",
      answer: "Публичного API сейчас нет. Результаты проверок сохраняются и видны в истории трекера позиций."
    },
    {
      question: "Как подключить тариф?",
      answer: "Оплата на сайте пока не подключена. Оставьте заявку на странице контактов — согласуем объём запросов, регионы и частоту проверок и выставим счёт."
    }
  ];

  return (
    <>
      <FAQSchema faqs={faqs} />
      <div className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-2">Часто задаваемые вопросы</h2>
      <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-12">
        Ответы на самые популярные вопросы о сервисе мониторинга позиций
      </p>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
    </>
  );
};

export default PositionPricingFAQ;
