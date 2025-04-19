
import React from 'react';
import { PackageOpen } from 'lucide-react';

const ExtendingFunctionality: React.FC = () => {
  return (
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
  );
};

export default ExtendingFunctionality;
