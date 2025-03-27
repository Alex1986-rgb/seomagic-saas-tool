
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PositionPricingFAQ: React.FC = () => {
  const faqs = [
    {
      question: "Как часто обновляются данные о позициях?",
      answer: "Частота обновления данных зависит от выбранного тарифного плана. В базовом плане позиции обновляются раз в неделю, в стандартном - три раза в неделю, в профессиональном - ежедневно. В индивидуальном плане частота может быть настроена под ваши потребности."
    },
    {
      question: "Какие поисковые системы поддерживаются?",
      answer: "Сервис поддерживает мониторинг позиций в Яндекс, Google, Mail.ru, Bing и других поисковых системах. Вы можете выбрать, в каких поисковиках отслеживать позиции в зависимости от целевой аудитории вашего сайта."
    },
    {
      question: "Как происходит добавление ключевых слов для мониторинга?",
      answer: "Вы можете добавить ключевые слова вручную, загрузить их из CSV/Excel файла или импортировать из Яндекс.Метрики, Google Analytics, Яндекс.Вебмастера и других сервисов. Также есть возможность группировать ключевые слова по категориям для удобства анализа."
    },
    {
      question: "Можно ли проверять позиции для разных регионов?",
      answer: "Да, сервис позволяет проверять позиции с учетом региональной выдачи. Количество доступных регионов зависит от тарифного плана. Вы можете отслеживать позиции как для крупных городов, так и для небольших населенных пунктов."
    },
    {
      question: "Как настроить уведомления об изменении позиций?",
      answer: "В личном кабинете вы можете настроить уведомления о значительных изменениях позиций - росте или падении на заданное количество пунктов, выходе в ТОП-10, выпадении из индекса и других событиях. Уведомления могут приходить на email или в личный кабинет."
    },
    {
      question: "Есть ли возможность сравнения с конкурентами?",
      answer: "Да, в тарифах Стандарт и выше доступна функция сравнения позиций с конкурентами. Вы можете добавить до 5 конкурентов (в зависимости от плана) и отслеживать, как меняются их позиции относительно вашего сайта."
    },
    {
      question: "Как работает API для получения данных о позициях?",
      answer: "API доступен в тарифах Профессионал и Индивидуальный. Он позволяет получать данные о позициях программным путем и интегрировать их в ваши системы аналитики или отчетности. API предоставляет доступ к текущим позициям, истории изменений и другим данным."
    },
    {
      question: "Можно ли поменять тарифный план?",
      answer: "Да, вы можете изменить тарифный план в любое время. При переходе на более дорогой план изменения вступают в силу немедленно, при переходе на более дешевый план - с начала следующего расчетного периода."
    }
  ];

  return (
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
  );
};

export default PositionPricingFAQ;
