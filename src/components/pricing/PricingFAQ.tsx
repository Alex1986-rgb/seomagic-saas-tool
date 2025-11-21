import React from 'react';
import { FAQSchema } from '@/components/seo/FAQSchema';

const PricingFAQ: React.FC = () => {
  const faqData = [
    {
      question: "Можно ли сменить тариф?",
      answer: "Да, вы можете изменить свой тариф в любое время. Изменения вступят в силу со следующего платежного периода."
    },
    {
      question: "Что произойдет если я превышу лимит?",
      answer: "При превышении лимитов вашего тарифа мы предложим вам обновить ваш план. Текущий анализ будет сохранен, но для продолжения работы потребуется выбрать более подходящий тариф."
    },
    {
      question: "Как происходит оплата?",
      answer: "Мы принимаем оплату банковскими картами, через электронные кошельки и банковским переводом. Для юридических лиц предоставляем все необходимые документы."
    },
    {
      question: "Есть ли скидки при оплате за год?",
      answer: "Да, при оплате за год вы получаете скидку 20% от общей стоимости."
    }
  ];

  return (
    <>
      <FAQSchema faqs={faqData} />
      <div className="max-w-3xl mx-auto mt-24">
        <h2 className="text-2xl font-bold text-center mb-10">Часто задаваемые вопросы</h2>
        
        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div key={index} className="neo-card p-6">
              <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default PricingFAQ;
