
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FeatureContentProps {
  icon: React.ElementType;
  title: string;
  content: string;
}

const FeatureContent = ({ icon: IconComponent, title, content }: FeatureContentProps) => {
  const paragraphs = content.split('\n\n').map((paragraph, index) => {
    if (paragraph.startsWith('###')) {
      const title = paragraph.replace('###', '').trim();
      return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{title}</h3>;
    }
    return <p key={index} className="mb-4 text-muted-foreground">{paragraph}</p>;
  });

  return (
    <motion.div 
      className="lg:col-span-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
            <IconComponent className="h-16 w-16 opacity-20" />
          </div>
        </AspectRatio>
        
        <CardContent className="p-6">
          <div className="prose max-w-none">
            {paragraphs}
          </div>
          
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="faq-1">
              <AccordionTrigger>Как начать использовать {title}?</AccordionTrigger>
              <AccordionContent>
                Чтобы начать использовать эту функцию, просто зарегистрируйтесь на нашей платформе, 
                добавьте свой сайт в систему и выберите соответствующую опцию в панели управления.
                Наша система автоматически проведет анализ и предоставит вам результаты.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger>Какие результаты можно ожидать?</AccordionTrigger>
              <AccordionContent>
                Большинство наших клиентов отмечают значительное улучшение позиций в поисковой 
                выдаче уже через 2-4 недели после внедрения рекомендаций системы. В среднем, 
                органический трафик вырастает на 35-50% в течение первых трех месяцев.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureContent;
