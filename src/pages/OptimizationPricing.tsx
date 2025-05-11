
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { OptimizationPlans } from '@/features/audit/components/results/components/optimization';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const OptimizationPricing: React.FC = () => {
  const { toast } = useToast();
  
  const handleSelectPlan = (plan: string) => {
    toast({
      title: "Тариф выбран",
      description: `Вы выбрали тариф "${plan}". Перенаправление на страницу аудита.`,
    });
    
    // In a real implementation, you would redirect or perform some action
    setTimeout(() => {
      window.location.href = `/audit?plan=${plan}`;
    }, 1000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link to="/pricing">
              <ArrowLeft className="h-4 w-4" />
              Вернуться к тарифам
            </Link>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Тарифы на оптимизацию сайта</h1>
        <p className="mb-8 text-muted-foreground">
          Выберите наиболее подходящий для вас тариф в зависимости от размера вашего сайта и необходимых услуг оптимизации.
          Чем больше страниц в вашем проекте, тем выше скидка на услуги оптимизации.
        </p>
        
        <OptimizationPlans onSelectPlan={handleSelectPlan} />
      </div>
    </Layout>
  );
};

export default OptimizationPricing;
