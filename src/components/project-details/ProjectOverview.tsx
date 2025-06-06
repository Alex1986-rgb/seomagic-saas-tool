
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Search, 
  Zap, 
  Target,
  Users,
  BarChart3,
  Code,
  Shield,
  Clock,
  CheckCircle2
} from 'lucide-react';

const ProjectOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Обзор проекта SeoMarket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Описание проекта</h3>
              <p className="text-muted-foreground mb-4">
                SeoMarket - это полностью автоматизированная платформа для SEO аудита и оптимизации сайтов. 
                Система выполняет глубокое сканирование сайтов, анализирует SEO параметры, использует ИИ для 
                оптимизации контента и создает готовую к продакшн версию с исправленными HTML параметрами.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Готовность к продакшн</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Ключевые возможности</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Рекурсивное сканирование сайтов</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">ИИ-оптимизация контента (OpenAI)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Автоматическое исправление HTML</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Публикация на поддомен</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Генерация PDF отчетов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Отслеживание позиций</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">1000+</div>
            <div className="text-sm text-muted-foreground">Проанализированных сайтов</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-muted-foreground">Успешных оптимизаций</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-muted-foreground">Готовых модулей системы</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Технологический стек
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Frontend</Badge>
              <div className="text-sm space-y-1">
                <div>React + TypeScript</div>
                <div>Tailwind CSS</div>
                <div>Shadcn/UI</div>
                <div>React Query</div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Backend</Badge>
              <div className="text-sm space-y-1">
                <div>Python + FastAPI</div>
                <div>Celery + Redis</div>
                <div>PostgreSQL</div>
                <div>BeautifulSoup</div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">AI/ML</Badge>
              <div className="text-sm space-y-1">
                <div>OpenAI GPT-4</div>
                <div>Content Analysis</div>
                <div>SEO Optimization</div>
                <div>Schema Generation</div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Infrastructure</Badge>
              <div className="text-sm space-y-1">
                <div>Beget VPS</div>
                <div>Docker + Compose</div>
                <div>Nginx + SSL</div>
                <div>GitHub Actions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow системы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Search className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-semibold mb-1">Сканирование</h4>
              <p className="text-xs text-muted-foreground">Обход всех страниц сайта</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h4 className="font-semibold mb-1">Анализ</h4>
              <p className="text-xs text-muted-foreground">SEO аудит всех элементов</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h4 className="font-semibold mb-1">Оптимизация</h4>
              <p className="text-xs text-muted-foreground">ИИ улучшение контента</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Code className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-semibold mb-1">Исправление</h4>
              <p className="text-xs text-muted-foreground">Правка HTML кода</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <h4 className="font-semibold mb-1">Упаковка</h4>
              <p className="text-xs text-muted-foreground">Создание архива</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Globe className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
              <h4 className="font-semibold mb-1">Публикация</h4>
              <p className="text-xs text-muted-foreground">Размещение на сервере</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
