
import React from 'react';
import { DemonstrationPage } from '@/components/audit/results/components';
import Layout from '@/components/Layout';
import { Helmet } from 'react-helmet-async';

const OptimizationDemo: React.FC = () => {
  console.log("Rendering OptimizationDemo page");
  return (
    <Layout>
      <Helmet>
        <title>Демонстрация оптимизации | SeoMarket</title>
        <meta name="description" content="Демонстрация процесса оптимизации сайта и формирования сметы" />
      </Helmet>
      <div className="pt-16">
        <DemonstrationPage />
      </div>
    </Layout>
  );
};

export default OptimizationDemo;
