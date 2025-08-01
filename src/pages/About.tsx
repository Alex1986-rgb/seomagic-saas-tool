import React from 'react';
import Layout from '../components/Layout';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">О нас</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            SEO Market - это современная платформа для комплексного анализа и оптимизации веб-сайтов.
          </p>
          <p className="mb-4">
            Мы предоставляем профессиональные инструменты для:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Полного аудита SEO</li>
            <li>Анализа технических характеристик</li>
            <li>Отслеживания позиций</li>
            <li>Мониторинга конкурентов</li>
            <li>Автоматической оптимизации</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default About;