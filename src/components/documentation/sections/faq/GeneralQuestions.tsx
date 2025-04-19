
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
          Что такое глубокий анализ сайта?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          <p>
            Глубокий анализ - это комплексное сканирование всех страниц сайта, которое включает:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Проверку структуры сайта</li>
            <li>Анализ контента на уникальность</li>
            <li>Поиск битых ссылок</li>
            <li>Проверку мета-тегов</li>
            <li>Анализ скорости загрузки</li>
            <li>Составление подробной сметы на исправление</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-left text-lg font-medium">
          Сколько времени занимает глубокий анализ?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          <p>
            Время анализа зависит от размера сайта:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>До 100 страниц: 5-15 минут</li>
            <li>100-1000 страниц: 15-30 минут</li>
            <li>Более 1000 страниц: от 30 минут</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default GeneralQuestions;
