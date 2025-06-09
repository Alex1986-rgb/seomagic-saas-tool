
import React from 'react';

const LocalSetup: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Локальная настройка и разработка</h3>
      
      <p className="mb-6">
        Для настройки SeoMarket на локальной машине следуйте этому пошаговому руководству. 
        Поддерживаются два варианта: разработка в Lovable (рекомендуется) и локальная разработка.
      </p>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Рекомендуемый способ: Lovable</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Если вы работаете в Lovable, большинство настроек выполняется автоматически. 
          Просто нажмите зеленую кнопку "Supabase" для подключения backend-а.
        </p>
      </div>
      
      <div className="space-y-6 mb-6">
        <div>
          <h4 className="text-lg font-medium mb-3">📋 Предварительные требования</h4>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Node.js 18.0+ (рекомендуется последняя LTS версия)</li>
            <li>npm 8+ или yarn 1.22+</li>
            <li>Git для клонирования репозитория</li>
            <li>Аккаунт Supabase (для backend функций)</li>
            <li>Современный браузер (Chrome, Firefox, Safari, Edge)</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3">🔄 1. Клонирование репозитория</h4>
          <div className="bg-muted p-3 rounded-md mb-3">
            <code className="text-sm">
              git clone https://github.com/KyrlanAlanAlexandre/seomarket.git<br />
              cd seomarket
            </code>
          </div>
          <p className="text-sm text-muted-foreground">
            Альтернативно, вы можете форкнуть репозиторий для внесения собственных изменений.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">📦 2. Установка зависимостей</h4>
          <div className="bg-muted p-3 rounded-md mb-3">
            <code className="text-sm">
              # Проверка версии Node.js<br />
              node --version<br />
              # Должно быть 18.0.0 или выше<br /><br />
              
              # Установка зависимостей<br />
              npm install<br /><br />
              
              # Альтернативно с yarn<br />
              yarn install
            </code>
          </div>
          <p className="text-sm text-muted-foreground">
            Установка может занять несколько минут. При ошибках попробуйте очистить кэш: <code>npm cache clean --force</code>
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">⚙️ 3. Настройка переменных окружения</h4>
          
          <div className="mb-4">
            <h5 className="font-medium mb-2">Вариант A: Lovable (Рекомендуется)</h5>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm">
              <ol className="list-decimal pl-4 space-y-1">
                <li>Нажмите зеленую кнопку "Supabase" в правом верхнем углу Lovable</li>
                <li>Выберите "Connect existing project" или "Create new project"</li>
                <li>Следуйте инструкциям для подключения</li>
                <li>Все переменные окружения настроятся автоматически</li>
              </ol>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="font-medium mb-2">Вариант B: Локальная разработка</h5>
            <p className="text-sm mb-2">Создайте файл <code>.env.local</code> в корне проекта:</p>
            <div className="bg-muted p-3 rounded-md mb-3">
              <code className="text-sm">
                # Основные настройки Supabase<br />
                VITE_SUPABASE_URL=https://your-project-ref.supabase.co<br />
                VITE_SUPABASE_ANON_KEY=your-anon-key<br /><br />
                
                # Дополнительные API ключи (опционально)<br />
                VITE_OPENAI_API_KEY=your-openai-key<br />
                VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX<br />
                VITE_SENTRY_DSN=your-sentry-dsn
              </code>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-sm">
              <strong>⚠️ Важно:</strong> Никогда не коммитьте файлы с секретными ключами в Git. 
              Файл <code>.env.local</code> уже добавлен в <code>.gitignore</code>.
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Получение ключей Supabase</h5>
            <ol className="list-decimal pl-4 space-y-1 text-sm">
              <li>Зайдите в <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Dashboard</a></li>
              <li>Выберите ваш проект или создайте новый</li>
              <li>Перейдите в Settings → API</li>
              <li>Скопируйте "Project URL" и "anon public" ключ</li>
            </ol>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">🚀 4. Запуск проекта в режиме разработки</h4>
          <div className="bg-muted p-3 rounded-md mb-3">
            <code className="text-sm">
              # Запуск dev-сервера<br />
              npm run dev<br /><br />
              
              # Альтернативно с yarn<br />
              yarn dev<br /><br />
              
              # Запуск на другом порту<br />
              npm run dev -- --port 3000
            </code>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm">
            <strong>✅ Успех!</strong> Приложение будет доступно по адресу <code>http://localhost:5173</code><br />
            При изменении файлов страница автоматически перезагрузится.
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3">🔧 5. Дополнительные команды</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Разработка</h5>
              <div className="bg-muted p-3 rounded-md text-sm">
                <code>
                  npm run dev          # Dev-сервер<br />
                  npm run dev:host     # Доступ из сети<br />
                  npm run dev:https    # HTTPS для dev
                </code>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Сборка</h5>
              <div className="bg-muted p-3 rounded-md text-sm">
                <code>
                  npm run build        # Сборка для прода<br />
                  npm run preview      # Предпросмотр сборки<br />
                  npm run analyze      # Анализ bundle
                </code>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Качество кода</h5>
              <div className="bg-muted p-3 rounded-md text-sm">
                <code>
                  npm run lint         # ESLint проверка<br />
                  npm run lint:fix     # Исправление ошибок<br />
                  npm run type-check   # TypeScript проверка
                </code>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Тестирование</h5>
              <div className="bg-muted p-3 rounded-md text-sm">
                <code>
                  npm test             # Запуск тестов<br />
                  npm run test:watch   # Watch режим<br />
                  npm run test:coverage # Покрытие кода
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h4 className="text-lg font-medium mb-3">💾 Структура базы данных</h4>
      <p className="mb-3">
        Проект использует Supabase (PostgreSQL) для хранения данных. Основные таблицы автоматически создаются при первом запуске:
      </p>
      
      <div className="bg-muted/50 p-4 rounded-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Пользовательские данные:</strong>
            <ul className="list-disc pl-4 mt-1">
              <li><strong>profiles</strong> — Профили пользователей</li>
              <li><strong>subscriptions</strong> — Подписки и планы</li>
              <li><strong>user_settings</strong> — Настройки пользователей</li>
            </ul>
          </div>
          <div>
            <strong>SEO данные:</strong>
            <ul className="list-disc pl-4 mt-1">
              <li><strong>audits</strong> — Результаты SEO аудитов</li>
              <li><strong>sites</strong> — Информация о сайтах</li>
              <li><strong>optimizations</strong> — Данные оптимизаций</li>
              <li><strong>crawl_results</strong> — Результаты сканирования</li>
            </ul>
          </div>
        </div>
      </div>
      
      <h4 className="text-lg font-medium mb-3">🧪 Запуск тестов</h4>
      <div className="space-y-3 mb-4">
        <div>
          <h5 className="font-medium">Модульные тесты (Jest + React Testing Library)</h5>
          <div className="bg-muted p-3 rounded-md mb-2">
            <code className="text-sm">
              npm test                    # Одиночный запуск<br />
              npm run test:watch          # Watch режим<br />
              npm run test:coverage       # Покрытие кода
            </code>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium">E2E тесты (Playwright)</h5>
          <div className="bg-muted p-3 rounded-md mb-2">
            <code className="text-sm">
              npx playwright install      # Установка браузеров<br />
              npm run test:e2e           # E2E тесты<br />
              npm run test:e2e:ui        # Интерфейс Playwright
            </code>
          </div>
        </div>
      </div>
      
      <h4 className="text-lg font-medium mb-3">🐛 Решение частых проблем</h4>
      <div className="space-y-3 mb-4">
        <div className="border-l-4 border-red-500 pl-4">
          <strong>Ошибка: "Module not found"</strong><br />
          <span className="text-sm">Решение: <code>rm -rf node_modules package-lock.json && npm install</code></span>
        </div>
        
        <div className="border-l-4 border-yellow-500 pl-4">
          <strong>Ошибка: "Port already in use"</strong><br />
          <span className="text-sm">Решение: <code>npm run dev -- --port 3001</code> или завершите процесс на порту 5173</span>
        </div>
        
        <div className="border-l-4 border-blue-500 pl-4">
          <strong>Проблемы с Supabase подключением</strong><br />
          <span className="text-sm">Проверьте правильность URL и ключей в настройках Supabase</span>
        </div>
        
        <div className="border-l-4 border-green-500 pl-4">
          <strong>Медленная работа в dev-режиме</strong><br />
          <span className="text-sm">Попробуйте: <code>npm run dev -- --no-deps-pre-bundle</code></span>
        </div>
      </div>
      
      <p className="text-sm italic bg-muted/50 p-3 rounded-md">
        💡 <strong>Совет:</strong> Для продуктивной разработки рекомендуется использовать VSCode с расширениями: 
        ES7+ React/Redux/React-Native snippets, TypeScript Importer, Tailwind CSS IntelliSense, 
        ESLint, Prettier.
      </p>
    </section>
  );
};

export default LocalSetup;
