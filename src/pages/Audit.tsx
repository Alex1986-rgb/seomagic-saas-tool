import React from 'react';
import Layout from '../components/Layout';

const Audit: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">SEO Аудит</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Комплексный анализ вашего сайта
        </p>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Запустить аудит</h2>
          <p className="text-muted-foreground">
            Введите URL вашего сайта для начала анализа
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Audit;