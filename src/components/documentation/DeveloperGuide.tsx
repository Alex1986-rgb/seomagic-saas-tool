import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, GitBranch, PackageOpen, Server } from 'lucide-react';

const DeveloperGuide: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Руководство для разработчиков</h2>
        
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <Code className="h-5 w-5 mr-2 text-primary" />
              Структура проекта
            </h3>
            <div className="mt-4 space-y-4">
              <p>Проект SeoMarket организован по следующей структуре:</p>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`src/
├── components/        # Компоненты React
│   ├── audit/         # Компоненты для SEO аудита
│   ├── ui/            # UI компоненты (кнопки, формы и т.д.)
│   ├── navbar/        # Компоненты навигации
│   └── ...
├── pages/             # Страницы приложения
├── hooks/             # Пользовательские React хуки
├── contexts/          # React контексты
├── services/          # Сервисы для API и бизнес-логики
│   ├── api/           # API клиенты
│   ├── audit/         # Сервисы для аудита
│   └── ...
├── utils/             # Утилиты и хелперы
├── types/             # TypeScript типы и интерфейсы
└── styles/            # CSS стили`}
              </pre>
              <p>Основные технологии проекта:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS, Shadcn UI</li>
                <li><strong>State Management:</strong> React Context API, React Query</li>
                <li><strong>Роутинг:</strong> React Router</li>
                <li><strong>Анимация:</strong> Framer Motion</li>
                <li><strong>Визуализация данных:</strong> Recharts</li>
                <li><strong>Аутентификация:</strong> JWT</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <GitBranch className="h-5 w-5 mr-2 text-primary" />
              Настройка локальной среды разработки
            </h3>
            <div className="mt-4 space-y-4">
              <p>Для настройки проекта локально выполните следующие шаги:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Клонируйте репозиторий: <code>git clone https://github.com/your-repo/seomarket.git</code></li>
                <li>Перейдите в директорию проекта: <code>cd seomarket</code></li>
                <li>Установите зависимости: <code>npm install</code></li>
                <li>Запустите приложение в режиме разработки: <code>npm run dev</code></li>
              </ol>
              <p>Требования к среде разработки:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Node.js 16.x или выше</li>
                <li>npm 7.x или выше</li>
                <li>Git</li>
              </ul>
            </div>
          </section>
          
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
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <PackageOpen className="h-5 w-5 mr-2 text-primary" />
              Расширение функциональности
            </h3>
            <div className="mt-4 space-y-4">
              <p>Для добавления новых компонентов и функций следуйте этим рекомендациям:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Создавайте компоненты в соответствующих директориях (например, новый компонент аудита в <code>src/components/audit/</code>).</li>
                <li>Используйте типизацию TypeScript для всех новых компонентов и функций.</li>
                <li>Придерживайтесь существующего стиля кодирования и структуры проекта.</li>
                <li>Для стилей используйте Tailwind CSS классы.</li>
                <li>Документируйте новый функционал в JSDoc.</li>
              </ol>
              <p>Пример создания нового компонента:</p>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`// src/components/example/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  title: string;
  data: Array<{
    id: string;
    name: string;
  }>;
}

const NewComponent: React.FC<NewComponentProps> = ({ title, data }) => {
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default NewComponent;`}
              </pre>
            </div>
          </section>
          
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
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperGuide;
