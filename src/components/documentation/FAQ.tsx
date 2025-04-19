
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion } from "@/components/ui/accordion";
import GeneralQuestions from './sections/faq/GeneralQuestions';
import TechnicalQuestions from './sections/faq/TechnicalQuestions';

const FAQ: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <GeneralQuestions />
          <TechnicalQuestions />
        </Accordion>
        
        <div className="mt-12 p-4 bg-primary/10 border border-primary/30 rounded-md text-center">
          <p className="font-medium">Не нашли ответ на свой вопрос?</p>
          <p className="mt-2">
            Свяжитесь с нашей службой поддержки по адресу 
            <a href="mailto:support@seomarket.ru" className="text-primary underline">support@seomarket.ru</a> 
            или воспользуйтесь <a href="/contact" className="text-primary underline">формой обратной связи</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;
