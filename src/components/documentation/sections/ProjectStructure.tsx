
import React from 'react';
import { Code } from 'lucide-react';

const ProjectStructure: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold flex items-center">
        <Code className="h-5 w-5 mr-2 text-primary" />
        Структура проекта SeoMarket
      </h3>
      <div className="mt-4 space-y-4">
        <p>Проект SeoMarket организован по следующей современной архитектуре:</p>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`src/
├── components/        # React компоненты
│   ├── audit/        # Компоненты аудита сайта
│   ├── deep-crawl/   # Компоненты глубокого анализа
│   ├── ui/           # UI компоненты (кнопки, формы)
│   └── ...
├── pages/            # Страницы приложения
├── hooks/            # React хуки
├── services/         # Сервисы для API
│   ├── audit/        # Сервисы аудита
│   ├── crawler/      # Сервисы краулера
│   └── ...
├── utils/            # Утилиты
└── styles/           # CSS стили`}
        </pre>
        <p>Основные технологии:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Frontend:</strong> React + TypeScript</li>
          <li><strong>Стилизация:</strong> Tailwind CSS + Shadcn UI</li>
          <li><strong>Состояние:</strong> React Query</li>
          <li><strong>API:</strong> REST + WebSocket для realtime</li>
          <li><strong>Краулер:</strong> Собственный движок на TypeScript</li>
          <li><strong>Аналитика:</strong> Recharts для визуализации</li>
        </ul>
      </div>
    </section>
  );
};

export default ProjectStructure;
