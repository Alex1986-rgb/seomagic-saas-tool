
import React from 'react';
import { Server } from 'lucide-react';

const ApiDocs: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold flex items-center">
        <Server className="h-5 w-5 mr-2 text-primary" />
        API и интеграции
      </h3>
      <div className="mt-4 space-y-4">
        <p>SeoMarket предоставляет следующие API эндпоинты:</p>
        <table className="min-w-full divide-y divide-gray-300 border border-border">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-2 text-left">Эндпоинт</th>
              <th className="px-4 py-2 text-left">Метод</th>
              <th className="px-4 py-2 text-left">Описание</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-2"><code>/api/audit</code></td>
              <td className="px-4 py-2">POST</td>
              <td className="px-4 py-2">Запуск SEO аудита для указанного URL</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>/api/audit/{'{auditId}' as string}</code></td>
              <td className="px-4 py-2">GET</td>
              <td className="px-4 py-2">Получение результатов аудита по ID</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>/api/optimize</code></td>
              <td className="px-4 py-2">POST</td>
              <td className="px-4 py-2">Запуск оптимизации сайта</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>/api/positions</code></td>
              <td className="px-4 py-2">POST</td>
              <td className="px-4 py-2">Добавление ключевых слов для отслеживания</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>/api/positions/{'{websiteId}' as string}</code></td>
              <td className="px-4 py-2">GET</td>
              <td className="px-4 py-2">Получение отслеживаемых позиций</td>
            </tr>
          </tbody>
        </table>
        <p>Примеры использования API:</p>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`// Запуск SEO аудита
const startAudit = async (url) => {
  const response = await fetch('/api/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ url })
  });
  return await response.json();
};`}
        </pre>
      </div>
    </section>
  );
};

export default ApiDocs;
