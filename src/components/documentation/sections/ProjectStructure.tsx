
import React from 'react';
import { Code } from 'lucide-react';

const ProjectStructure: React.FC = () => {
  return (
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
  );
};

export default ProjectStructure;
