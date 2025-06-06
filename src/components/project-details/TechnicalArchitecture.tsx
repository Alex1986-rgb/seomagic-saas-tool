
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Database, 
  Cloud, 
  Globe, 
  Shield,
  Cpu,
  GitBranch,
  Package
} from 'lucide-react';

const TechnicalArchitecture: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Архитектура системы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Frontend Layer</h3>
                <p className="text-sm text-muted-foreground">React SPA с TypeScript</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Cloud className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">API Layer</h3>
                <p className="text-sm text-muted-foreground">Supabase Edge Functions</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Data Layer</h3>
                <p className="text-sm text-muted-foreground">PostgreSQL на Supabase</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Основные зависимости
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">@supabase/supabase-js ^2.49.4</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">@tanstack/react-query ^5.56.2</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">framer-motion ^10.16.4</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">axios ^1.8.4</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">recharts ^2.12.7</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">lucide-react ^0.484.0</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Внешние сервисы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Supabase Auth</span>
                <Badge variant="outline">Настройка</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">OpenAI API</span>
                <Badge variant="outline">Интеграция</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Google PageSpeed API</span>
                <Badge variant="destructive">Не начато</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Stripe Payments</span>
                <Badge variant="destructive">Не начато</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resend Email</span>
                <Badge variant="destructive">Не начато</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Структура проекта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md overflow-auto">
            <pre className="text-sm">
{`src/
├── components/           # React компоненты (147 готовых)
│   ├── admin/           # Админ панель (85% готово)
│   ├── audit/           # SEO аудит (90% готово)
│   ├── auth/            # Аутентификация (70% готово)
│   ├── client/          # Клиентская панель (80% готово)
│   ├── features/        # Страницы функций (95% готово)
│   ├── navbar/          # Навигация (100% готово)
│   ├── position-tracker/# Отслеживание позиций (75% готово)
│   └── ui/              # UI компоненты (100% готово)
├── hooks/               # Пользовательские хуки (60% готово)
├── pages/               # Страницы приложения (85% готово)
├── services/            # API сервисы (45% готово)
│   ├── api/             # Основные API (40% готово)
│   ├── audit/           # Сервисы аудита (50% готово)
│   └── optimization/    # Оптимизация (30% готово)
├── types/               # TypeScript типы (80% готово)
└── utils/               # Утилиты (70% готово)`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            База данных и безопасность
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Схема базы данных (75% готово):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Готовые таблицы:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>analytics</li>
                    <li>audits</li>
                    <li>crawl_results</li>
                    <li>crawl_tasks</li>
                    <li>keyword_rankings</li>
                    <li>page_analysis</li>
                    <li>projects</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Требуют доработки:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>users (профили)</li>
                    <li>subscriptions (подписки)</li>
                    <li>payments (платежи)</li>
                    <li>notifications (уведомления)</li>
                    <li>settings (настройки)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">RLS политики:</h4>
              <p className="text-sm text-muted-foreground">
                Настройка Row Level Security политик для безопасности данных - 
                <Badge variant="destructive" className="ml-2">Требует реализации</Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalArchitecture;
