
import React from 'react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const TechnicalQuestions: React.FC = () => {
  return (
    <>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-left text-lg font-medium">
          Какие ошибки и проблемы может выявить SeoMarket?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          <p>SeoMarket выявляет широкий спектр SEO-проблем, включая:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Технические проблемы (битые ссылки, ошибки в robots.txt)</li>
            <li>Проблемы мета-данных (отсутствующие или дублирующиеся title и description)</li>
            <li>Проблемы контента (тонкий контент, дублированный контент)</li>
            <li>Проблемы с изображениями (отсутствие атрибутов alt)</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-left text-lg font-medium">
          Может ли SeoMarket автоматически исправить обнаруженные проблемы?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          <p>
            Да, SeoMarket предлагает функцию автоматической оптимизации, которая может исправить 
            многие обнаруженные проблемы.
          </p>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default TechnicalQuestions;
