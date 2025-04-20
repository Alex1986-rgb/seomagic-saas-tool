
import React from 'react';

const LocalSetup: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Локальная настройка и разработка</h3>
      
      <p className="mb-4">
        Для настройки SeoMarket на локальной машине для разработки выполните следующие шаги:
      </p>
      
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-lg font-medium mb-2">1. Клонирование репозитория</h4>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-sm">git clone https://github.com/seomarket-company/seomarket-saas.git</code>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">2. Установка зависимостей</h4>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-sm">cd seomarket-saas<br />npm install</code>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">3. Настройка переменных окружения</h4>
          <p className="text-sm mb-2">Создайте файл <code>.env.local</code> на основе <code>.env.example</code> с вашими ключами API:</p>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-sm">
              VITE_SUPABASE_URL=ваш_url<br />
              VITE_SUPABASE_ANON_KEY=ваш_ключ<br />
              VITE_AI_API_KEY=ваш_ключ_ai_api<br />
              VITE_ANALYTICS_KEY=ваш_ключ_аналитики<br />
              VITE_SEO_API_KEY=ваш_ключ_seo_api
            </code>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">4. Запуск проекта в режиме разработки</h4>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-sm">npm run dev</code>
          </div>
          <p className="text-sm mt-2">Приложение будет доступно по адресу <code>http://localhost:5173</code></p>
        </div>
      </div>
      
      <h4 className="text-lg font-medium mb-2">Структура базы данных</h4>
      <p className="mb-2">
        Проект использует Supabase для хранения данных. Основные таблицы:
      </p>
      
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><strong>audits</strong> - Результаты аудитов сайтов</li>
        <li><strong>sites</strong> - Информация о сайтах пользователей</li>
        <li><strong>optimizations</strong> - Данные и статусы оптимизаций</li>
        <li><strong>users</strong> - Профили пользователей</li>
        <li><strong>subscriptions</strong> - Информация о подписках пользователей</li>
      </ul>
      
      <h4 className="text-lg font-medium mb-2">Запуск тестов</h4>
      <div className="bg-muted p-3 rounded-md mb-4">
        <code className="text-sm">npm run test</code>
      </div>
      
      <p className="text-sm italic">
        Примечание: Для полноценной работы с API требуются действующие ключи API. Обратитесь к администратору проекта для получения тестовых ключей для разработки.
      </p>
    </section>
  );
};

export default LocalSetup;
