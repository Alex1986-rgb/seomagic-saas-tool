
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
          Какие проблемы выявляет глубокий анализ?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          <p>Глубокий анализ выявляет:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Технические ошибки (битые ссылки, дубли страниц)</li>
            <li>Проблемы с контентом (неуникальный текст, thin content)</li>
            <li>SEO-ошибки (отсутствие мета-тегов, Alt текстов)</li>
            <li>Проблемы структуры (глубина вложенности, orphaned pages)</li>
            <li>Ошибки в robots.txt и sitemap.xml</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-left text-lg font-medium">
          Как формируется смета на исправление?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          <p>
            Смета формируется автоматически на основе:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Количества и типов найденных ошибок</li>
            <li>Объема работ по их исправлению</li>
            <li>Сложности необходимых изменений</li>
            <li>Приоритетности исправлений</li>
          </ul>
          <p className="mt-2">
            После формирования сметы вы можете выбрать, какие ошибки исправить в первую очередь.
          </p>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default TechnicalQuestions;
