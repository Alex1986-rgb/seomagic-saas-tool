
import React from 'react';
import { GitBranch } from 'lucide-react';

const LocalSetup: React.FC = () => {
  return (
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
  );
};

export default LocalSetup;
