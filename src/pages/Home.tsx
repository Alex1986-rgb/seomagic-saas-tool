import React from 'react';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Добро пожаловать в SEO Market
        </h1>
        <p className="text-lg text-center text-muted-foreground">
          Профессиональные инструменты для SEO оптимизации и анализа сайтов
        </p>
      </div>
    </Layout>
  );
};

export default Home;