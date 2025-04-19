
import React from 'react';
import { Database } from 'lucide-react';

const TestingAndCICD: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold flex items-center">
        <Database className="h-5 w-5 mr-2 text-primary" />
        Тестирование и CI/CD
      </h3>
      <div className="mt-4 space-y-4">
        <p>SeoMarket использует следующие методы тестирования и CI/CD:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Unit-тесты:</strong> Jest для тестирования отдельных функций и компонентов.</li>
          <li><strong>Integration-тесты:</strong> React Testing Library для интеграционного тестирования компонентов.</li>
          <li><strong>E2E-тесты:</strong> Cypress для конечного тестирования пользовательских сценариев.</li>
          <li><strong>CI/CD:</strong> GitHub Actions для автоматического тестирования и деплоя.</li>
        </ul>
        <p>Для запуска тестов локально выполните:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>npm run test</code> — запуск unit-тестов</li>
          <li><code>npm run test:e2e</code> — запуск e2e-тестов</li>
          <li><code>npm run lint</code> — проверка кода на соответствие стандартам</li>
        </ul>
      </div>
    </section>
  );
};

export default TestingAndCICD;
