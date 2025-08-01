import React from 'react';
import Layout from '../components/Layout';

const PositionPricing: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Тарифы на отслеживание позиций</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-lg border text-center">
            <h3 className="text-2xl font-bold mb-4">Стартовый</h3>
            <p className="text-3xl font-bold mb-6">$19 <span className="text-sm font-normal">/мес</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li>• 100 ключевых слов</li>
              <li>• Ежедневные проверки</li>
              <li>• 1 поисковая система</li>
            </ul>
          </div>
          <div className="bg-card p-8 rounded-lg border text-center border-primary">
            <h3 className="text-2xl font-bold mb-4">Расширенный</h3>
            <p className="text-3xl font-bold mb-6">$49 <span className="text-sm font-normal">/мес</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li>• 500 ключевых слов</li>
              <li>• Ежедневные проверки</li>
              <li>• 3 поисковые системы</li>
              <li>• Анализ конкурентов</li>
            </ul>
          </div>
          <div className="bg-card p-8 rounded-lg border text-center">
            <h3 className="text-2xl font-bold mb-4">Профессиональный</h3>
            <p className="text-3xl font-bold mb-6">$99 <span className="text-sm font-normal">/мес</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li>• 2000 ключевых слов</li>
              <li>• Ежедневные проверки</li>
              <li>• Все поисковые системы</li>
              <li>• API доступ</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PositionPricing;