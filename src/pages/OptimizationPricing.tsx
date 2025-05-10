
import React from 'react';
import Layout from '../components/Layout';
import { OptimizationPlans } from '../components/audit/results/components/optimization';

const OptimizationPricing: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Тарифы на оптимизацию сайта</h1>
        <p className="mb-8 text-muted-foreground">
          Выберите наиболее подходящий для вас тариф в зависимости от размера вашего сайта и необходимых услуг оптимизации.
        </p>
        
        <OptimizationPlans />
      </div>
    </Layout>
  );
};

export default OptimizationPricing;
