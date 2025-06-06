
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingCTA: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center mt-20 neo-card p-10">
      <h2 className="text-2xl font-bold mb-4">Остались вопросы?</h2>
      <p className="text-lg mb-6">Наша команда поддержки готова помочь вам выбрать оптимальное решение для ваших задач</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="default" size="lg" asChild>
          <Link to="/contact">Связаться с нами</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/demo">Запросить демо</Link>
        </Button>
      </div>
    </div>
  );
};

export default PricingCTA;
