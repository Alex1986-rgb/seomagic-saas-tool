
import React from 'react';

const ApiDocs: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">API документация</h3>
      
      <p className="mb-4">
        SeoMarket предоставляет несколько API для интеграции функций SEO аудита и оптимизации в другие приложения.
      </p>
      
      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-medium mb-3">Аудит сайта API</h4>
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">POST /api/audit/scan</p>
            <p className="text-sm mb-2">Запускает полный SEO аудит сайта</p>
            
            <div className="text-sm mb-3">
              <p className="font-medium">Параметры запроса:</p>
              <ul className="pl-4 list-disc">
                <li><code>url</code> (обязательно) - URL сайта для аудита</li>
                <li><code>depth</code> (опционально) - Глубина сканирования (по умолчанию: 3)</li>
                <li><code>maxPages</code> (опционально) - Максимальное количество страниц (по умолчанию: 100)</li>
              </ul>
            </div>
            
            <div className="text-sm">
              <p className="font-medium">Пример ответа:</p>
              <pre className="bg-black/70 text-green-400 p-2 rounded overflow-auto text-xs">
{`{
  "taskId": "audit-123456",
  "status": "in-progress",
  "url": "https://example.com",
  "estimatedTime": 120
}`}
              </pre>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">Оптимизация сайта API</h4>
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">POST /api/optimize</p>
            <p className="text-sm mb-2">Запускает процесс оптимизации сайта</p>
            
            <div className="text-sm mb-3">
              <p className="font-medium">Параметры запроса:</p>
              <ul className="pl-4 list-disc">
                <li><code>auditId</code> (обязательно) - ID завершенного аудита</li>
                <li><code>options</code> (опционально) - Опции оптимизации</li>
                <li><code>prompt</code> (опционально) - Дополнительные инструкции для оптимизации</li>
              </ul>
            </div>
            
            <div className="text-sm">
              <p className="font-medium">Пример ответа:</p>
              <pre className="bg-black/70 text-green-400 p-2 rounded overflow-auto text-xs">
{`{
  "optimizationId": "opt-789012",
  "status": "processing",
  "estimatedCompletion": "2025-04-21T15:30:00Z",
  "cost": 1200
}`}
              </pre>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">Получение результатов API</h4>
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">GET /api/audit/results/{"{taskId}"}</p>
            <p className="text-sm mb-2">Получает результаты аудита по ID задачи</p>
            
            <div className="text-sm">
              <p className="font-medium">Параметры пути:</p>
              <ul className="pl-4 list-disc">
                <li><code>taskId</code> (обязательно) - ID задачи аудита</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">Авторизация API</h4>
          <p className="text-sm mb-3">
            Все API запросы должны содержать заголовок авторизации с API ключом:
          </p>
          <div className="bg-muted p-3 rounded-md mb-2">
            <code className="text-sm">Authorization: Bearer {"{ваш_api_ключ}"}</code>
          </div>
          <p className="text-sm">
            API ключи можно получить в панели администратора SeoMarket.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ApiDocs;
