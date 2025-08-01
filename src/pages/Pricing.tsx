import React from 'react';
import Layout from '../components/Layout';

const Pricing: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Тарифы</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-lg border text-center">
            <h3 className="text-2xl font-bold mb-4">Базовый</h3>
            <p className="text-3xl font-bold mb-6">$29 <span className="text-sm font-normal">/мес</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li>• 10 сайтов</li>
              <li>• Основной аудит</li>
              <li>• Email поддержка</li>
            </ul>
          </div>
          <div className="bg-card p-8 rounded-lg border text-center border-primary">
            <h3 className="text-2xl font-bold mb-4">Профессиональный</h3>
            <p className="text-3xl font-bold mb-6">$79 <span className="text-sm font-normal">/мес</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li>• 50 сайтов</li>
              <li>• Полный аудит</li>
              <li>• Отслеживание позиций</li>
              <li>• Приоритетная поддержка</li>
            </ul>
          </div>
          <div className="bg-card p-8 rounded-lg border text-center">
            <h3 className="text-2xl font-bold mb-4">Корпоративный</h3>
            <p className="text-3xl font-bold mb-6">$199 <span className="text-sm font-normal">/мес</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li>• Безлимитные сайты</li>
              <li>• Все функции</li>
              <li>• API доступ</li>
              <li>• Персональный менеджер</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;