
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Search, TrendingUp } from "lucide-react";

/**
 * Здесь обещали «бесплатный доступ без ограничений в течение 7 дней» и
 * «бесплатный период для всех новых пользователей». Пробного периода нет:
 * оплата вообще не подключена, а каждая проверка — платные обращения к
 * поставщику выдачи. Обещание убрано.
 */
const PositionPricingCTA: React.FC = () => {
  return (
    <div className="bg-primary/10 rounded-lg p-8 md:p-12 text-center mb-10">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background mb-6">
        <Search className="h-4 w-4 text-primary" />
        <span className="font-medium">Начните отслеживать позиции прямо сейчас</span>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Улучшайте позиции вашего сайта <br />
        с помощью точной аналитики
      </h2>
      
      <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
        Проверьте, на каких местах сайт стоит в Яндексе и Google по вашим запросам. 
        Если нужен регулярный мониторинг большого объёма — оставьте заявку.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild>
          <Link to="/position-tracker" className="gap-2">
            <span>Проверить позиции</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button variant="outline" size="lg" asChild>
          <Link to="/contact" className="gap-2">
            <span>Оставить заявку</span>
            <TrendingUp className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PositionPricingCTA;
