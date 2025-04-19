
import React from 'react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const GeneralQuestions: React.FC = () => {
  return (
    <>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-left text-lg font-medium">
          Что такое SeoMarket и как он может помочь моему сайту?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          <p>
            SeoMarket — это комплексная платформа для SEO-аудита и оптимизации сайтов. 
            Наш сервис помогает выявить технические проблемы, недостатки контента и другие факторы, 
            которые могут негативно влиять на позиции вашего сайта в поисковых системах.
          </p>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-left text-lg font-medium">
          Сколько времени занимает полный SEO-аудит сайта?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          <p>
            Время аудита зависит от размера и сложности сайта. Для небольших сайтов (до 100 страниц) 
            базовый аудит обычно занимает 5-15 минут. Для средних сайтов (100-1000 страниц) — 15-30 минут.
          </p>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default GeneralQuestions;
