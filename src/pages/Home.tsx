
import React from 'react';
import Layout from '@/components/Layout';
import UrlForm from '@/components/url-form/UrlForm';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">SEO Анализ и Оптимизация</h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Получите полный аудит вашего сайта и рекомендации по улучшению SEO
          </p>
          
          <div className="mt-8">
            <UrlForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
