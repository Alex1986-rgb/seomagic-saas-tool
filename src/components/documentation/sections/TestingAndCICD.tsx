
import React from 'react';

const TestingAndCICD: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Тестирование и CI/CD</h3>
      
      <p className="mb-4">
        Тестирование и процесс непрерывной интеграции/развертывания (CI/CD) необходимы для поддержания качества и стабильности SeoMarket.
      </p>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-2">Модульное тестирование</h4>
          <p className="text-sm mb-2">
            Мы используем Jest и React Testing Library для модульных тестов:
          </p>
          <div className="bg-muted p-3 rounded-md mb-3">
            <code className="text-sm">npm run test</code>
          </div>
          <p className="text-sm mb-2">
            Структура тестов:
          </p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-auto mb-3">
{`/src
  /__tests__            # Общие тесты
  /components
    /__tests__          # Тесты компонентов
  /hooks
    /__tests__          # Тесты хуков
  /services
    /__tests__          # Тесты сервисов`}
          </pre>
          <p className="text-sm mb-2">
            При написании новых компонентов или сервисов рекомендуется добавлять модульные тесты для проверки основной функциональности.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">Интеграционное тестирование</h4>
          <p className="text-sm mb-2">
            Интеграционные тесты используют Cypress для проверки взаимодействия компонентов:
          </p>
          <div className="bg-muted p-3 rounded-md mb-3">
            <code className="text-sm">npm run cy:run  # Запуск в терминале<br />npm run cy:open  # Открыть интерфейс Cypress</code>
          </div>
          <p className="text-sm">
            Ключевые сценарии тестирования включают процесс аудита, оптимизации и работу с пользовательским интерфейсом.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">CI/CD пайплайн</h4>
          <p className="text-sm mb-3">
            SeoMarket использует GitHub Actions для автоматизации CI/CD:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li><strong>CI Workflow</strong>: Выполняет модульные тесты, линтинг и проверку типов при каждом pull request</li>
            <li><strong>Staging Deployment</strong>: Автоматически развертывает изменения в ветке staging на тестовое окружение</li>
            <li><strong>Production Deployment</strong>: Развертывает изменения в ветке main на боевое окружение после ручного одобрения</li>
          </ul>
          <div className="bg-muted p-3 rounded-md mb-3 text-xs overflow-auto">
            <pre>
{`# Пример .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, staging, develop ]
  pull_request:
    branches: [ main, staging ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # Шаги деплоя на тестовое окружение

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      # Шаги деплоя на боевое окружение`}
            </pre>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">Советы по отладке</h4>
          <p className="text-sm mb-2">
            Отладка проблем в SeoMarket:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Используйте консоль браузера для отслеживания ошибок фронтенда</li>
            <li>Логи сервера доступны в Supabase Dashboard</li>
            <li>Включите подробное логирование, установив <code>DEBUG=true</code> в переменных окружения</li>
            <li>Используйте <code>localStorage.setItem('debug', 'true')</code> в консоли браузера для включения дополнительного логирования на фронтенде</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TestingAndCICD;
