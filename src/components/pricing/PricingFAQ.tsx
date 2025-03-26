
import React from 'react';

const PricingFAQ: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-24">
      <h2 className="text-2xl font-bold text-center mb-10">Часто задаваемые вопросы</h2>
      
      <div className="space-y-6">
        <div className="neo-card p-6">
          <h3 className="text-lg font-medium mb-2">Можно ли сменить тариф?</h3>
          <p className="text-muted-foreground">Да, вы можете изменить свой тариф в любое время. Изменения вступят в силу со следующего платежного периода.</p>
        </div>
        
        <div className="neo-card p-6">
          <h3 className="text-lg font-medium mb-2">Что произойдет если я превышу лимит?</h3>
          <p className="text-muted-foreground">При превышении лимитов вашего тарифа мы предложим вам обновить ваш план. Текущий анализ будет сохранен, но для продолжения работы потребуется выбрать более подходящий тариф.</p>
        </div>
        
        <div className="neo-card p-6">
          <h3 className="text-lg font-medium mb-2">Как происходит оплата?</h3>
          <p className="text-muted-foreground">Мы принимаем оплату банковскими картами, через электронные кошельки и банковским переводом. Для юридических лиц предоставляем все необходимые документы.</p>
        </div>
        
        <div className="neo-card p-6">
          <h3 className="text-lg font-medium mb-2">Есть ли скидки при оплате за год?</h3>
          <p className="text-muted-foreground">Да, при оплате за год вы получаете скидку 20% от общей стоимости.</p>
        </div>
      </div>
    </div>
  );
};

export default PricingFAQ;
