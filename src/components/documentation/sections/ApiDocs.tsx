
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
        <p>Основные эндпоинты API:</p>
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-2 text-left">Эндпоинт</th>
              <th className="px-4 py-2 text-left">Метод</th>
              <th className="px-4 py-2 text-left">Описание</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-2"><code>/api/audit/start</code></td>
              <td className="px-4 py-2">POST</td>
              <td className="px-4 py-2">Запуск базового аудита</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>/api/deep-crawl/start</code></td>
              <td className="px-4 py-2">POST</td>
              <td className="px-4 py-2">Запуск глубокого анализа</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>/api/audit/results/{'{id}'}</code></td>
              <td className="px-4 py-2">GET</td>
              <td className="px-4 py-2">Получение результатов</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>/api/estimate</code></td>
              <td className="px-4 py-2">POST</td>
              <td className="px-4 py-2">Расчет сметы</td>
            </tr>
          </tbody>
        </table>
        <p>Пример использования API:</p>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`// Запуск глубокого анализа
const startDeepCrawl = async (url: string) => {
  const response = await fetch('/api/deep-crawl/start', {
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
