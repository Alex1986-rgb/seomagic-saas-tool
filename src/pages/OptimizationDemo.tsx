
import React from 'react';
import Layout from '../components/Layout';
import { DemonstrationCost } from '../components/audit/results/components/optimization';

const OptimizationDemo: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Демонстрация работы оптимизации сайта</h1>
        <p className="mb-8 text-muted-foreground">
          Это демонстрационная страница для показа функционала оптимизации сайта. 
          Вы можете увидеть как выглядит интерфейс и процесс оптимизации.
        </p>
        
        <DemonstrationCost />
      </div>
    </Layout>
  );
};

export default OptimizationDemo;
