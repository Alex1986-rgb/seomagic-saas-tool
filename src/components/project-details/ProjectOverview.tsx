
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target,
  CheckCircle,
  AlertCircle,
  Database
} from 'lucide-react';

/**
 * Обзор проекта.
 *
 * Здесь были вписанные руками метрики: «Активных пользователей 150+ (+25%)»,
 * «Всего страниц 25+ (+15%)», «Время загрузки 1.2s (−20%)», «Уровень
 * безопасности: Высокий (+10%)», шкалы готовности «Общая 85%, Frontend 90%,
 * Backend 80%…» и «последние достижения» с датами января 2024 года. Ни одна
 * цифра не считалась: ста пятидесяти пользователей нет, проценты готовности
 * сгенерированы вместе с этой страницей, даты придуманы. Владелец открывал
 * страницу из админки и видел ложную картину.
 *
 * Выдуманные метрики убраны. Настоящее число пользователей — в разделе
 * пользователей админки, где оно считается по базе.
 */
const ProjectOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Общая информация о проекте
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">О проекте SeoMarket</h3>
              <p className="text-muted-foreground mb-4">
                SeoMarket - это комплексная платформа для SEO-аудита и оптимизации веб-сайтов. 
                Проект предоставляет инструменты для глубокого анализа сайтов, автоматического 
                исправления ошибок и отслеживания позиций в поисковых системах.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Supabase</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Vite</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ключевые особенности</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Автоматический SEO-аудит</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>ИИ-powered оптимизация</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Отслеживание позиций</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Детальная аналитика</span>
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>Интеграция с CMS (в разработке)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Реальные показатели */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Пользователи и активность
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Число пользователей, аудитов и оптимизаций здесь не показывается: раньше в этом блоке 
            стояли вписанные вручную цифры. Настоящие данные считаются по базе в разделе{' '}
            <Link to="/admin/users" className="text-primary hover:underline">
              «Пользователи» админки
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      {/* Technical Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Технологический стек
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Frontend</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>React 18</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>TypeScript</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tailwind CSS</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Framer Motion</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Backend</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Supabase</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>PostgreSQL</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Edge Functions</span>
                  <Badge variant="outline">Тестирование</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Real-time API</span>
                  <Badge variant="outline">Интеграция</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Инструменты</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Vite</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>ESLint</span>
                  <Badge variant="outline">Настроено</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Prettier</span>
                  <Badge variant="outline">Настроено</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Lovable</span>
                  <Badge variant="outline">Активно</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
