
import React from 'react';
import Layout from '../components/Layout';
import DemonstrationPage from '../components/audit/results/components/DemonstrationPage';
import PageSeo from '@/components/seo/PageSeo';

const OptimizationDemo: React.FC = () => {
  return (
    <Layout>
      <PageSeo
        title="Демо ИИ-оптимизации: как сервис переписывает тексты"
        description="Наглядный пример работы оптимизатора: что сервис меняет в заголовках, описаниях и текстах страниц и как это выглядит в отчёте."
      />
      <DemonstrationPage />
    </Layout>
  );
};

export default OptimizationDemo;
